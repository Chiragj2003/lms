"use client"

import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { LogoMark } from "./logo";
import { toneFor } from "@/lib/tones";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
    certificateId : string;
    /** Kept for callers; the card now shows a certificate tile instead of the course image. */
    image? : string;
    title : string
}

export const CertificateCard = ({
    certificateId,
    title
} : CertificateCardProps ) => {
    return (
        <Link
            href={`/certificate/${certificateId}`}
            className="group block w-full rounded-[28px] bg-white p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
            <div className={cn("relative flex aspect-[1.6] flex-col justify-between overflow-hidden rounded-[22px] p-5 text-ink", toneFor(certificateId).bg)}>
                <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        <LogoMark className="size-7" />
                        LearnIt
                    </span>
                    <span className="size-12 rounded-full bg-ink text-white flex items-center justify-center" aria-hidden="true">
                        <Award className="size-5" />
                    </span>
                </div>
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-2">Certificate of completion</p>
                    <h2 className="mt-1 text-xl font-medium leading-snug tracking-tight line-clamp-2">{title}</h2>
                </div>
            </div>
            <div className="flex items-center justify-between px-2.5 pt-3 pb-1.5">
                <span className="text-sm font-medium text-ink">View certificate</span>
                <span className="size-9 rounded-full bg-ink text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                    <ArrowUpRight className="size-4" />
                </span>
            </div>
        </Link>
    )
}
