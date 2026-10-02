import * as z from "zod";

// An empty field clears the link. Anything else must be a plain http(s) URL:
// these are rendered as links on course pages, so a `javascript:` URL would
// run in a learner's browser.
const link = z
    .string()
    .trim()
    .max(500, { message : "Link is too long" })
    .refine((value) => {
        if (value === "") return true;
        try {
            const url = new URL(value);
            return url.protocol === "https:" || url.protocol === "http:";
        } catch {
            return false;
        }
    }, { message : "Enter a full link starting with https://" });

export const SocialSchema = z.object({
    websiteLink : link,
    linkedinLink : link,
    githubLink : link,
    twitterLink : link,
    youtubeLink : link,
    facebookLink : link,
}).strict();

export type SocialValues = z.infer<typeof SocialSchema>;
