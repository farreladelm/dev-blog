"use client"

import ArticleHeader from "@/components/article/article-header"
import { Card } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react"

import ArticleDraftEditor from "@/components/article/article-draft-editor";
import MarkdownPreview from "@/components/article/markdown-preview";
import { ArticleDraft } from "@/lib/types";
import { DEBOUNCE_DELAY, DRAFT_KEY, STATUS } from "@/constants/article";
import { Button } from "@/components/ui/button";
import { createArticleAction } from "@/actions/article";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


export default function NewArticlePage() {
  const router = useRouter();

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [draft, setDraft] = useState<ArticleDraft>({
    title: "",
    body: "",
    tags: [],
  });

  const createActionWithDraft = createArticleAction.bind(null, draft);

  const [data, action, isPending] = useActionState(createActionWithDraft, undefined);

  useEffect(() => {
    if (!data) return;

    if (data?.success) {
      localStorage.removeItem(DRAFT_KEY);

      router.push("/articles");
    } else if (!data?.success) {
      toast.error(data?.error || "Failed to create article.");
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

          <div className="mt-4 space-x-4">
            <Button type="submit" name="status" value={STATUS.PUBLISHED} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish"}
            </Button>
            <Button type="submit" variant="ghost" name="status" value={STATUS.DRAFT}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save as Draft"}
            </Button>
          </div>
        </form>
      </main >
    </>
  )
}
