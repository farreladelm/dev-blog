import { Suspense } from "react";
import SearchResult from "./search-result";
import SearchResultSkeleton from "./search-result-skeleton";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;

    return (
        <Suspense fallback={<SearchResultSkeleton query={params.q || ""} />}>
            <SearchResult query={params.q || ""} />
        </Suspense>

    )
}
