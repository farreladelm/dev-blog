import ArticleListInfinite from "@/components/article/article-list-infinite";
import { getPublishedArticlesOfTag } from "@/actions/article";


export default async function ArticleListOfTag({ tag }: { tag: string }) {
    const result = await getPublishedArticlesOfTag(1, 8, tag);

    if (!result.success) {
        throw new Error(result.error || `Failed to load articles of tag "${tag}"`);
    }

    const { articles, hasMore, count } = result.data;

    return (
        <div className="mt-4 space-y-4">
            <p>Showing {articles.length} of {count} articles</p>
            <ArticleListInfinite
                initialArticles={articles}
                initialHasMore={hasMore}
            />
        </div>
    );
}