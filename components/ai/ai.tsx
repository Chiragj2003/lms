"use client";

import {
    useEffect,
    useRef,
    useState
} from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useChat } from '@/hooks/use-chat';
import { v4 as uuidv4 } from 'uuid';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import { ChatResponse } from './chat';

interface AIProps {
    chapterId: string;
}

const formSchema = z.object({
    prompt : z.string().min(3)
});


export const AI = ({
    chapterId,
}: AIProps ) => {
    
    const session = useSession();

    const ref = useRef<HTMLDivElement>(null);
    const[loading, setLoading] = useState(false);
    // The message whose answer hasn't started streaming yet (spinner shows
    // only on that one, not on every message in the history).
    const [pendingId, setPendingId] = useState<string|null>(null);
    
    const { addChat, getUserChat, addResponse, messages } = useChat();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            prompt : ""
        }
    });

    const onPromptSubmit = async ({ prompt }: z.infer<typeof formSchema>) => {
        const id = uuidv4();
        try {

            setLoading(true);
            setPendingId(id);
            form.reset();
            addChat(id, chapterId, prompt, session.data?.user.id||"");

            // The model runs on the server (see /api/ai/chat); the answer
            // streams back as plain text.
            const response = await fetch("/api/ai/chat", {
                method : "POST",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify({ chapterId, prompt }),
            });

            if (!response.ok || !response.body) {
                throw new Error((await response.text()) || "Something went wrong");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            setPendingId(null);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                addResponse(id, decoder.decode(value, { stream : true }));
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setPendingId(null);
            setLoading(false);
        }
        
    }

    useEffect(()=>{
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, [addResponse, messages]);



    return (
        <div
           className="h-full w-full relative overflow-y-auto scroll-smooth"
        >
            <div 
                className='flex flex-col gap-y-8 px-4 py-6 min-h-full max-w-3xl w-full mx-auto'
            >
                {getUserChat(chapterId, session.data?.user.id||"").length === 0 && (
                    <div className='flex flex-1 flex-col items-center justify-center gap-y-3 text-center'>
                        <Image
                            src="/assets/illustrations/ai-assistant.webp"
                            alt=""
                            width={256}
                            height={247}
                            className='size-32 object-contain'
                        />
                        <h3 className='text-lg font-medium text-ink'>Ask about this chapter</h3>
                        <p className='text-sm text-muted-foreground max-w-xs'>
                            Stuck on something? Ask a question and the assistant answers from this chapter.
                        </p>
                    </div>
                )}
                {
                    getUserChat(chapterId, session.data?.user.id||"").map((message)=>(
                        <div 
                            className='w-full space-y-10'
                            key={message.id}
                        >
                            <div
                                className='w-full flex items-center justify-end'
                            >
                                <div className='max-w-xl w-fit px-4 py-3 bg-ink rounded-[20px] rounded-br-md'>
                                    <p className='text-white text-[15px]' >
                                        {message.chat}
                                    </p>
                                </div>
                            </div>
                            <div className='w-full flex items-start gap-x-4'>
                                <div className='size-10 relative shrink-0'>
                                    <Image
                                        src="/assets/illustrations/ai-assistant.webp"
                                        height={40}
                                        width={40}
                                        alt='AI assistant'
                                        className='size-10 object-contain'
                                    />
                                </div>
                                <div className='w-[calc(100%-52px)]'>
                                    {
                                        pendingId === message.id && (
                                            <div className='py-1'>
                                                <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
                                            </div>
                                        )
                                    }
                                    <ChatResponse response={message.response} />
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='h-0' ref={ref} />
            </div>
            <div className='px-3 py-3 w-full flex items-center justify-center sticky bottom-0 bg-gradient-to-b from-transparent via-30% via-white to-white'>
                <Form {...form}>
                    <form
                        className='max-w-3xl w-full bg-soft mx-auto h-14 rounded-full overflow-hidden flex items-center pl-5 pr-1.5 focus-within:shadow-[inset_0_0_0_2px_#121216]'
                        onSubmit={form.handleSubmit(onPromptSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='prompt'
                            render={({field})=>(
                                <FormItem className='w-full'>
                                    <FormControl className='w-full'>
                                        <Input 
                                            className="h-full w-full bg-transparent outline-none placeholder:text-zinc-500 focus:placeholder:text-zinc-800 focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 border-none text-zinc-800 transition-all"
                                            placeholder='Ask your question'
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            size="icon"
                            className='shrink-0'
                            aria-label='Send'
                            type='submit'
                            disabled={loading}
                        >
                            <ChevronRight className='size-5' />
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
