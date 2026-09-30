"use client";

import dynamic from "next/dynamic";

// BlockNote can't render on the server, so it's loaded client-only. Defined
// once at module scope: calling dynamic() inside a component (the previous
// useMemo pattern) created a new component type per mount, resetting state.
export const RichText = dynamic(() => import("@/components/utils/preview"), { ssr : false });
