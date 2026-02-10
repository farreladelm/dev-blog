"use client";

import ArticleHeader from "@/components/article/article-header";
import { Card } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react";
import ArticleDraftEditor from "@/components/article/article-draft-editor";
import MarkdownPreview from "@/components/article/markdown-preview";
import { ArticleDraft, ArticleWithUserAndTag } from "@/lib/types";
import { submitArticleUpdateForm } from "@/actions/article";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ArticleSubmitButtons from "@/components/article/article-submit-buttons";

interface EditArticleClientProps {
    article: ArticleWithUserAndTag;
    session?: {
        username: string;
        name: string;
        avatarImage: string | null;
    } | null;
}

export default function EditArticleClient({ article, session = null }: EditArticleClientProps) {
    const router = useRouter();

    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [draft, setDraft] = useState<ArticleDraft>({
        title: article.title,
        body: article.body,
        tags: article.tags.map((t) => t.tag.name),
    });

    const updateArticleWithBoundData = submitArticleUpdateForm
        .bind(null, article.id)
        .bind(null, draft);

    const [data, action, isPending] = useActionState(
        updateArticleWithBoundData,
        undefined
    );

    useEffect(() => {
        if (!data) return;

        console.log("Update Article Action Data:", data);

        if (data.success) {
            toast.success("Article updated successfully!");
            router.push(`/articles/${data.data.article.slug}`);
        } else if (!data.success) {
            if (data.error) toast.error(data.error);
            if (data.fieldErrors) {
                Object.values(data.fieldErrors).forEach((error) => {
                    if (error) toast.error(error);
                });
            }
        }
    }, [data, router, article.slug]);

    return (
        <>
            <ArticleHeader mode={mode} onModeChange={setMode} />
            <main className="container mx-auto p-4 max-w-4xl">
                <form action={action}>
                    <Card className="py-4 md:py-8">
                        {mode === "edit" ? (
                            <ArticleDraftEditor draft={draft} onDraftChange={setDraft} />
                        ) : (
                            <MarkdownPreview title={draft.title} body={draft.body} session={session} />
                        )}
                    </Card>

                    <ArticleSubmitButtons />
                </form>
            </main>
        </>
    );
}