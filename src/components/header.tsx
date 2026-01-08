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
import ProfileAvatar from "./profile-avatar";

const Header = async () => {
    const authUser = await getSession();

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
                        <Button variant="link" asChild>

                            <Link href="/login">
                                Login
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/register">
                                Create Account
                            </Link>

                        </Button>
                    </nav>
                ) : (
                    <nav className="flex gap-4 items-center">
                        <Button variant="outline" asChild>
                            <Link href="/articles/new">
                                <IoAdd />
                                New Article
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer" asChild>
                                <ProfileAvatar username={authUser.username} />
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