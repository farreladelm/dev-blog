"use client";

import { useEffect, useState } from "react";
import { getPopularTags, searchTags } from "@/actions/tag";
import { useDebounce } from "@/hooks/use-debounce";
import { Hash, Loader2, X } from "lucide-react";
import { MAX_ARTICLE_TAGS } from "@/constants/article";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { MAX_TAG_CHARACTERS } from "@/constants/tag";

type Props = {
    value: string[];
    onChange: (tags: string[]) => void;
};

export default function TagInput({ value, onChange }: Props) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);


    const debouncedInput = useDebounce(input, 300);

    const isInputTooLong = input.length >= MAX_TAG_CHARACTERS;
    const showNoResults =
        debouncedInput.trim().length > 0 &&
        !loading &&
        suggestions.length === 0;

    useEffect(() => {
        let active = true;

        async function fetchSuggestions() {
            // Case 1: input focused, but empty → popular tags
            if (isFocused && !debouncedInput.trim()) {
                setLoading(true);
                const result = await getPopularTags();

                if (active) {
                    setSuggestions(result.filter((t) => !value.includes(t)));
                    setLoading(false);
                }
                return;
            }

            // Case 2: user is typing → search
            if (debouncedInput.trim()) {
                setLoading(true);
                const result = await searchTags(debouncedInput);

                if (active) {
                    setSuggestions(result.filter((t) => !value.includes(t)));
                    setLoading(false);
                }
                return;
            }

            // Case 3: not focused and empty → nothing
            setSuggestions([]);
        }

        fetchSuggestions();

        return () => {
            active = false;
        };
    }, [debouncedInput, isFocused, value]);


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
                    <Badge
                        key={tag}
                        variant="outline"
                    >
                        <Hash size={12} className="text-red-300" />
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={12} />
                        </button>
                    </Badge>
                ))}

                <input
                    value={input}
                    maxLength={MAX_TAG_CHARACTERS}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Add up to 3 tags..."
                    className="flex-1 min-w-30 outline-none bg-transparent"
                />


            </div>


            {
                suggestions.length > 0 && (
                    <div className="border rounded-md bg-card shadow-sm">
                        <h3 className="px-3 py-2 text-sm font-bold border-b">{
                            isFocused && !debouncedInput && suggestions.length > 0 ? "Popular Tags" : "Tag Suggestions"
                        }</h3>
                        {
                            loading && (
                                <p className="px-3 py-2 text-sm text-muted-foreground">
                                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                                    <span>Searching...</span>
                                </p>
                            )
                        }
                        {!loading && suggestions.map((tag) => (
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
                isInputTooLong && (
                    <p className="text-xs text-red-500">
                        Tag cannot exceed {MAX_TAG_CHARACTERS} characters.
                    </p>
                )
            }

            {
                showNoResults && (
                    <div className="border rounded-md bg-card shadow-sm">
                        <h3 className="px-3 py-2 text-sm font-bold border-b">Tag Suggestions</h3>
                        <p className="px-3 py-2 text-sm">
                            No existing tags found.
                            <span className="ml-1 font-medium">
                                Press Enter to create “{debouncedInput}”
                            </span>

                        </p>
                    </div>
                )
            }


        </div>
    );
}
