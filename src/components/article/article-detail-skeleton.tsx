import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ArticleDetailSkeleton() {
    return (
        <article className="flex justify-center w-full gap-4 lg:px-20">

            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <div className="px-4 py-2 flex items-center gap-3 w-fit">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col">
                            <Skeleton className="w-20 h-4 rounded-md mb-1" />
                            <Skeleton className="w-28 h-3 rounded-md" />
                        </div>
                    </div>
                    <CardTitle>
                        <Skeleton className="w-3/4 h-8 rounded-md" />
                    </CardTitle>

                    <CardAction>
                        <div className="p-1 rounded hover:bg-accent cursor-pointer">
                            <Skeleton className="size-6 rounded-md" />
                        </div>
                    </CardAction>

                    <CardDescription className="mt-6">
                        <div className="flex gap-1 mb-auto flex-wrap">
                            <Skeleton className="w-16 h-4 rounded-md" />
                            <Skeleton className="w-16 h-4 rounded-md" />
                            <Skeleton className="w-16 h-4 rounded-md" />
                        </div>
                        <div className="flex gap-8 text-sm mt-4">
                            <Skeleton className="w-12 h-4 rounded-md" />
                            <Skeleton className="w-12 h-4 rounded-md" />
                        </div>
                    </CardDescription>

                </CardHeader>
                <CardContent className="max-w-none pt-6 border-t space-y-4">
                    <Skeleton className="w-3/4 h-8 rounded-md mb-8" />
                    <Skeleton className="w-1/2 h-8 rounded-md" />
                    <Skeleton className="w-3/4 h-8 rounded-md" />
                    <Skeleton className="w-3/4 h-8 rounded-md mb-16" />
                    <Skeleton className="w-1/2 h-8 rounded-md" />
                    <Skeleton className="w-3/4 h-8 rounded-md" />
                    <Skeleton className="w-3/4 h-8 rounded-md" />
                </CardContent>
            </Card>

        </article>
    )
}
