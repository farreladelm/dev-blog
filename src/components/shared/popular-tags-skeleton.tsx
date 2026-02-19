import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/item";
import { Skeleton } from "../ui/skeleton";

export default function PopularTagsSkeleton() {
    return (
        <Item>
            <ItemContent>
                <ItemTitle>Popular Tags</ItemTitle>
            </ItemContent>
            <ItemActions className="flex flex-wrap gap-1">
                <Skeleton className="rounded-sm w-18 h-5" />
                <Skeleton className="rounded-sm w-14 h-5" />
                <Skeleton className="rounded-sm w-16 h-5" />
                <Skeleton className="rounded-sm w-22 h-5" />
                <Skeleton className="rounded-sm w-18 h-5" />
                <Skeleton className="rounded-sm w-22 h-5" />
                <Skeleton className="rounded-sm w-16 h-5" />
                <Skeleton className="rounded-sm w-18 h-5" />
                <Skeleton className="rounded-sm w-14 h-5" />
                <Skeleton className="rounded-sm w-22 h-5" />
            </ItemActions>
        </Item>
    )
}
