"use client";

import { useEffect, useRef } from "react";
import { useFeedback } from "@/components/feedback/feedback-context";
import {
  findSelectableElement,
  isFeedbackUiElement,
} from "@/lib/feedback-selector";

export function FeedbackOverlay() {
  const {
    feedbackMode,
    selectElement,
    hoveredRect,
    setHoveredRect,
    modalOpen,
  } = useFeedback();
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedbackMode || modalOpen) {
      setHoveredRect(null);
      return;
    }

    function onMove(event: MouseEvent) {
      const target = findSelectableElement(event.clientX, event.clientY);
      if (!target || isFeedbackUiElement(target)) {
        setHoveredRect(null);
        return;
      }
      setHoveredRect(target.getBoundingClientRect());
    }

    function onClick(event: MouseEvent) {
      const target = findSelectableElement(event.clientX, event.clientY);
      if (!target || isFeedbackUiElement(target)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(target);
    }

    function blockInteraction(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (isFeedbackUiElement(target)) return;
      if (!feedbackMode || modalOpen) return;
      event.preventDefault();
      event.stopPropagation();
    }

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", blockInteraction, true);
    document.addEventListener("mouseup", blockInteraction, true);
    document.addEventListener("touchstart", blockInteraction, true);
    document.addEventListener("touchend", blockInteraction, true);

    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousedown", blockInteraction, true);
      document.removeEventListener("mouseup", blockInteraction, true);
      document.removeEventListener("touchstart", blockInteraction, true);
      document.removeEventListener("touchend", blockInteraction, true);
      setHoveredRect(null);
    };
  }, [feedbackMode, modalOpen, selectElement, setHoveredRect]);

  if (!feedbackMode || modalOpen || !hoveredRect) return null;

  return (
    <div
      ref={highlightRef}
      data-feedback-ui
      className="pointer-events-none fixed z-[99980] rounded-sm border-2 border-brand bg-brand/10 shadow-[0_0_0_1px_rgba(220,38,38,0.25)]"
      style={{
        left: hoveredRect.left,
        top: hoveredRect.top,
        width: hoveredRect.width,
        height: hoveredRect.height,
      }}
    />
  );
}
