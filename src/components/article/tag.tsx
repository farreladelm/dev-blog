import { Hash } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

export default function Tag({ title }: { title: string }) {
    return (
        <Badge variant="outline" asChild key={title}>
            <Link href={`/tags/${title}`}>
                <Hash size={12} className="text-red-300" />
                <span>
                    {title}
                </span>
            </Link>
        </Badge>
    )
}
