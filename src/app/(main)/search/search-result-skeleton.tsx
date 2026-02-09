import ArticleListSkeleton from "@/components/article/article-list-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultSkeleton({ query }: { query: string }) {
    return (
        <div className="max-w-4xl mx-auto relative">
            <Item className="sticky top-0 z-40">
                <ItemContent>
                    <ItemTitle>Search</ItemTitle>
                    <ItemDescription>Search result for "{query}"</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="link" className="font-bold cursor-pointer">Most Relevant</Button>
                    <Button variant="link" className="cursor-pointer">Newest</Button>
                    <Button variant="link" className="cursor-pointer">Oldest</Button>
                </ItemActions>
            </Item>
            <div className="grid grid-cols-[280px_1fr] gap-4">
                <aside className="w-full shrink-0 flex flex-col gap-2">
                    <Button variant="outline" className="w-full justify-between">
                        <p>Articles</p>
                        <Badge variant="secondary" className="rounded"><Skeleton className="h-4 w-8" /></Badge>
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                        <p>Tags</p>
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                        <p>People</p>
                    </Button>
                </aside>
                <div>
                    <ArticleListSkeleton />
                </div>
            </div>
        </div>
    )
}
