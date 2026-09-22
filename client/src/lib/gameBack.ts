import { createContext, useContext, useEffect, useRef } from "react";

export type BackEntry = { priority: number; run: () => void };
export const GameBackContext = createContext<(entry: BackEntry) => () => void>(() => () => {});

/** Register a parent destination, never undo answers or experiment changes. */
export function useGameBack(enabled: boolean, onBack: () => void, priority = 10) {
  const register = useContext(GameBackContext);
  const current = useRef(onBack);
  current.current = onBack;
  useEffect(() => {
    if (!enabled) return;
    return register({ priority, run: () => current.current() });
  }, [enabled, priority, register]);
}
