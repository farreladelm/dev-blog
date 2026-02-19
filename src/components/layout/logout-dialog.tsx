"use client";

import { logoutAction } from "@/actions/auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useActionState, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

type LogoutDialogProps = {
    trigger?: ReactNode;
    triggerClassName?: string;
};

export const LogoutDialog = ({ trigger, triggerClassName }: LogoutDialogProps) => {
    const [data, action, isPending] = useActionState(logoutAction, undefined);

    const triggerContent = trigger ?? (
        <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className={cn(
                "w-full hover:underline hover:bg-accent rounded-sm text-sm text-left px-2 py-1.5 cursor-pointer",
                triggerClassName
            )}
        >
            Logout
        </DropdownMenuItem>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerContent}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-left">Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-left">
                        This will log you out of your account.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-center">
                    <form action={action}>
                        <Button variant="outline" type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : "Logout"}
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
