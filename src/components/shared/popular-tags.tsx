import { getPopularTags } from "@/actions/tag";
import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/item";
import Tag from "../article/tag";

export default async function PopularTags() {
    const getPopularTagsResult = await getPopularTags(8);

    if (!getPopularTagsResult.success) {
        console.error("Failed to fetch popular tags:", getPopularTagsResult.error);

        return (
            <Item>
                <ItemContent>
                    <ItemTitle>Popular Tags</ItemTitle>
                </ItemContent>
                <ItemActions className="flex flex-wrap gap-1">
                    <span className="text-sm text-muted-foreground">No popular tags found.</span>
                </ItemActions>
            </Item>
        );
    }

    const { tags } = getPopularTagsResult.data;

    return (
        <Item>
            <ItemContent>
                <ItemTitle>Popular Tags</ItemTitle>
            </ItemContent>
            <ItemActions className="flex flex-wrap gap-1">
                {tags.length > 0 ?
                    tags.map(tag => <Tag title={tag} key={tag} />)
                    : <span className="text-sm text-muted-foreground">No popular tags found.</span>}
            </ItemActions>
        </Item>
    );
}
