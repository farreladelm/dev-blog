import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileCard } from "./profile-card";
import { getArticlesByAuthor } from "@/actions/article";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import ArticleCard from "@/components/article/article-card";
import { getUserDetail } from "@/actions/profile";
import { IoDocument } from "react-icons/io5";
import { STATUS } from "@/constants/article";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const articlesResult = await getArticlesByAuthor(username);
    const session = await getSession();
    const userResult = await getUserDetail(username);

    if (!userResult.success) {
        notFound();
    }

    const articles = articlesResult.data;
    const user = userResult.data;
    const isAuthor = session ? session.userId === user.id : false;
    const publishedCount = articles ? articles.filter(article => article.status === STATUS.PUBLISHED).length : 0;
    return (
        <div className="flex flex-col items-center justify-center p-4 lg:p-0 gap-4">
            <ProfileCard user={user} isAuthor={isAuthor} />
            <div className="grid grid-cols-[280px_1fr] w-full max-w-4xl gap-4">
                <div className="space-y-4">
                    {user.skillsOrLanguages &&
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>
                                    Skills or Languages
                                </CardTitle>
                                <CardDescription>
                                    {user.skillsOrLanguages}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    }
                    {user.availableFor &&
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>
                                    Available For
                                </CardTitle>
                                <CardDescription>
                                    {user.availableFor}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    }

                    <Card className="w-full">
                        <CardContent className="items-center">
                            <div className="flex text-muted-foreground gap-2 items-center">
                                <IoDocument />
                                <span className="text-accent-foreground">
                                    {publishedCount} articles published
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="w-full flex flex-col gap-2">
                    {articles && articles.map(article => <ArticleCard article={article} key={article.id}></ArticleCard>)}
                </div>
            </div>
        </div>
    )
}
