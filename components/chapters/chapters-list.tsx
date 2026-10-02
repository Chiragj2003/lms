"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { Chapter } from "@prisma/client";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { BiGridVertical } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

interface ChaptersListProps {
    items : Chapter[];
    onReorder : (updateData : { id: string, position: number}[])=>void;
    onEdit : (id: string)=>void;
}

export const ChaptersList = ({
    items,
    onEdit,
    onReorder
} : ChaptersListProps) => {

    const isMounted = useMounted();
    const [chapters, setChapters] = useState(items);

    // Take the server's order again whenever new items arrive (after a save
    // or refresh), while keeping the optimistic order between drags.
    const [prevItems, setPrevItems] = useState(items);
    if (items !== prevItems) {
        setPrevItems(items);
        setChapters(items);
    }

    const onDragEnd = ( result : DropResult )=>{
        if (!result.destination) return;
        const items = Array.from(chapters);
        const [reorderdItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderdItem); 

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex+1);
        setChapters(items);

        const bulkUpdatedData = updatedChapters.map((chapter)=>({
            id : chapter.id,
            position : items.findIndex((item)=>item.id === chapter.id)
        }));

        onReorder(bulkUpdatedData);
    }

    if (!isMounted) {
        return null;
    }
    
    return (
        <DragDropContext onDragEnd={onDragEnd} >
            <Droppable droppableId="chapters" >
                {(provided)=>(
                    <div {...provided.droppableProps} ref={provided.innerRef} >
                        {
                            chapters.map((chapter, index)=>(
                                <Draggable key={chapter.id} draggableId={chapter.id} index={index} >
                                    {(provided)=>(
                                        <div
                                            className={cn(
                                                "flex items-center gap-x-2 bg-muted border-border border text-foreground rounded-md mb-2 text-sm",
                                                chapter.isPublished && "bg-accent border-primary/20 text-accent-foreground"
                                            )}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div
                                                className={cn(
                                                    "px-2 py-3 border-r border-r-border hover:bg-muted-foreground/10 rounded-l-md transition-all cursor-grab",
                                                    chapter.isPublished && "border-r-primary/20 hover:bg-primary/10"
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <BiGridVertical className="h-4 w-4"/>
                                            </div>
                                            {chapter.title}
                                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                {
                                                    chapter.isFree && (
                                                        <Badge>
                                                            Free
                                                        </Badge>
                                                    )
                                                }
                                                <Badge>
                                                    { chapter.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                                <Pencil
                                                    className="h-5 w-5 md:cursor-pointer hover:opacity-75 transition-all"
                                                    onClick={()=>onEdit(chapter.id)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
