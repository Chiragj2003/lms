import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { useSWRQuery } from '@/hooks/useSWRQuery';
import { CardSkeleton } from '../courses/ui/card-skeleton';
import { Course } from '@/types';
import { CardWithRating } from '../courses/ui/card-with-ratings';


interface CourseCarouselProps {
    href : string,
    bestseller? : boolean
}

interface ResponseData {
    data : Course[];
    isLoading : boolean;
}

export const CourseCarousel = ({
    href,
    bestseller
} : CourseCarouselProps) => {
    const {data, isLoading }: ResponseData = useSWRQuery(href); 
    
    if ( !isLoading && data?.length === 0 ) {
        return null;
    }

    return (
        <div className="space-y-6 md:space-y-10 w-full">
            <Carousel
                className="w-full space-y-3"
                opts = {{
                    align : "start",
                    slidesToScroll : "auto"
                }}
            >
                <div className="h-11 hidden md:flex justify-end gap-2 relative">
                    <CarouselPrevious className="static translate-y-0 size-11 rounded-full bg-white border-0"/>
                    <CarouselNext className="static translate-y-0 size-11 rounded-full bg-ink text-white border-0 hover:bg-ink-2 hover:text-white"/>
                </div>
                <CarouselContent>
                    { isLoading ? (
                        <>
                            <CarouselItem className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" >
                                <CardSkeleton isBestSeller={bestseller} />
                            </CarouselItem>
                            <CarouselItem className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" >
                                <CardSkeleton isBestSeller={bestseller} />
                            </CarouselItem>
                            <CarouselItem className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" >
                                <CardSkeleton isBestSeller={bestseller} />
                            </CarouselItem>
                            <CarouselItem className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" >
                                <CardSkeleton isBestSeller={bestseller} />
                            </CarouselItem>
                        </>
                        ) : data.map((course) => (
                            <CarouselItem key={course.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 py-2" >
                                <CardWithRating course={course} isBestSeller={bestseller} />
                            </CarouselItem>
                    )) }
                </CarouselContent>
            </Carousel>
        </div>
    )
}
