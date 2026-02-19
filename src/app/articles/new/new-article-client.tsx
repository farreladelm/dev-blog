"use client"

import { useActionState, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import ArticleHeader from "@/components/article/article-header"
import ArticleDraftEditor from "@/components/article/article-draft-editor"
import ArticleSubmitButtons from "@/components/article/article-submit-buttons"
import MarkdownPreview from "@/components/article/markdown-preview"
import { Card } from "@/components/ui/card"
import { ArticleDraft, SessionUser } from "@/lib/types"
import { DEBOUNCE_DELAY, DRAFT_KEY, STATUS } from "@/constants/article"
import { submitArticleForm } from "@/actions/article"

type NewArticleClientProps = {
    session?: SessionUser | null;
};

const INITIAL_DRAFT: ArticleDraft = {
    title: "",
    body: "",
    tags: [],
};

function getInitialDraft(): ArticleDraft {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        return saved ? JSON.parse(saved) : INITIAL_DRAFT;
    } catch {
        return INITIAL_DRAFT;
    }
}

export default function NewArticleClient({ session = null }: NewArticleClientProps) {
    const router = useRouter();

    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [draft, setDraft] = useState<ArticleDraft>(INITIAL_DRAFT);

    const boundAction = useMemo(
        () => submitArticleForm.bind(null, draft),
        [draft]
    );

    const [data, action, isPending] = useActionState(boundAction, undefined);

    // Load draft from localStorage on mount
    useEffect(() => {
        setDraft(getInitialDraft());
    }, []);

    // Persist draft to localStorage with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeout);
    }, [draft]);

    // Handle action result
    useEffect(() => {
        if (!data) return;

        if (data.success) {
            localStorage.removeItem(DRAFT_KEY);
            const { article, authorUsername } = data.data;
            const destination = article.status === STATUS.DRAFT
                ? "/my-articles"
                : `/articles/${article.slug}`;
            router.push(destination);
            return;
        }

        if (data.error) toast.error(data.error);
        data.fieldErrors && Object.values(data.fieldErrors).forEach(error => {
            if (error) toast.error(error);
        });

    }, [data, router]);

    const handleModeChange = useCallback((newMode: "edit" | "preview") => {
        setMode(newMode);
    }, []);

    return (
        <>
            <ArticleHeader mode={mode} onModeChange={handleModeChange} />
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