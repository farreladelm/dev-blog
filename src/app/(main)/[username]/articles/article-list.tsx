// article-list-client.tsx (Client Component)
"use client";

import { useState } from "react";
import { Article } from "@/app/generated/prisma/client";
import UserArticleCard from "./user-article-card";
import { ArticleActionDialog } from "./article-action-dialog";

type DialogType = 'publish' | 'unpublish' | 'delete';

interface ArticleListClientProps {
    articles: Article[];
    userId: string | undefined;
}

export function ArticleList({ articles, userId }: ArticleListClientProps) {
    const [dialog, setDialog] = useState<{
        open: boolean;
        type: DialogType | null;
        article: Article | null;
    }>({ open: false, type: null, article: null });

    const openDialog = (type: DialogType, article: Article) => {
        setDialog({ open: true, type, article });
    };

    const closeDialog = () => {
        setDialog({ open: false, type: null, article: null });
    };

    return (
        <>
            <div className="grid auto-rows-fr gap-4 w-full">
                {articles.map(article => (
                    <UserArticleCard
                        key={article.id}
                        userId={userId}
                        article={article}
                        onPublish={() => openDialog('publish', article)}
                        onUnpublish={() => openDialog('unpublish', article)}
                        onDelete={() => openDialog('delete', article)}
                    />
                ))}
            </div>

            {/* Single Dialog Component */}
            {dialog.article && dialog.type && (
                <ArticleActionDialog
                    type={dialog.type}
                    articleId={dialog.article.id}
                    articleTitle={dialog.article.title}
                    open={dialog.open}
                    onOpenChange={(open: boolean) => {
                        if (!open) closeDialog();
                    }}
                />
            )}
        </>
    );
}