import Tag from "@/components/article/tag";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Hash } from "lucide-react";
import Link from "next/link";

export default function TagSearchResult({ tags }: { tags: string[] }) {
    return (
        <div className="w-full flex flex-col gap-2" >
            {tags.map(tag => (
                <Tag title={tag} key={tag} />
            ))}
        </div>
    )
}
