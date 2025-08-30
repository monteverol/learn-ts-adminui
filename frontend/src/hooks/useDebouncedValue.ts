// src/hooks/useDebouncedValue.ts
import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<number | null>(null);
  const debouncedRef = useRef(debounced);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  useEffect(() => {
    debouncedRef.current = debounced;
  }, [debounced]);

  return { debounced, debouncedRef, cancel() { if (timerRef.current) window.clearTimeout(timerRef.current); } };
}
