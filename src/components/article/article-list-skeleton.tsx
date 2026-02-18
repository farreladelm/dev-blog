import ArticleCardSkeleton from "./article-card-skeleton"

export default function ArticleListSkeleton() {
    return (
        <div className="w-full grid grid-cols-1 gap-2">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
        </div>
    )
}
