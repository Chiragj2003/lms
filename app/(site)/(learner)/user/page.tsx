import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth"
import { RoleForm } from "@/components/profile/form/role.form";
import { getUserCourses } from "@/server/course";
import { UserCourses } from "@/components/courses/ui/user-courses";
import { PageContainer } from "@/components/ui/page-container";


const ProfilePage = async() => {
    
    const session = await auth();
    if (!session || !session.user.id) {
        return redirect("/")
    }

    if (!session.user.profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <RoleForm/>
            </div>
        )
    }

    const courses = await getUserCourses(session.user.id);
    const isTutor = session.user.role === "TUTOR";

    return (
        <div className="min-h-screen pb-20">
            {/* Profile Header */}
            <section className="bg-zinc-900 pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
                <PageContainer className="relative z-10">
                    <div className="flex items-center gap-x-6 md:gap-x-10">
                        <div className="h-24 md:h-32 aspect-square relative rounded-full overflow-hidden border-4 border-zinc-800 shadow-xl">
                            <Image
                                src={session.user?.image || ""}
                                alt={session.user.name || "Profile Image"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Welcome back, {session.user.name?.split(" ")[0]}!
                            </h1>
                            <p className="text-zinc-400 font-medium md:text-lg">
                                {isTutor ? "Tutor Dashboard" : "Learner Dashboard"}
                            </p>
                        </div>
                    </div>
                </PageContainer>
            </section>

            {/* Quick Actions Grid */}
            <section className="-mt-10 px-4 md:px-0 relative z-20">
                <PageContainer>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <Link 
                            className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-white"
                            href="/user/edit-profile"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                <Image
                                    src="/assets/profile.png"
                                    alt="Edit Profile"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm md:text-base">Edit Profile</h3>
                        </Link>
                        
                        {!isTutor && (
                            <Link
                                className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-white"
                                href="/cart"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                    <Image
                                        src="/assets/cart.png"
                                        alt="Cart"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm md:text-base">Cart</h3>
                            </Link>
                        )}
                        
                        <Link 
                            className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-white"
                            href="/user/certificates"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                <Image
                                    src="/assets/color-certificate.png"
                                    alt="Certificates"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm md:text-base">My Certificates</h3>
                        </Link>
                        
                        <Link
                            className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-white"
                            href={isTutor ? "/tutor/analytics" : "/user/my-learning"}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 relative mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                <Image
                                    src="/assets/analyse.png"
                                    alt="Analytics"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm md:text-base">
                                {isTutor ? "Analytics" : "My Learning"}
                            </h3>
                        </Link>
                    </div>
                </PageContainer>
            </section>

            {/* User Courses Section */}
            <div className="mt-16">
                <UserCourses />
            </div>
        </div>
    )
}

export default ProfilePage