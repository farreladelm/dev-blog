"use client"

import { incrementView } from "@/actions/article";
import { useEffect } from "react"

export default function ViewTracker({ articleId }: { articleId: string }) {
    useEffect(() => {
        incrementView(articleId);
    }, [articleId]);
    return null;
}
