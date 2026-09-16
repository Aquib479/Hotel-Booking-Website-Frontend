import { useEffect } from "react";

/** Prevents page scroll while a modal/dropdown is open. */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      htmlOverflow: documentElement.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    const prevent = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-scroll-lock-allow]")) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      documentElement.style.overflow = previous.htmlOverflow;
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
