import ArticleCardSkeleton from "@/components/article/article-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleListOfTagSkeleton() {
    return (
        <div className="mt-4 space-y-4">
            <Skeleton className="w-40 h-6" />
            <div className="w-full grid grid-cols-1 gap-2">
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
            </div>
        </div>
    )
}
