import { useState, useLayoutEffect, useRef } from 'react';

// Hook that returns a ref and the measured width/height of that element.
// It uses ResizeObserver to keep measurements up-to-date.
export default function useMeasure() {
  const ref = useRef(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = (r) => {
      setRect({ width: Math.round(r.width), height: Math.round(r.height) });
    };

    // initial measure
    const initial = el.getBoundingClientRect();
    update(initial);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        update(cr);
      }
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref]);

  return [ref, rect];
}
