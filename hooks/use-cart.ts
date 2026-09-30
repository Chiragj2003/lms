import { Course } from "@/types";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UseCartProps {
    items : Course[];
    // True while a learner is signed in: changes are then mirrored to the
    // server-side cart so it follows them across devices.
    syncEnabled : boolean;
    toggleItem : (course: Course )=>void;
    setItems : (items: Course[])=>void;
    setSyncEnabled : (enabled: boolean)=>void;
    clear : ()=>void;
}

export const useCart = create(persist<UseCartProps>((set, get)=>({
        items : [],
        syncEnabled : false,
        toggleItem : (course: Course)=>{
            const inCart = get().items.some((item)=>item.id===course.id);

            set({
                items : inCart
                    ? get().items.filter((item)=>item.id!==course.id)
                    : [...get().items, course]
            });

            if (get().syncEnabled) {
                const request = inCart
                    ? axios.delete(`/api/cart?courseId=${encodeURIComponent(course.id)}`)
                    : axios.post("/api/cart", { courseIds : [course.id] });
                // The server copy is authoritative (it drops owned courses),
                // so adopt whatever it returns.
                request
                    .then((response)=>set({ items : response.data }))
                    .catch(()=>{});
            }
        },
        setItems : (items: Course[])=>set({ items }),
        setSyncEnabled : (syncEnabled: boolean)=>set({ syncEnabled }),
        clear : ()=>set({ items : [] })
    }),
    {
        name : "cart",
        storage : createJSONStorage(()=>localStorage),
        // Only the items are remembered; sync is re-established per session.
        partialize : (state)=>({ items : state.items }) as UseCartProps
    }
));
