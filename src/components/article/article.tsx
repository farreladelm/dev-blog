import { PublishedArticle } from "@/lib/types";
import { Card } from "../ui/card";
import ProfileAvatar from "../profile-avatar";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Hash } from "lucide-react";
import { Button } from "../ui/button";

export default function Article({ article }: { article: PublishedArticle }) {
    return (
        <Card className="gap-4">
            <Link href={`/profile/${article.author.username}`} className="w-fit group">
                <div className="px-4 py-2 flex items-center gap-3 w-fit">
                    <ProfileAvatar username={article.author.username} />
                    <div className="flex flex-col">
                        <span className="font-medium group-hover:underline">{article.author.username}</span>
                        <span className="text-xs text-muted-foreground">{article.author.email}</span>
                    </div>
                </div>
            </Link>
            <article className="px-15 space-y-2">
                <h1 className="text-2xl font-bold">{article.title || "Untitled Article"}</h1>
                <div className="flex gap-1">
                    {article.tags.length > 0 && (
                        article.tags.map((tag) => (
                            <Badge variant="outline" asChild key={tag.tag.name}>
                                <Link href={`/tags/${tag.tag.name}`}>
                                    <Hash size={12} className="text-red-300" />
                                    <span>
                                        {tag.tag.name}

                                    </span>
                                </Link>
                            </Badge>
                        ))
                    )}
                </div>
                <Button variant="outline" className="block w-full text-center hover:bg-accent mt-4" asChild>
                    <Link href={`/articles/${article.slug}`}>
                        Read more
                    </Link>
                </Button>
            </article>




        </Card>
    )
}
