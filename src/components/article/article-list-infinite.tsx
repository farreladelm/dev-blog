'use client'

import { useEffect, useState, useRef } from 'react';
import { getPublishedArticles } from '@/actions/article';
import { toast } from 'sonner';
import ArticleCard from './article-card';
import { Loader2 } from 'lucide-react';
import { ArticleWithUserAndTag } from '@/lib/types';

type ArticleListInfiniteProps = {
    initialArticles: ArticleWithUserAndTag[];
    initialHasMore: boolean;
};

export default function ArticleListInfinite({
    initialArticles,
    initialHasMore
}: ArticleListInfiniteProps) {
    const [articles, setArticles] = useState<ArticleWithUserAndTag[]>(initialArticles);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerTarget = useRef(null);
    const isLoadingRef = useRef(false); // Add this ref
    const pageRef = useRef(1);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
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
    }, [hasMore]); // Remove 'loading' and 'page' from dependencies

    const loadMore = async () => {
        if (isLoadingRef.current) return; // Prevent concurrent loads

        isLoadingRef.current = true;
        setLoading(true);

        const nextPage = pageRef.current + 1;

        const result = await getPublishedArticles(nextPage);

        if (!result.success) {
            toast.error(result.error || 'Failed to load more articles');
            setLoading(false);
            isLoadingRef.current = false;
            return;
        }

        setArticles((prev) => {
            const existingIds = new Set(prev.map(a => a.id));
            const newArticles = result.data.articles.filter(a => !existingIds.has(a.id));
            return [...prev, ...newArticles];
        });

        setHasMore(result.data.hasMore);
        pageRef.current = nextPage;
        setLoading(false);
        isLoadingRef.current = false;
    };

    return (
        <div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                {articles.map((article) => (
                    <ArticleCard article={article} key={article.id} />
                ))}
            </div>

            <div ref={observerTarget} className="py-8 text-center">
                {loading && (
                    <div className="flex justify-center items-center gap-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <p className="text-accent-foreground">Loading more articles...</p>
                    </div>
                )}
                {!hasMore && !loading && articles.length > 0 && (
                    <p className="text-muted-foreground">You've reached the end</p>
                )}
            </div>
        </div>
    );
}