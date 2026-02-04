// article-action-dialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toggleArticleStatus, deleteArticle } from "@/actions/article";
import { toast } from "sonner";

type DialogType = 'publish' | 'unpublish' | 'delete';

interface ArticleActionDialogProps {
    type: DialogType;
    articleSlug: string;
    articleTitle: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const dialogConfig = {
    publish: {
        title: (title: string) => `Publish article "${title}"?`,
        description: "This will make your article visible to everyone.",
        action: toggleArticleStatus,
        buttonText: "Publish",
        buttonVariant: "default" as const,
        loadingText: "Publishing..."
    },
    unpublish: {
        title: (title: string) => `Unpublish article "${title}"?`,
        description: "This will hide your article from public view. You can publish it again later.",
        action: toggleArticleStatus,
        buttonText: "Unpublish",
        buttonVariant: "secondary" as const,
        loadingText: "Unpublishing..."
    },
    delete: {
        title: (title: string) => `Delete article "${title}"?`,
        description: "This action cannot be undone. The article will be permanently deleted.",
        action: deleteArticle,
        buttonText: "Delete",
        buttonVariant: "destructive" as const,
        loadingText: "Deleting..."
    }
};

export const ArticleActionDialog = ({
    type,
    articleSlug,
    articleTitle,
    open,
    onOpenChange
}: ArticleActionDialogProps) => {
    const config = dialogConfig[type];

    const [data, action, isPending] = useActionState(
        config.action.bind(null, articleSlug),
        undefined
    );

    useEffect(() => {
        if (!data) return;

        console.log(data);

        if (!data.success) {
            toast.error(data.error);
        }

        toast.success(data.data?.message);
        onOpenChange(false);
    }, [data]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="leading-relaxed">{config.title(articleTitle)}</DialogTitle>
                    <DialogDescription>
                        {config.description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <form action={action}>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant={config.buttonVariant}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {config.loadingText}
                                    </>
                                ) : config.buttonText}
                            </Button>
                        </div>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}