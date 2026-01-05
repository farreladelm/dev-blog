import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";

type Article = {
    title: string;
    body: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED";
    authorId: string;
    author: { username: string };
};

async function getArticle(slug: string) {
    const cookieHeader = cookies().toString();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`,
        {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        }
    );

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch article");

    return res.json();
}

export default async function ArticlePage({
    params,
}: {
    params: { slug: string };
}) {
    const article: Article | null = await getArticle(params.slug);

    if (!article) {
        notFound();
    }

    const authUser = await getAuthUser();

    const isAuthor = authUser && authUser.sub === article.authorId;

    return (
        <article>
            <h1>{article.title}</h1>

            <p>
                By{" "}
                <Link href={`/profile/${article.author.username}`}>
                    {article.author.username}
                </Link>
            </p>

            {isAuthor && (
                <div>
                    <Link href={`/articles/${article.slug}/edit`}>Edit</Link>
                </div>
            )}

            <ReactMarkdown>{article.body}</ReactMarkdown>
        </article>
    );
}
