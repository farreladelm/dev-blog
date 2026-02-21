import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { dateToMonthAndDate } from "@/lib/date-to-string";
import { Article } from "@/app/generated/prisma/client";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { PiEye, PiThumbsUp } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import { STATUS } from "@/constants/article";

type UserArticleCardProps = {
    article: Article;
    userId: string | undefined;
    onPublish: () => void;
    onUnpublish: () => void;
    onDelete: () => void;
}

export default function UserArticleCard({ article, userId, onPublish, onUnpublish, onDelete }: UserArticleCardProps) {
    const isAuthor = article.authorId === userId;
    const isPublished = article.status === STATUS.PUBLISHED;
    const publishButtonText = isPublished ? "Unpublish" : "publish";
    return (
        <Card className={twMerge("gap-4 w-full grid grid-cols-2 grid-rows-2 items-center lg:grid-rows-1 p-4 px-8 lg:items-center", isAuthor ? "lg:grid-cols-3" : "")}>
            <div className="flex flex-col gap-2 justify-start col-span-2 lg:col-span-1">
                <Link href={`/articles/${article.slug}`} className="block font-bold text-lg hover:text-red-300 line-clamp-3 max-h-14 overflow-hidden">{article.title}</Link>
                <div className="flex gap-8 lg:gap-4">
                    <div className="flex lg:flex-col gap-2">
                        <h3 className="text-xs text-muted-foreground">Published</h3>
                        <p className="font-medium text-xs">{article.publishedAt ? dateToMonthAndDate(article.publishedAt) : "-"}</p>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                        <h3 className="text-xs text-muted-foreground">Edited</h3>
                        <p className="font-medium text-xs">{article.updatedAt ? dateToMonthAndDate(article.updatedAt) : "-"}</p>
                    </div>
                </div>
            </div>
            <div className={twMerge("flex gap-4 w-fit text-sm", isAuthor ? "lg:mx-auto" : "lg:ms-auto")}>
                <div className="flex gap-2 items-center">
                    <PiThumbsUp size={20} className="text-muted-foreground" />
                    <p>{article.likes}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <PiEye size={20} className="text-muted-foreground" />
                    <p>&lt; 100</p>
                </div>
            </div>
            {isAuthor &&
                <div className="flex justify-end">
                    <div className="lg:flex hidden lg:gap-8">
                        <button type="button" onClick={isPublished ? onUnpublish : onPublish} className="text-muted-foreground hover:underline hover:text-foreground text-sm">{publishButtonText}</button>
                        <Link href={`/articles/${article.slug}/edit`} className="text-muted-foreground hover:underline hover:text-foreground text-sm">Edit</Link>
                        <button onClick={() => onDelete()} className="text-muted-foreground hover:underline hover:text-foreground text-sm">Delete</button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer lg:hidden" asChild>
                            <Button variant="ghost" className="p-2!">
                                <Ellipsis />
                            </Button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={isPublished ? onUnpublish : onPublish}>
                                    {publishButtonText}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`/article/${article.slug}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={onDelete}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            }
        </Card >
    )
}
