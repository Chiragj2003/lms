"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { cn } from "@/lib/utils";

interface PreviewProps {
    value: string | null;
    className? : string;
}

// Read-only rich text should read like the rest of the page: no white panel,
// inherited text colour and font, and none of the editor's gutter padding
// (removed via the .bn-readonly rule in globals.css).
const READ_ONLY_THEME: Theme = {
    colors : {
        editor : {
            text : "inherit",
            background : "transparent",
        },
    },
    fontFamily : "inherit",
};

const Preview = ({
    value,
    className
} : PreviewProps ) => {

    const editor = useCreateBlockNote({
        initialContent : value ? JSON.parse(value) : undefined,
    });

    return (
        <BlockNoteView
            editor={editor}
            theme={READ_ONLY_THEME}
            editable={false}
            className={cn("bn-readonly", className)}
        />
    )
}

export default Preview;
