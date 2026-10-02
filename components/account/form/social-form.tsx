"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { IoMdLink } from "react-icons/io";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/utils";
import { SocialSchema, SocialValues } from "@/schemas/social.schema";

const FIELDS = [
    { name : "websiteLink",  label : "Website",     icon : IoMdLink,          placeholder : "https://yoursite.com" },
    { name : "linkedinLink", label : "LinkedIn",    icon : FaLinkedin,        placeholder : "https://linkedin.com/in/username" },
    { name : "githubLink",   label : "GitHub",      icon : FaGithub,          placeholder : "https://github.com/username" },
    { name : "twitterLink",  label : "X (Twitter)", icon : FaXTwitter,        placeholder : "https://x.com/username" },
    { name : "youtubeLink",  label : "YouTube",     icon : FaYoutube,         placeholder : "https://youtube.com/@channel" },
    { name : "facebookLink", label : "Facebook",    icon : FaFacebookSquare,  placeholder : "https://facebook.com/username" },
] as const;

interface SocialFormProps {
    initialData : Partial<Record<keyof SocialValues, string | null>>;
}

export const SocialForm = ({ initialData } : SocialFormProps) => {

    const router = useRouter();

    const form = useForm<SocialValues>({
        resolver : zodResolver(SocialSchema),
        defaultValues : Object.fromEntries(
            FIELDS.map(({ name }) => [name, initialData[name] || ""])
        ) as SocialValues,
    });

    const { isSubmitting, isDirty } = form.formState;

    const onSubmit = async (values : SocialValues) => {
        try {
            await axios.patch(`/api/user/profile/social`, values);
            toast.success("Social links saved");
            form.reset(values);
            router.refresh();
        } catch (error) {
            toast.error(errorMessage(error));
        }
    };

    return (
        <Form {...form}>
            <form
                className="w-full space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {
                        FIELDS.map(({ name, label, icon : Icon, placeholder }) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                                            {label}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                inputMode="url"
                                                placeholder={placeholder}
                                                className="h-11"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))
                    }
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        className="font-semibold"
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        size="lg"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};
