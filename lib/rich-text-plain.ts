/**
 * Plain text from a BlockNote document (the JSON stored in description
 * fields). Falls back to the raw value if it isn't BlockNote JSON.
 */
export const richTextToPlain = (value: string | null | undefined): string => {
    if (!value) return "";
    try {
        const parts: string[] = [];
        const walk = (node: unknown) => {
            if (Array.isArray(node)) {
                node.forEach(walk);
            } else if (node && typeof node === "object") {
                const n = node as { type?: string; text?: string; content?: unknown; children?: unknown };
                if (n.type === "text" && typeof n.text === "string") parts.push(n.text);
                walk(n.content);
                walk(n.children);
                if (n.type && n.type !== "text") parts.push("\n");
            }
        };
        walk(JSON.parse(value));
        return parts.join("").replace(/\n{3,}/g, "\n\n").trim();
    } catch {
        return value;
    }
};
