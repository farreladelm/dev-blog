import ArticleDetail from '@/components/article/article-detail';
import ArticleDetailSkeleton from '@/components/article/article-detail-skeleton';
import { Suspense } from 'react'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <Suspense fallback={<ArticleDetailSkeleton />}>
            <ArticleDetail slug={slug} />
        </Suspense>
    )
}   
