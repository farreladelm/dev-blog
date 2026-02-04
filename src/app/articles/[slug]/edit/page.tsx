import { getArticleForEditing } from "@/actions/article";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EditArticleClient from "./edit-article-client";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const session = await getSession();

    if (!session) redirect("/login");

    const { slug } = await params;

    const result = await getArticleForEditing(slug);

    if (!result.success) {
        notFound();
    }

    const article = result.data.article;

    return (
        <EditArticleClient article={article} />
    )
}
