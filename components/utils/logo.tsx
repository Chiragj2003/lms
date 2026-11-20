import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
    className?: string;
    inverted?: boolean;
}

/** The LearnIt mark: an off-centre ring inside a disc. */
export const LogoMark = ({ className, inverted }: LogoMarkProps) => (
    <span
        aria-hidden="true"
        className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
            inverted ? "bg-white text-ink" : "bg-ink text-white",
            className
        )}
    >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="13.5" cy="12" r="3.5" />
        </svg>
    </span>
);

interface LogoProps {
    href?: string;
    label?: string;
    inverted?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Logo = ({ href = "/", label = "LearnIt", inverted, className, onClick }: LogoProps) => (
    <Link
        href={href}
        onClick={onClick}
        className={cn(
            "inline-flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.03em] transition-opacity hover:opacity-80",
            inverted ? "text-white" : "text-ink",
            className
        )}
    >
        <LogoMark inverted={inverted} />
        {label}
    </Link>
);
