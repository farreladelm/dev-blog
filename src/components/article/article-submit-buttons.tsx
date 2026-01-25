'use client'

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { STATUS } from "@/constants/article";

export default function ArticleSubmitButtons() {
    const status = useFormStatus();
    const clickedButton = status.data?.get("status");
    return (
        <div className="mt-4 space-x-4">
            <Button type="submit" name="status" value={STATUS.PUBLISHED} disabled={status.pending}>
                {status.pending && clickedButton === STATUS.PUBLISHED ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish"}
            </Button>
            <Button type="submit" variant="ghost" name="status" value={STATUS.DRAFT}>
                {status.pending && clickedButton === STATUS.DRAFT ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save as Draft"}
            </Button>
        </div>
    )
}
