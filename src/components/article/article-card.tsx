import { PublishedArticle } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import ProfileAvatar from "../profile-avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import Tag from "./tag";

export default function ArticleCard({ article }: { article: PublishedArticle }) {
    return (
        <Card className="gap-4">
            <CardHeader>
                <Link href={`/profile/${article.author.username}`} className="w-fit group">
                    <div className="py-2 flex items-center gap-3 w-fit">
                        <ProfileAvatar username={article.author.username} />
                        <div className="flex flex-col">
                            <span className="font-medium group-hover:underline">{article.author.name}</span>
                            <span className="text-xs text-muted-foreground">{article.author.username}</span>
                        </div>
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 h-full">
                <h1 className="text-2xl font-bold">{article.title || "Untitled Article"}</h1>
                <div className="flex gap-1 mb-auto flex-wrap">
                    {article.tags.length > 0 && (
                        article.tags.map(({ tag }) => <Tag title={tag.name} key={tag.name} />)
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="block w-full text-center hover:bg-accent mt-4" asChild>
                    <Link href={`/articles/${article.slug}`}>
                        Read more
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
