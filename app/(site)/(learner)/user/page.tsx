import { ArrowUpRight, Award, BarChart3, ShoppingCart, UserPen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth"
import { RoleForm } from "@/components/profile/form/role.form";
import { getUserCourses } from "@/server/course";
import { UserCourses } from "@/components/courses/ui/user-courses";
import { PageContainer } from "@/components/ui/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const ProfilePage = async() => {
    
    const session = await auth();
    if (!session || !session.user.id) {
        return redirect("/")
    }

    if (!session.user.profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
                <RoleForm/>
            </div>
        )
    }

    const courses = await getUserCourses(session.user.id);
    const isTutor = session.user.role === "TUTOR";

    const firstName = session.user.name?.split(" ")[0];
    const today = new Date().toLocaleDateString("en-IN", { weekday : "long", day : "numeric", month : "long" });

    const actions = [
        { href : "/user/edit-profile", label : "Edit profile", hint : "Name, bio and social links", icon : UserPen, tone : "bg-peri", show : true },
        { href : "/cart", label : "Cart", hint : "Courses waiting at checkout", icon : ShoppingCart, tone : "bg-peach", show : !isTutor },
        { href : "/user/certificates", label : "Certificates", hint : "Download and share", icon : Award, tone : "bg-mint", show : true },
        {
            href : isTutor ? "/tutor/analytics" : "/user/my-learning",
            label : isTutor ? "Analytics" : "My learning",
            hint : isTutor ? "Sales and engagement" : "Progress and study time",
            icon : BarChart3,
            tone : "bg-lilac",
            show : true
        },
    ].filter((action) => action.show);

    return (
        <div className="pb-10">
            <PageContainer className="pt-6 md:pt-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16 md:size-20 ring-4 ring-white">
                            <AvatarImage src={session.user?.image || ""} alt={session.user.name || "Profile"} />
                            <AvatarFallback className="text-2xl md:text-3xl">
                                {session.user.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{today}</p>
                            <h1 className="text-display-sm">
                                Hello, {firstName}
                            </h1>
                        </div>
                    </div>
                    <span className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-ink">
                        {isTutor ? "Tutor account" : "Learner account"}
                    </span>
                </div>

                <nav aria-label="Quick actions" className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {actions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={`group flex min-h-40 flex-col justify-between rounded-3xl p-5 text-ink transition-transform duration-300 hover:-translate-y-0.5 ${action.tone}`}
                        >
                            <div className="flex items-start justify-between">
                                <span className="size-12 rounded-full bg-ink text-white flex items-center justify-center" aria-hidden="true">
                                    <action.icon className="size-5" />
                                </span>
                                <span className="size-9 rounded-full bg-white/60 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium tracking-tight">{action.label}</h2>
                                <p className="text-xs text-ink-2">{action.hint}</p>
                            </div>
                        </Link>
                    ))}
                </nav>
            </PageContainer>

            <UserCourses />
        </div>
    )
}

export default ProfilePage