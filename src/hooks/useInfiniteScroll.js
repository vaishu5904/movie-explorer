import { useEffect, useRef } from "react";

export default function useInfiniteScroll(onIntersect, enabled) {
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return targetRef;
}
