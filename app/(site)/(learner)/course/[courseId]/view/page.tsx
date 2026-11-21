import Image from "next/image";

/** Shown in the player before a chapter is picked (and while the first one loads). */
const ViewCoursePage = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 rounded-[24px] bg-white p-8 text-center">
            <Image
                src="/assets/illustrations/player-loading.webp"
                alt=""
                width={787}
                height={662}
                priority
                className="w-full max-w-sm h-auto"
            />
            <p className="text-lg font-medium text-ink">Pick a chapter to start learning</p>
        </div>
    )
}

export default ViewCoursePage
