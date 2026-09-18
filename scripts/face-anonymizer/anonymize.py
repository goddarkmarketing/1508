"""
Batch face anonymizer for GGM website images.

Primary: OpenCV YuNet (multi-scale, good for group photos)
Secondary: MediaPipe BlazeFace (from Face-Anonymizer)
https://github.com/SuvirSarabhai/Face-Anonymizer
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision
from PIL import Image

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_MP_MODEL = SCRIPT_DIR / "face_detector.tflite"
DEFAULT_YUNET = SCRIPT_DIR / "face_detection_yunet.onnx"
DEFAULT_ROOT = Path(__file__).resolve().parents[2] / "web" / "public"
IMAGE_EXTS = {".webp", ".jpg", ".jpeg", ".png"}
SKIP_NAME_PARTS = {"logo", "qr", "favicon", "icon"}


def load_mediapipe(model_path: Path, min_confidence: float) -> vision.FaceDetector:
    options = vision.FaceDetectorOptions(
        base_options=mp_python.BaseOptions(model_asset_path=str(model_path)),
        min_detection_confidence=min_confidence,
    )
    return vision.FaceDetector.create_from_options(options)


def read_bgr(path: Path) -> np.ndarray | None:
    try:
        with Image.open(path) as im:
            rgb = np.array(im.convert("RGB"))
            return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    except Exception as exc:  # noqa: BLE001
        print(f"  skip read error: {path.name}: {exc}")
        return None


def write_image(path: Path, bgr: np.ndarray) -> None:
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    im = Image.fromarray(rgb)
    suffix = path.suffix.lower()
    if suffix == ".webp":
        im.save(path, "WEBP", quality=85, method=6)
    elif suffix in {".jpg", ".jpeg"}:
        im.save(path, "JPEG", quality=90, optimize=True)
    else:
        im.save(path)


def expand_box(
    x1: int, y1: int, x2: int, y2: int, w: int, h: int, pad: float
) -> tuple[int, int, int, int]:
    bw, bh = x2 - x1, y2 - y1
    dx, dy = int(bw * pad), int(bh * pad)
    return max(0, x1 - dx), max(0, y1 - dy), min(w, x2 + dx), min(h, y2 + dy)


def boxes_from_yunet(img: np.ndarray, model_path: Path, score_threshold: float) -> list[tuple[int, int, int, int]]:
    if not model_path.exists():
        return []
    h, w = img.shape[:2]
    detector = cv2.FaceDetectorYN.create(
        str(model_path),
        "",
        (w, h),
        score_threshold=score_threshold,
        nms_threshold=0.3,
        top_k=50,
    )
    detector.setInputSize((w, h))
    _, faces = detector.detect(img)
    boxes: list[tuple[int, int, int, int]] = []
    if faces is None:
        return boxes
    for face in faces:
        x, y, bw, bh = face[:4].astype(int)
        boxes.append((x, y, x + bw, y + bh))
    return boxes


def boxes_from_mediapipe(
    img: np.ndarray, detector: vision.FaceDetector
) -> list[tuple[int, int, int, int]]:
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = detector.detect(mp_img)
    boxes: list[tuple[int, int, int, int]] = []
    for detection in result.detections or []:
        bbox = detection.bounding_box
        boxes.append(
            (
                bbox.origin_x,
                bbox.origin_y,
                bbox.origin_x + bbox.width,
                bbox.origin_y + bbox.height,
            )
        )
    return boxes


def iou(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> float:
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1, iy1 = max(ax1, bx1), max(ay1, by1)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)
    iw, ih = max(0, ix2 - ix1), max(0, iy2 - iy1)
    inter = iw * ih
    if inter == 0:
        return 0.0
    area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
    area_b = max(0, bx2 - bx1) * max(0, by2 - by1)
    return inter / (area_a + area_b - inter + 1e-6)


def merge_boxes(
    boxes: list[tuple[int, int, int, int]], thresh: float = 0.35
) -> list[tuple[int, int, int, int]]:
    kept: list[tuple[int, int, int, int]] = []
    for box in sorted(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]), reverse=True):
        if any(iou(box, k) > thresh for k in kept):
            continue
        kept.append(box)
    return kept


def blur_boxes(
    img: np.ndarray,
    boxes: list[tuple[int, int, int, int]],
    pad: float = 0.3,
    kernel: int = 99,
    sigma: float = 30.0,
) -> tuple[np.ndarray, int]:
    output = img.copy()
    h, w = output.shape[:2]
    count = 0
    for x1, y1, x2, y2 in boxes:
        x1, y1, x2, y2 = expand_box(x1, y1, x2, y2, w, h, pad)
        roi = output[y1:y2, x1:x2]
        if roi.size == 0:
            continue
        k = kernel
        min_side = min(roi.shape[0], roi.shape[1])
        if min_side < k:
            k = max(3, (min_side // 2) * 2 + 1)
        output[y1:y2, x1:x2] = cv2.GaussianBlur(roi, (k, k), sigma)
        count += 1
    return output, count


def anonymize(
    img: np.ndarray,
    mp_detector: vision.FaceDetector,
    yunet_path: Path,
) -> tuple[np.ndarray, int]:
    boxes = []
    boxes.extend(boxes_from_yunet(img, yunet_path, score_threshold=0.45))
    # Also run on a downscaled copy for large group shots (helps tiny faces).
    h, w = img.shape[:2]
    if max(h, w) > 1400:
        scale = 1400 / max(h, w)
        small = cv2.resize(img, (int(w * scale), int(h * scale)))
        for x1, y1, x2, y2 in boxes_from_yunet(small, yunet_path, 0.4):
            boxes.append(
                (
                    int(x1 / scale),
                    int(y1 / scale),
                    int(x2 / scale),
                    int(y2 / scale),
                )
            )
    boxes.extend(boxes_from_mediapipe(img, mp_detector))
    merged = merge_boxes(boxes)
    return blur_boxes(img, merged)


def should_skip(path: Path) -> bool:
    name = path.stem.lower()
    return any(part in name for part in SKIP_NAME_PARTS)


def iter_images(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in IMAGE_EXTS:
            continue
        if should_skip(path):
            continue
        files.append(path)
    return files


def main() -> int:
    parser = argparse.ArgumentParser(description="Blur faces in website images")
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    parser.add_argument("--mp-model", type=Path, default=DEFAULT_MP_MODEL)
    parser.add_argument("--yunet", type=Path, default=DEFAULT_YUNET)
    parser.add_argument("--backup", type=Path, default=SCRIPT_DIR / "backup")
    parser.add_argument("--confidence", type=float, default=0.3)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--only", nargs="*", default=None)
    args = parser.parse_args()

    if not args.mp_model.exists():
        print(f"MediaPipe model not found: {args.mp_model}", file=sys.stderr)
        return 1
    if not args.root.exists():
        print(f"Root not found: {args.root}", file=sys.stderr)
        return 1

    mp_detector = load_mediapipe(args.mp_model, args.confidence)
    images = iter_images(args.root)
    if args.only:
        prefixes = [p.replace("\\", "/").strip("/") for p in args.only]
        images = [
            p
            for p in images
            if any(
                p.relative_to(args.root).as_posix().startswith(pref)
                for pref in prefixes
            )
        ]

    print(f"Scanning {len(images)} images under {args.root}")
    touched = 0
    faces_total = 0

    for path in images:
        rel = path.relative_to(args.root).as_posix()
        img = read_bgr(path)
        if img is None:
            continue
        blurred, n = anonymize(img, mp_detector, args.yunet)
        if n == 0:
            continue
        faces_total += n
        touched += 1
        print(f"  [{n} face(s)] {rel}")
        if args.dry_run:
            continue
        backup_path = args.backup / rel
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        if not backup_path.exists():
            shutil.copy2(path, backup_path)
        write_image(path, blurred)

    print(f"Done. Blurred {faces_total} face(s) across {touched} image(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
