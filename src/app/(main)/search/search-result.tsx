import { searchArticles } from "@/actions/article/query";
import { toast } from "sonner";
import SearchResultClient from "./search-result-client";

export default async function SearchResult({ query }: { query: string }) {
    const result = await searchArticles(query);

    if (!result.success) {
        toast.error(result.error);
        return <div>Error loading articles.</div>;
    }

    const { articles, hasMore } = result.data!;

    return (
        <SearchResultClient
            key={query}
            query={query}
            initialArticles={articles}
            initialHasMore={hasMore}
            initialArticleCounts={articles.length}
        />

    );
}
