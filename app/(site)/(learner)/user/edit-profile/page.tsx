import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserProfile } from "@/server/account"
import { ProfileForm } from "@/components/account/form/profile-form";

const EditProfilePage = async() => {
    
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return redirect("/");
    }

    const profile = await getUserProfile(session.user.id);

    if (!profile) {
        return redirect("/");
    }
    
    return (
        <div className="w-full h-full">
            <div className="px-6 md:px-10 pt-6 md:pt-8 pb-2 space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Public profile</h2>
                <p className="text-sm text-muted-foreground">This is what learners see on your courses and in reviews.</p>
            </div>
            <div className="p-6 md:px-10 md:pb-10">
                <ProfileForm
                    name={profile.name!}
                    description={profile.profile?.description||undefined}
                    gender={profile.profile?.gender||undefined}
                    headline={profile.profile?.headline||undefined}
                />
            </div>
        </div>
    )
}

export default EditProfilePage;