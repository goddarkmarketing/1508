# Face anonymizer (batch)

Blurs faces in `web/public` images for privacy.

Based on [Face-Anonymizer](https://github.com/SuvirSarabhai/Face-Anonymizer) (MediaPipe),
plus OpenCV **YuNet** for group / multi-scale faces.

## Setup (once)

```bash
python -m pip install mediapipe opencv-python-headless pillow numpy
```

Models (already in this folder if downloaded):

- `face_detector.tflite` — MediaPipe BlazeFace short-range
- `face_detection_yunet.onnx` — OpenCV YuNet

## Run

```bash
# All images under web/public (skips logo/qr/icon names)
python anonymize.py

# Dry run
python anonymize.py --dry-run

# Only some folders
python anonymize.py --only moments gallery
```

Originals of changed files are copied to `backup/` (first time only per path).
