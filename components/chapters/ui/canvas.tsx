"use client";

import { useEffect, useState } from "react";
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
    const [initialData, setInitialData] = useState<ExcalidrawElement[]>([]);

    const onUpdate = (e: readonly ExcalidrawElement[])=>{
        const value = JSON.stringify(e);
        if (e.length!==0 && value!==getCanvasValue(chapterId)){
            setCanvasValue(chapterId, value)
        }
    }

    useEffect(()=>{
        const canvasValue = getCanvasValue(chapterId);
        if (canvasValue) {
            setInitialData(JSON.parse(canvasValue));
        }
    }, [chapterId, getCanvasValue]);

    return (
        <div className="h-full">
            <Excalidraw
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
