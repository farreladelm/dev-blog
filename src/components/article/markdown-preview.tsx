import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../shared/markdown-renderer";
import UserDetail from "./user-detail";
import { SessionUser } from "@/lib/types";

type MarkdownPreviewProps = {
    title: string;
    body: string;
    session?: SessionUser | null;
};

export default function MarkdownPreview({ title, body, session = null }: MarkdownPreviewProps) {

    return (
        <>
            <CardHeader>
                <UserDetail name={session?.name || "Your Name"} username={session?.username || "username"} imageUrl={session?.avatarImage || null} />
                <CardTitle>
                    <h1 className="text-4xl font-bold">
                        {title}
                    </h1>
                </CardTitle>


                <CardDescription className="flex flex-wrap mt-6 gap-8 text-sm">
                    <p>Likes 0</p>
                    <p>View 0</p>
                </CardDescription>

            </CardHeader>
            <CardContent className="pt-6 border-t">
                <MarkdownRenderer body={body} />
            </CardContent>
        </>
    )
}
