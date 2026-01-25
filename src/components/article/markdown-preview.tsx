import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../markdown-renderer";
import UserDetail from "./user-detail";

export default function MarkdownPreview({ title, body }: { title: string; body: string }) {
    return (
        <>
            <CardHeader>
                <UserDetail name={"Your Name"} username={"username"} />
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
