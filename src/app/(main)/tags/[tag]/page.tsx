import { getPopularTags } from "@/actions/tag";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash } from "lucide-react";
import { Suspense } from "react";
import ArticleListOfTag from "./article-list-of-tag";
import ArticleListOfTagSkeleton from "./article-list-of-tag-skeleton";
import PopularTags from "@/components/shared/popular-tags";
import PopularTagsSkeleton from "@/components/shared/popular-tags-skeleton";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;

    return (
        <>
            <Card className="container max-w-4xl mx-auto">
                <CardContent>
                    <CardHeader >
                        <CardTitle className="flex text-2xl items-center gap-1">
                            <Hash className="inline size-6 text-red-300" />
                            <span>
                                {tag}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Articles tagged with &quot;{tag}&quot;
                        </CardDescription>
                    </CardHeader>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 max-w-4xl mx-auto p-4 lg:p-0">
                <aside className="w-full shrink-0">
                    <Suspense fallback={<PopularTagsSkeleton />}>
                        <PopularTags />
                    </Suspense>
                </aside>
                <Suspense fallback={<ArticleListOfTagSkeleton />}>
                    <ArticleListOfTag tag={tag} />
                </Suspense>
            </div>
        </>

    )
}
