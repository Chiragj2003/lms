import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and hydration, true once running in the
 * browser. Replaces the `useState(false)` + `useEffect(() => set(true))`
 * pattern, which renders twice and trips react-hooks/set-state-in-effect.
 */
export const useMounted = () =>
    useSyncExternalStore(subscribe, () => true, () => false);
