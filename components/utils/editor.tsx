"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/providers/edgestore.provider";

interface EditorProps {
    onChange : ( value: string )=>void;
    value: string;
    className? : string;   
}

const Editor = ({
    onChange,
    value,
    className
} : EditorProps ) => {

    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const res = await edgestore.publicFiles.upload({
            file
        });
        return res.url;
    }

    const editor = useCreateBlockNote({
        initialContent : value ? JSON.parse(value) : undefined,
        uploadFile : handleUpload
    });

    return (
        <div className={cn(
            "min-h-60 h-auto bg-white w-full px-16",
            className
        )}>
            {/* ponytail: BlockNote 0.15 BlockNoteView types clash with React 19; runtime is fine. Upgrade to BlockNote 0.5x (needs @mantine/core peer + editor runtime test) to drop this. */}
            <BlockNoteView
                // @ts-expect-error - BlockNoteView editor prop typing vs React 19
                editor={editor}
                theme="light"
                onChange={()=>onChange(JSON.stringify(editor.document, null, 2))}
            />
        </div>
    )
}

export default Editor;
