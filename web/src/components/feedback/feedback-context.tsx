"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getClientSession } from "@/lib/auth";
import {
  clearPreviewSession,
  hasPreviewSession,
  isPreviewMode,
  setPreviewSession,
  verifyPreviewToken,
} from "@/lib/feedback-preview";
import { collectElementMeta } from "@/lib/feedback-selector";
import type { FeedbackElementMeta } from "@/types";

type FeedbackContextValue = {
  previewActive: boolean;
  feedbackMode: boolean;
  setFeedbackMode: (active: boolean) => void;
  selectedElement: Element | null;
  selectedMeta: FeedbackElementMeta | null;
  selectElement: (element: Element) => void;
  clearSelection: () => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  hoveredRect: DOMRect | null;
  setHoveredRect: (rect: DOMRect | null) => void;
  exitPreview: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [previewActive, setPreviewActive] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<FeedbackElementMeta | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const syncPreview = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const token = params.get("preview");
      if (token && verifyPreviewToken(token)) {
        setPreviewSession();
      }
      setPreviewActive(isPreviewMode());
    };

    syncPreview();
    window.addEventListener("focus", syncPreview);
    return () => window.removeEventListener("focus", syncPreview);
  }, []);

  const selectElement = useCallback((element: Element) => {
    setSelectedElement(element);
    setSelectedMeta(collectElementMeta(element));
    setModalOpen(true);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setSelectedMeta(null);
  }, []);

  const exitPreview = useCallback(() => {
    if (!getClientSession()) {
      clearPreviewSession();
    }
    setPreviewActive(false);
    setFeedbackMode(false);
    clearSelection();
    setModalOpen(false);
  }, [clearSelection]);

  const value = useMemo(
    () => ({
      previewActive,
      feedbackMode,
      setFeedbackMode,
      selectedElement,
      selectedMeta,
      selectElement,
      clearSelection,
      modalOpen,
      setModalOpen,
      hoveredRect,
      setHoveredRect,
      exitPreview,
    }),
    [
      previewActive,
      feedbackMode,
      selectedElement,
      selectedMeta,
      selectElement,
      clearSelection,
      modalOpen,
      hoveredRect,
      exitPreview,
    ],
  );

  return (
    <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}

export function usePreviewActive() {
  const context = useContext(FeedbackContext);
  return context?.previewActive ?? false;
}

export function useHasPreviewSession() {
  return hasPreviewSession();
}
