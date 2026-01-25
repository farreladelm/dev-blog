"use client"

import ArticleHeader from "@/components/article/article-header"
import { Card } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react"

import ArticleDraftEditor from "@/components/article/article-draft-editor";
import MarkdownPreview from "@/components/article/markdown-preview";
import { ArticleDraft } from "@/lib/types";
import { DEBOUNCE_DELAY, DRAFT_KEY, STATUS } from "@/constants/article";
import { createArticle } from "@/actions/article";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ArticleSubmitButtons from "@/components/article/article-submit-buttons";


export default function NewArticlePage() {
  const router = useRouter();

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [draft, setDraft] = useState<ArticleDraft>({
    title: "",
    body: "",
    tags: [],
  });

  const createActionWithDraft = createArticle.bind(null, draft);

  const [data, action, isPending] = useActionState(createActionWithDraft, undefined);

  useEffect(() => {
    if (!data) return;

    console.log("Create Article Action Data:", data);

    if (data?.success) {
      localStorage.removeItem(DRAFT_KEY);

      router.push("/articles");
    } else if (!data?.success) {
      if (data?.error) toast.error(data.error);
      if (data?.fieldErrors) {
        Object.values(data.fieldErrors).forEach(error => {
          if (error) toast.error(error);
        });
      }
    }
  }, [data, router])


  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft));

      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [draft])


  return (
    <>
      <ArticleHeader mode={mode} onModeChange={setMode} />
      <main className="container mx-auto p-4 max-w-4xl">
        <form action={action}>
          <Card className="py-4 md:py-8">
            {mode === "edit" ?
              <ArticleDraftEditor draft={draft} onDraftChange={setDraft} />
              :
              <MarkdownPreview title={draft.title} body={draft.body} />
            }
          </Card >

          <ArticleSubmitButtons />
        </form>
      </main >
    </>
  )
}
