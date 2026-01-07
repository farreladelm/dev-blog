"use client"

import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArticleDraft } from "@/lib/types";
import { MAX_ARTICLE_TAGS } from "@/constants/article";

export default function ArticleDraftEditor({
    draft, onDraftChange
}: {
    draft: ArticleDraft;
    onDraftChange: (draft: ArticleDraft) => void;
}) {

    return (
        <>
            <div className="space-y-4 md:space-y-8">
                <Input
                    type="text"
                    placeholder="Article Title..."
                    name="title"
                    value={draft.title}
                    onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
                    className="min-h-16 border-0 focus-visible:ring-0 p-0 px-4 md:px-8 lg:px-12 text-4xl! font-black! bg-card!"
                />
                <TagInput value={draft.tags} onChange={(tags) => {
                    if (tags.length <= MAX_ARTICLE_TAGS) {
                        onDraftChange({ ...draft, tags });
                    }
                }} />

                <Textarea
                    placeholder="Write your article content here (Markdown supported)..."
                    value={draft.body}
                    name="body"
                    onChange={(e) => onDraftChange({ ...draft, body: e.target.value })}
                    className="min-h-100 max-h-125 resize-none border-0 p-4 md:p-8 lg:p-12 focus-visible:ring-0 font-mono! rounded-none"
                />
            </div>
        </>
    )
}
