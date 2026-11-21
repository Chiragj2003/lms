/**
 * Artwork for a category tile, picked from the category (or sub-category)
 * name. Names that match nothing rotate through the set by position.
 */
const ART = {
    development : "/assets/illustrations/cat-development.webp",
    business : "/assets/illustrations/cat-business.webp",
    design : "/assets/illustrations/cat-design.webp",
    finance : "/assets/illustrations/cat-finance.webp",
    marketing : "/assets/illustrations/cat-marketing.webp",
} as const;

const MATCHERS: [RegExp, keyof typeof ART][] = [
    [/develop|programming|data|database|mobile|web|software|code|engineer/i, "development"],
    [/design|ui|ux|graphic|illustrat/i, "design"],
    [/financ|account|invest|money|econom/i, "finance"],
    [/market|seo|social|brand|advertis|content/i, "marketing"],
    [/business|entrepreneur|manage|leader|strateg|operation|project/i, "business"],
];

const ORDER = Object.values(ART);

export const categoryArt = (name: string, index = 0): string => {
    const match = MATCHERS.find(([pattern]) => pattern.test(name));
    return match ? ART[match[1]] : ORDER[index % ORDER.length];
};
