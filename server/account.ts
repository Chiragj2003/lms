// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";

export const getUserProfile = async(userId: string )=>{
    try {
        
        const profile = await db.user.findUnique({
            where: {
                id : userId
            },
            select : {
                name : true,
                profile : {
                    select : {
                        headline : true,
                        description : true,
                        dob : true,
                        gender : true,
                        websiteLink : true,
                        twitterLink : true,
                        facebookLink : true,
                        githubLink : true,
                        youtubeLink : true,
                        linkedinLink : true
                    }
                }
            }
        });

        return profile;

    } catch (error) {
        return null;
    }
}