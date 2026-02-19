import Link from "next/link"
import { FaLaptopCode } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


export default function NewArticleHeader(
    { mode, onModeChange }: { mode: "edit" | "preview"; onModeChange: (mode: "edit" | "preview") => void }
) {

    return (
        <header className="relative">
            <div className="container mx-auto max-w-4xl flex h-16 items-center justify-between gap-2 px-4">
                <div className="flex gap-4 items-center">
                    <Link href="/articles" className="text-3xl">
                        <FaLaptopCode />
                    </Link>
                    <h1 className="md:text-2xl font-bold">{
                        mode === "edit" ? "Edit Mode" : "Preview Mode"
                    }</h1>
                </div>

                <nav className="flex gap-2 items-center">
                    <Button
                        className="transition"
                        variant={mode === "edit" ? "default" : "ghost"}
                        onClick={() => onModeChange("edit")}
                    >Edit</Button>
                    <Button
                        className="transition"
                        variant={mode === "preview" ? "default" : "ghost"}
                        onClick={() => onModeChange("preview")}
                    >Preview</Button>
                    <Link className="block md:hidden h-6 w-6" href="/">
                        <X className="w-full" />
                    </Link>
                </nav>
            </div>
            <Link className="hidden md:inline-block absolute top-4 right-4 h-6 w-6" href="/">
                <X className="w-full" />
            </Link>
        </header>
    )
}