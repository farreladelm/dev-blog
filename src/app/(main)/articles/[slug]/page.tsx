import { getArticleBySlug, incrementView } from '@/actions/article';
import ArticleDetail from './article-detail';
import ArticleDetailSkeleton from '@/app/(main)/articles/[slug]/article-detail-skeleton';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Suspense } from 'react'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getArticleBySlug(slug);
    const userId = (await getSession())?.userId;

    if (!result.success) {
        notFound();
    }
    const article = result.data?.article;
    const isLikedByCurrentUser = result.data?.isLikedByCurrentUser ?? false;

    if (!article || (article.authorId !== userId && !article.publishedAt)) {
        notFound();
    }

    return (
        <Suspense fallback={<ArticleDetailSkeleton />}>
            <ArticleDetail article={article} userId={userId} isLikedByCurrentUser={isLikedByCurrentUser} />
        </Suspense>
    )
}   
