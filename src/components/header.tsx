import Link from "next/link"
import { FaLaptopCode } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import SearchBar from "./search-bar";
import { Button } from "./ui/button";
import { getSession } from "@/lib/auth";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarFallback, avatarVariants } from "@/lib/avatarFallback";
import { LogoutDialog } from "./logout-dialog";

const Header = async () => {
    const authUser = await getSession();
    const { initials, colorIndex } = getAvatarFallback(authUser?.username);

    return (
        <header className="border-b border-border bg-card">
            <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4">
                <div className="flex gap-4 items-center">
                    <Link href="/" className="text-3xl">
                        <FaLaptopCode />
                    </Link>
                    <SearchBar />
                </div>
                {!authUser ? (
                    <nav className="space-x-4">
                        <Link href="/login">
                            <Button variant="link">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline">Create Account</Button>
                        </Link>
                    </nav>
                ) : (
                    <nav className="flex gap-4 items-center">
                        <Link href="/articles/new">
                            <Button variant="outline">
                                <IoAdd />
                                New Article
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer" asChild>
                                <Avatar>
                                    <AvatarFallback className={avatarVariants[colorIndex]}>{initials}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link href={`/profile/`} className="w-full hover:underline">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/articles/new" className="w-full hover:underline">New Article</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <LogoutDialog />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                )
                }

            </div>
        </header>
    )
}

export default Header