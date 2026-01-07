"use client";

import { useEffect, useState } from "react";
import { searchTags } from "@/actions/tag";
import { useDebounce } from "@/hooks/use-debounce";
import { Hash, X } from "lucide-react";
import { MAX_ARTICLE_TAGS } from "@/constants/article";
import { toast } from "sonner";

type Props = {
    value: string[];
    onChange: (tags: string[]) => void;
};

export default function TagInput({ value, onChange }: Props) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedInput = useDebounce(input, 300);

    const showNoResults =
        debouncedInput.trim().length > 0 &&
        !loading &&
        suggestions.length === 0;


    useEffect(() => {
        let active = true;

        async function fetchTags() {
            if (!debouncedInput.trim()) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            const result = await searchTags(debouncedInput);

            if (active) {
                setSuggestions(result.filter((t) => !value.includes(t)));
                setLoading(false);
            }
        }

        fetchTags();

        return () => {
            active = false;
        };
    }, [debouncedInput, value]);

    const addTag = (tag: string) => {
        if (value.length === MAX_ARTICLE_TAGS) {
            toast.warning(`You can only add up to ${MAX_ARTICLE_TAGS} tags.`);

            return;
        }

        const name = tag.trim();
        if (!name || value.includes(name)) return;

        onChange([...value, name]);
        setInput("");
        setSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
        }

        // handle backspace to remove last tag
        if (e.key === "Backspace" && !input) {
            removeTag(value[value.length - 1]);
        }

        // handle tab to add tag
        if (e.key === "Tab" && input) {
            e.preventDefault();
            addTag(input);
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="space-y-2 px-4 md:px-8 lg:px-12">
            <div className="flex flex-wrap gap-2  p-2">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1"
                    >
                        <Hash size={12} className="text-red-300" />
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add up to 3 tags..."
                    className="flex-1 min-w-30 outline-none bg-transparent"
                />
            </div>

            {
                loading && (
                    <p className="text-xs text-muted-foreground">Searching tags…</p>
                )
            }

            {
                suggestions.length > 0 && (
                    <div className="border rounded-md bg-card shadow-sm">
                        {suggestions.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => addTag(tag)}
                                className="block w-full text-left px-3 py-2 hover:bg-muted text-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )
            }

            {
                showNoResults && (
                    <div className="border rounded-md bg-card px-3 py-2 text-sm text-muted-foreground">
                        No existing tags found.
                        <span className="ml-1 font-medium">
                            Press Enter to create “{debouncedInput}”
                        </span>
                    </div>
                )
            }
        </div>
    );
}
