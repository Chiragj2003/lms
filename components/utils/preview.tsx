"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { cn } from "@/lib/utils";

interface PreviewProps {
    value: string | null; 
    className? : string;
}

const Preview = ({
    value,
    className
} : PreviewProps ) => {

    const editor = useCreateBlockNote({
        initialContent : value ? JSON.parse(value) : undefined,
    });

    return (
        <div className="bg-white">
            {/* ponytail: BlockNote 0.15 BlockNoteView types clash with React 19; runtime is fine. Upgrade to BlockNote 0.5x (needs @mantine/core peer + editor runtime test) to drop this. */}
            <BlockNoteView
                // @ts-expect-error - BlockNoteView editor prop typing vs React 19
                editor={editor}
                theme="light"
                editable={false}
                className={cn(className)}
            />
        </div>
    )
}

export default Preview;