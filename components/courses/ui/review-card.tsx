import { formatDistance } from "date-fns";
import { Stars } from "@/components/rating/stars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Rate } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Calendar } from "lucide-react";

interface ReviewCardProps {
    review : Rate & { user: {
        image: string | null;
        name: string | null;
    }}
}

export const ReviewCard = ({
    review
}: ReviewCardProps ) => {
    return (
        <div className="w-full relative z-10 bg-muted/30 rounded-xl p-6 space-y-4 border border-border">
            <div className="flex items-center gap-x-6">
                <Avatar className="bg-muted">
                    <AvatarImage src={review.user.image??""} />
                    <AvatarFallback className="bg-muted text-foreground font-semibold" >{review.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full flex items-end flex-wrap justify-between">
                    <div className="flex flex-col gap-y-1">
                        <h3 className="text-foreground text-[15px] font-medium" >{review.user.name}</h3>
                        <Stars avgRating={`${review.star}`} />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Calendar className="size-4 text-muted-foreground"/>
                        <span className="text-[13px] text-muted-foreground">{formatDistance(review.updatedAt, new Date(), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
            <p className="text-muted-foreground text-[15px] font-medium" >{review.comment}</p>
        </div>
    )
}
