import ArticleSkeleton from "@/components/article/article-skeleton";
import Articles from "@/components/article/articles";
import { Suspense } from "react";

export default function ArticlesPage() {

    return (
        <div className="flex gap-4 lg:px-20">
            <aside className="w-64 shrink-0"></aside>
            <Suspense fallback={<ArticleSkeleton />}>
                <Articles />
            </Suspense>
        </div>
    )
}
