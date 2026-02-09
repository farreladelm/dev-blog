import { Suspense } from "react";
import ArticleList from "@/components/article/article-list";
import ArticleListSkeleton from "@/components/article/article-list-skeleton";
import { getPopularTags } from "@/actions/tag";
import Tag from "@/components/article/tag";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";

export default async function RootPage() {
    const tags = await getPopularTags(8);

    return (
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
            <Suspense fallback={<ArticleListSkeleton />}>
                <ArticleList />
            </Suspense>
        </div>
    )
}
