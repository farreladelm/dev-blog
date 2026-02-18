import { getPopularTags } from "@/actions/tag";
import Tag from "@/components/article/tag";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Hash } from "lucide-react";
import { Suspense } from "react";
import ArticleListOfTag from "./article-list-of-tag";
import ArticleListOfTagSkeleton from "./article-list-of-tag-skeleton";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const popularTagResult = await getPopularTags(10);

    const tags = popularTagResult.success ? popularTagResult.data.tags : [];

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
                    <Item>
                        <ItemContent>
                            <ItemTitle>Popular Tags</ItemTitle>
                        </ItemContent>
                        <ItemActions className="flex flex-wrap gap-1">
                            {tags && (tags).map(tag => <Tag title={tag} key={tag} />)}
                        </ItemActions>
                    </Item>
                </aside>
                <Suspense fallback={<ArticleListOfTagSkeleton />}>
                    <ArticleListOfTag tag={tag} />
                </Suspense>
            </div>
        </>

    )
}
