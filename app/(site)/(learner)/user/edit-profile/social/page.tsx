import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserProfile } from "@/server/account";
import { SocialForm } from "@/components/account/form/social-form";

export const metadata : Metadata = {
    title : "Social accounts"
};

const EditSocialPage = async () => {

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return redirect("/");
    }

    const profile = await getUserProfile(session.user.id);

    if (!profile?.profile) {
        return redirect("/");
    }

    return (
        <div className="w-full h-full">
            <div className="px-6 md:px-10 pt-6 md:pt-8 pb-2 space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Social accounts</h2>
                <p className="text-sm text-muted-foreground">Links shown with your profile on your courses. Leave a field empty to hide it.</p>
            </div>
            <div className="p-6 md:px-10 md:pb-10">
                <SocialForm initialData={profile.profile} />
            </div>
        </div>
    );
};

export default EditSocialPage;
