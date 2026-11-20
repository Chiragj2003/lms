import Image from "next/image";

interface InfoCardProps {
    numberOfItems : number;
    label : string;
    src : string;
}

export const InfoCard = ({
    numberOfItems,
    label,
    src
}: InfoCardProps ) => {
    return (
        <div className={`rounded-3xl flex items-center gap-x-5 p-5 ${label === "Completed" ? "bg-mint" : "bg-aqua"}`}>
            <div className="size-14 shrink-0 relative rounded-full bg-white/70 p-3">
                <Image
                    src={src}
                    fill
                    alt=""
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col text-sm">
                <h2 className="text-sm text-ink-2">{label}</h2>
                <span className="text-[32px] leading-tight font-medium tracking-tight text-ink" >{numberOfItems} <span className="text-base text-ink-2">{numberOfItems===1?"course" :"courses"}</span></span>
            </div>
        </div>
    )
}
