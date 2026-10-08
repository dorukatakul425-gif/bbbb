import { useEffect, useRef } from "react";

/** Lift the intact game above the keyboard instead of shrinking its chat area. */
export function useChatViewport() {
  const appRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    const app = appRef.current;
    if (!app) return;
    let frame = 0;
    let fullHeight = viewport?.height ?? window.innerHeight;
    let keyboardWasOpen = false;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const height = viewport?.height ?? window.innerHeight;
        const focused = document.activeElement === inputRef.current;
        // Pinch zoom remains available; only synchronize the keyboard at normal scale.
        if (viewport && Math.abs(viewport.scale - 1) > 0.05) return;
        fullHeight = Math.max(fullHeight, height);
        // Keep the original height through dismissal, even after input loses focus.
        const keyboardOpen = (focused || keyboardWasOpen) && fullHeight - height > 100;
        if (!keyboardOpen && !focused) fullHeight = height;
        const appHeight = keyboardOpen ? fullHeight : height;
        const top = (viewport?.offsetTop ?? 0) + height - appHeight;
        app.style.setProperty("--chat-viewport-height", `${appHeight}px`);
        app.style.setProperty("--chat-viewport-top", `${top}px`);
        // Do not change the inner scroll position: every section moves together.
        keyboardWasOpen = keyboardOpen;
      });
    };

    const resetOrientation = () => {
      fullHeight = viewport?.height ?? window.innerHeight;
      update();
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", resetOrientation);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      window.cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", resetOrientation);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  return { appRef, scrollRef, inputRef };
}