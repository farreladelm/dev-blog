import { getArticleBySlug } from "@/actions/article";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import ProfileAvatar from "../profile-avatar";
import { notFound } from "next/navigation";
import { PiThumbsUp } from "react-icons/pi";
import MarkdownRenderer from "../markdown-renderer";
import Tag from "./tag";

export default async function ArticleDetail({ slug }: { slug: string }) {
    const result = await getArticleBySlug(slug);


    const article = result.data;

    if (!article) {
        notFound();
    }
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

                    <CardAction>
                        <div className="p-1 rounded hover:bg-accent cursor-pointer">
                            <PiThumbsUp className="size-6" />
                        </div>
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
