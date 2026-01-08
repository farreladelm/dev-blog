import { getAllPublishedArticlesAction } from "@/actions/article"
import { toast } from "sonner";
import { Card } from "../ui/card";
import Article from "./article";

export default async function Articles() {
    const result = await getAllPublishedArticlesAction();

    if (result.error) {
        toast.error(result.error);
        return <div>Error loading articles.</div>;
    };

    const articles = result.data;
    return (
        <div className="w-full flex flex-col gap-2">
            {articles?.map((article) =>
                <Article article={article} key={article.id} />
            )}
        </div>
    )
}
