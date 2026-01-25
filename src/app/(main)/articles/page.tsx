import { Suspense } from "react";
import ArticleList from "@/components/article/article-list";
import ArticleListSkeleton from "@/components/article/article-list-skeleton";

export default function ArticlesPage() {

    return (
        <div className="flex gap-4 lg:px-20">
            <aside className="w-64 shrink-0"></aside>
            <Suspense fallback={<ArticleListSkeleton />}>
                <ArticleList />
            </Suspense>
        </div>
    )
}
