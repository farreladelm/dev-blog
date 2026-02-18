"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4 px-4 text-center">
            <h2 className="text-3xl font-bold">{error.message}</h2>
            <p className="text-muted-foreground">Make sure that the tag name was correct.</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}