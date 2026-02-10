import { getSession } from "@/lib/auth";
import NewArticleClient from "./new-article-client";

export default async function NewArticlePage() {
  const session = await getSession();
  return (
    <NewArticleClient session={session} />
  )
}
