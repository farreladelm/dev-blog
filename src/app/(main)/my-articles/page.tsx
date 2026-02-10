import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticlesByAuthor } from "@/actions/article";
import { ArticleList } from "./article-list";
import { getSession } from "@/lib/auth";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
    const session = await getSession();

    if (!session) {
        return <h1>Please log in to view your articles.</h1>;
    }

    const result = await getArticlesByAuthor(session.username);

    if (!result.success) {
        return <h1>Error</h1>;
    }

    const articles = result.data;
    const userId = session ? session.userId : undefined;

    return (
        <div className="flex justify-center w-full gap-4 lg:px-20">
            <Card className="w-full max-w-4xl bg-background border-none">
                <CardHeader>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                        Manage your articles
                    </CardDescription>
                    <CardAction>
                        <Button variant="outline" asChild>
                            <Link href="/articles/new" className="flex items-center gap-2">
                                <Plus className="size-5" /> Article
                            </Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {articles && articles.length > 0 ? (
                        <ArticleList articles={articles!} userId={userId} />
                    ) : (
                        <Card>
                            <CardContent className="items-center">
                                <div className="flex flex-col gap-2 items-center">
                                    <span className="text-muted-foreground">No articles found.</span>
                                </div>
                            </CardContent>
                        </Card>
                    )

                    }
                </CardContent>
            </Card>
        </div >

    )
}
