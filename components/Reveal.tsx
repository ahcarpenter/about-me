"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Whether each observed element should stop being watched after first reveal. */
const revealOnce = new WeakMap<Element, boolean>();
let observer: IntersectionObserver | null = null;

/** All Reveal instances share one observer instead of paying for one each. */
function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (revealOnce.get(entry.target)) observer?.unobserve(entry.target);
        } else if (revealOnce.get(entry.target) === false) {
          entry.target.classList.remove("is-visible");
        }
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  return observer;
}

/**
 * Scroll-reveal wrapper: adds `is-visible` when the element enters the
 * viewport. Pair with the `.reveal` / `.tl-item` styles in globals.css.
 */
export default function Reveal({
  children,
  className = "reveal",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    revealOnce.set(el, once);
    getObserver().observe(el);
    return () => {
      getObserver().unobserve(el);
      revealOnce.delete(el);
    };
  }, [once]);

  return (
    <div ref={ref} className={className} style={{ ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
