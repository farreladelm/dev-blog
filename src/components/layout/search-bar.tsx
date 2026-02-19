"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

type SearchBarProps = {
    onSearch?: () => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchValue, setSearchValue] = useState("")
    const router = useRouter()

    const handleSearch = () => {
        if (searchValue.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchValue)}`)
            onSearch?.()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <ButtonGroup className="w-full md:w-auto">
            <Input
                placeholder="Type to search..."
                className="md:w-96"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button variant="outline" onClick={handleSearch}>
                Search
            </Button>
        </ButtonGroup>
    )
}
