import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


interface CardSkeletonProps {
    className? : string;
    isBestSeller? :boolean;
}

export const CardSkeleton = ({
    className,
    isBestSeller
} : CardSkeletonProps ) => {
    return (
        <div className={cn(
            "w-full space-y-5 p-2.5 pb-5 bg-white rounded-[28px] group",
            className
        )}>
            <Skeleton className='w-full aspect-video rounded-[22px]'/>
            <div className="w-full space-y-3 px-3">
                <div className='space-y-1.5'>
                    <Skeleton className='w-full h-5'/>
                    <Skeleton className='w-36 h-5'/>
                </div>
                <Skeleton className='w-24 h-5'/>
                { isBestSeller && (<Skeleton className='w-24 h-8 rounded-full'/>) }
            </div>
        </div>
    )
}
