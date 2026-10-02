"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/utils";

interface AnswerFormProps {
    qnaId : string;
    initialAnswer? : string | null;
}

/** The tutor's answer to one learner question: write, edit or remove it. */
export const AnswerForm = ({ qnaId, initialAnswer } : AnswerFormProps) => {

    const router = useRouter();
    const [answer, setAnswer] = useState(initialAnswer ?? "");
    const [editing, setEditing] = useState(!initialAnswer);
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        try {
            setSaving(true);
            await axios.put(`/api/user/qna/${qnaId}/answer`, { answer });
            toast.success(initialAnswer ? "Answer updated" : "Answer posted");
            setEditing(false);
            router.refresh();
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const onRemove = async () => {
        try {
            setSaving(true);
            await axios.delete(`/api/user/qna/${qnaId}/answer`);
            toast.success("Answer removed");
            setAnswer("");
            setEditing(true);
            router.refresh();
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    if (!editing && initialAnswer) {
        return (
            <div className="rounded-xl bg-accent/60 border border-primary/20 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your answer</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{initialAnswer}</p>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} disabled={saving}>Edit</Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={onRemove} disabled={saving}>Remove</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer…"
                aria-label="Your answer"
                rows={4}
                maxLength={10_000}
                disabled={saving}
            />
            <div className="flex justify-end gap-2">
                {initialAnswer && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setAnswer(initialAnswer); setEditing(false); }}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                )}
                <Button size="sm" onClick={onSave} disabled={saving || !answer.trim()}>
                    {initialAnswer ? "Save answer" : "Post answer"}
                </Button>
            </div>
        </div>
    );
};
