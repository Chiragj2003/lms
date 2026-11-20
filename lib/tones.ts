/**
 * Pastel tile tones from the design system. Content tiles (course covers,
 * category cards, stat cards) rotate through these so a grid never repeats
 * the same colour side by side. Text on every tone stays ink (#121216).
 *
 * Classes are written out in full so Tailwind can see them.
 */
export const TONES = [
    { bg: "bg-peri", soft: "bg-peri-soft" },
    { bg: "bg-lilac", soft: "bg-lilac-soft" },
    { bg: "bg-peach", soft: "bg-peach-soft" },
    { bg: "bg-mint", soft: "bg-mint-soft" },
    { bg: "bg-sun", soft: "bg-sun-soft" },
    { bg: "bg-aqua", soft: "bg-aqua-soft" },
] as const;

export type Tone = (typeof TONES)[number];

/** A stable tone for a string key (e.g. a course id), or by list index. */
export const toneFor = (key: string | number): Tone => {
    if (typeof key === "number") {
        return TONES[Math.abs(key) % TONES.length];
    }
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }
    return TONES[Math.abs(hash) % TONES.length];
};
