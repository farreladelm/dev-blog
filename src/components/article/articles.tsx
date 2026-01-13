import { getAllPublishedArticles } from "@/actions/article"
import { toast } from "sonner";
import Article from "./article";

export default async function Articles() {
    const result = await getAllPublishedArticles();

    if (result.error) {
        toast.error(result.error);
        return <div>Error loading articles.</div>;
    };

    const articles = result.data;
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
            {articles?.map((article) =>
                <Article article={article} key={article.id} />
            )}
        </div>
    )
}
