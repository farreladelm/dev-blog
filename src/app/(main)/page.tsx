import { Suspense } from "react";
import ArticleList from "@/components/article/article-list";
import ArticleListSkeleton from "@/components/article/article-list-skeleton";
import PopularTags from "@/components/shared/popular-tags";
import PopularTagsSkeleton from "@/components/shared/popular-tags-skeleton";

export default async function RootPage() {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 max-w-4xl mx-auto p-4 lg:p-0 relative">
            <aside className="w-full shrink-0">
                <Suspense fallback={<PopularTagsSkeleton />}>
                    <PopularTags />
                </Suspense>
            </aside>
            <Suspense fallback={<ArticleListSkeleton />}>
                <ArticleList />
            </Suspense>
        </div>
    )
}
