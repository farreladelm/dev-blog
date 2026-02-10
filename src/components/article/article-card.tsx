import { ArticleWithUserAndTag } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import ProfileAvatar from "../shared/profile-avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import Tag from "./tag";
import UserDetail from "./user-detail";

export default function ArticleCard({ article }: { article: ArticleWithUserAndTag }) {
    return (
        <Card className="gap-4">
            <CardHeader>
                <UserDetail username={article.author.username} name={article.author.name} imageUrl={article.author.avatarImage} />
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
