// components/ArticleList.tsx
import { getPublishedArticles } from "@/actions/article"
import { toast } from "sonner";
import ArticleListInfinite from "./article-list-infinite";


export default async function ArticleList() {
    const result = await getPublishedArticles(1, 8);

    if (!result.success) {
        toast.error(result.error);
        return <div>Error loading articles.</div>;
    }

    const { articles, hasMore } = result.data!;

    return (
        <ArticleListInfinite
            initialArticles={articles}
            initialHasMore={hasMore}
        />
    );
}