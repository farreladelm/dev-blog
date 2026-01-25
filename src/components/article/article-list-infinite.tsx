// components/ArticleListInfinite.tsx
'use client'

import { useEffect, useState, useRef } from 'react';
import { getPublishedArticlesPaginated } from '@/actions/article';
import { toast } from 'sonner';
import ArticleCard from './article-card';
import { PublishedArticle } from '@/lib/types';

type ArticleListInfiniteProps = {
    initialArticles: PublishedArticle[];
    initialHasMore: boolean;
};

export default function ArticleListInfinite({
    initialArticles,
    initialHasMore
}: ArticleListInfiniteProps) {
    const [articles, setArticles] = useState<PublishedArticle[]>(initialArticles);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, page]);

    const loadMore = async () => {
        setLoading(true);
        const nextPage = page + 1;

        const result = await getPublishedArticlesPaginated(nextPage);

        if (!result.data) {
            toast.error(result.error || 'Failed to load more articles');
            setLoading(false);
            return;
        }

        setArticles((prev) => [...prev, ...(result.data?.articles ?? [])]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
        setLoading(false);



    };

    return (
        <div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                {articles.map((article) => (
                    <ArticleCard article={article} key={article.id} />
                ))}
            </div>

            {/* Observer target & loading states */}
            <div ref={observerTarget} className="col-span-full py-8 text-center">
                {loading && (
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        <p className="text-gray-600">Loading more articles...</p>
                    </div>
                )}
                {!hasMore && !loading && articles.length > 0 && (
                    <p className="text-gray-500">You've reached the end</p>
                )}
            </div>
        </div>
    );
}