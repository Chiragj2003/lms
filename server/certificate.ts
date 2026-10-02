// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";

export const getCertificateById = async(id: string)=>{
    try {
        
        const certificate = await db.cerificate.findUnique({
            where : {
                id 
            },
            include : {
                user : {
                    select : {
                        name : true,
                        id : true
                    }
                },
                course : {
                    select : {
                        title : true,
                        tutor : {
                            select : {
                                name : true
                            }
                        }
                    }
                }
            }
        });

        return certificate;

    } catch (error) {
        console.error("CERTIFICATE SERVER API ERRRO", error);
        return null;
    }
}


export const getUserCertificates = async (userId: string) => {
    try {
        
        const certificates = await db.cerificate.findMany({
            where : {
                userId
            },
            include : {
                course : {
                    select : {
                        id : true,
                        image : true,
                        title : true
                    }
                }
            },
            orderBy : {
                createdAt : "asc"
            }
        });

        return certificates;

    } catch (error) {
        return [];
    }
}