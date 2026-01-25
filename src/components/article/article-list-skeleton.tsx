import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "../ui/card"

export default function ArticleListSkeleton() {
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
        </div>
    )
}

function ArticleCardSkeleton() {
    return (
        <Card className="gap-4 w-full">

            <div className="px-4 py-2 flex items-center gap-3 w-fit">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                    <Skeleton className="w-20 h-4 rounded-md mb-1" />
                    <Skeleton className="w-28 h-3 rounded-md" />
                </div>
            </div>

            <article className="px-15 space-y-2">
                <Skeleton className="w-3/4 h-8 rounded-md" />
                <div className="flex gap-1">
                    <Skeleton className="w-16 h-6 rounded-md" />
                    <Skeleton className="w-16 h-6 rounded-md" />
                    <Skeleton className="w-16 h-6 rounded-md" />
                </div>
                <Skeleton className="w-full h-10 rounded-md mt-4" />
            </article>

        </Card>
    )
}
