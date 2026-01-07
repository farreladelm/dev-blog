import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownPreview({ title, content }: { title: string; content: string }) {
    return (
        <article className="prose prose-lg dark:prose-invert max-w-none space-y-4 md:space-y-8 p-4 md:p-8 lg:p-12 ">
            <h1 className="min-h-16 text-4xl font-black">{title || "Untitled Article"}</h1>
            {content ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                >
                    {content}
                </ReactMarkdown>

            ) : (
                <p className="text-muted-foreground italic">No content yet. Switch to Edit mode to start writing.</p>
            )}
        </article>
    )
}
