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
import { useActionState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const LogoutDialog = () => {
    const [data, action, isPending] = useActionState(logoutAction, undefined);

    return (
        <Dialog>

            <DialogTrigger className="w-full hover:underline text-sm text-left px-2 py-1.5">Logout</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This will log you out of your account.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
