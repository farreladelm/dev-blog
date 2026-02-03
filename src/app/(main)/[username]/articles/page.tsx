import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticlesByAuthor } from "@/actions/article";
import { ArticleList } from "./article-list";
import { getSession } from "@/lib/auth";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const result = await getArticlesByAuthor((await params).username);
    const session = await getSession();

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
                </CardHeader>
                <CardContent>
                    <ArticleList articles={articles!} userId={userId} />
                </CardContent>
            </Card>
        </div >

    )
}
