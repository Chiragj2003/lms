"use client";

import { useRouter } from 'next/navigation';
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    query : z.string().min(1)
});

export const SearchForm = () => {

    const router = useRouter();
    
    const form =useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            query : ""
        }
    });

    const onSubmit = (values : z.infer<typeof formSchema>)=>{
        router.push(`/search?query=${values.query}`)
    }   



    return (
        <Form {...form}>
            <form
                className="w-full"
                onSubmit={form.handleSubmit(onSubmit)}
                role="search"
            >
                <div className="flex items-center gap-2 h-16 rounded-full bg-white pl-5 pr-2 shadow-[inset_0_0_0_1px_hsl(var(--border))] focus-within:shadow-[inset_0_0_0_2px_#121216] transition-shadow">
                    <Search className='size-5 shrink-0 text-ink' aria-hidden="true" />
                    <FormField
                        control={form.control}
                        name='query'
                        render={({field})=>(
                            <FormItem className='w-full'>
                                <FormControl className='w-full'>
                                    <Input
                                        className="h-12 w-full bg-transparent px-1 border-none focus-visible:bg-transparent text-base text-ink placeholder:text-muted-foreground"
                                        placeholder='What do you want to learn?'
                                        aria-label="Search courses"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        className='h-12 px-6'
                        type='submit'
                    >
                        Search
                        <ChevronRight className='size-4' />
                    </Button>
                </div>
            </form>
        </Form>
    )
}
