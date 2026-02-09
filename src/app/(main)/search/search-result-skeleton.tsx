import ArticleListSkeleton from "@/components/article/article-list-skeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
                <ButtonGroup className="w-full shrink-0" orientation="vertical">
                    <Button
                        variant="outline"
                        className="w-full justify-between cursor-pointer"
                    >
                        <p>Articles</p>
                        <Skeleton className="size-6 rounded" />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-between cursor-pointer"
                    >
                        <p>Tags</p>
                        <Skeleton className="size-6 rounded" />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-between cursor-pointer"
                    >
                        <p>Users</p>
                        <Skeleton className="size-6 rounded" />
                    </Button>
                </ButtonGroup>
                <div>
                    <ArticleListSkeleton />
                </div>
            </div>
        </div>
    )
}
