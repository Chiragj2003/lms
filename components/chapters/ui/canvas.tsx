"use client";

import { useMemo } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useCanvas } from "@/hooks/use-canvas";
import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
// Excalidraw 0.18 no longer bundles its own stylesheet; without this the
// canvas renders as an unstyled, unusable mess.
import "@excalidraw/excalidraw/index.css";
import "./style.css";

interface CanvasProps {
    chapterId: string;
}

export const Canvas = ({
    chapterId
} : CanvasProps ) => {

    const { getCanvasValue, setCanvasValue } = useCanvas();

    const onUpdate = (e: readonly ExcalidrawElement[])=>{
        const value = JSON.stringify(e);
        if (e.length!==0 && value!==getCanvasValue(chapterId)){
            setCanvasValue(chapterId, value)
        }
    }

    // Excalidraw only reads initialData when it mounts, so the saved drawing
    // has to be ready on the first render (it used to arrive one render late,
    // via an effect, and was ignored).
    const initialData = useMemo<ExcalidrawElement[]>(()=>{
        const canvasValue = getCanvasValue(chapterId);
        if (!canvasValue) return [];
        try {
            return JSON.parse(canvasValue);
        } catch {
            return [];
        }
    }, [chapterId, getCanvasValue]);

    return (
        <div className="h-full">
            <Excalidraw
                key={chapterId}
                isCollaborating={false}
                theme="light"
                initialData={{
                    elements : initialData
                }}
                onChange={onUpdate}
            />
        </div>
    )
}
