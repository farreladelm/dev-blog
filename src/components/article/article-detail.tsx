import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import ProfileAvatar from "../profile-avatar";
import MarkdownRenderer from "../markdown-renderer";
import Tag from "./tag";
import LikeButton from "./like-button";
import { ArticleWithUserAndTag } from "@/lib/types";

type ArticleDetailProps = {
    article: ArticleWithUserAndTag,
    userId: string | undefined,
    isLikedByCurrentUser: boolean
}

export default async function ArticleDetail({ article, userId, isLikedByCurrentUser }: ArticleDetailProps) {
    console.log(userId);
    const isAuthor = userId && userId === article.authorId;
    console.log(isAuthor);
    return (
        <article className="flex justify-center w-full gap-4 lg:px-20">

            <Card className="w-full max-w-4xl">
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
                    <CardTitle>
                        <h1 className="text-4xl font-bold">
                            {article?.title}
                        </h1>
                    </CardTitle>

                    <CardAction className="flex flex-row gap-2 items-center">
                        {isAuthor ? <Link href={`/articles/${article.slug}/edit`} className="text-muted-foreground hover:underline hover:text-foreground ml-auto">Edit</Link> : ""}
                        <LikeButton articleId={article.id} initialLikes={article.likes} initialIsLiked={isLikedByCurrentUser} />
                    </CardAction>

                    <CardDescription className="mt-6">
                        <div className="flex gap-1 mb-auto flex-wrap">
                            {article.tags.map(({ tag }) => <Tag title={tag.name} key={tag.name} />)}
                        </div>
                        <div className="flex gap-8 text-sm mt-4">
                            <p>Likes {article.likes}</p>
                            <p>View {article.views}</p>

                        </div>
                    </CardDescription>

                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none pt-6 border-t">
                    <MarkdownRenderer body={article.body} />
                </CardContent>
            </Card>

        </article>
    )
}
