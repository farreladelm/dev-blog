"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaLaptopCode } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { Menu, X } from "lucide-react";
import SearchBar from "./search-bar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutDialog } from "./logout-dialog";
import ProfileAvatar from "@/components/shared/profile-avatar";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeaderClientProps = {
    authUser: SessionUser | null;
};

type NavLink = {
    label: string;
    href: string;
};

const getAuthLinks = (authUser: SessionUser): NavLink[] => [
    { label: "Profile", href: `/${authUser.username}` },
    { label: "My Articles", href: "/my-articles" },
    { label: "New Article", href: "/articles/new" },
    { label: "Edit Profile", href: "/profile/edit" },
];

const guestLinks: NavLink[] = [
    { label: "Login", href: "/login" },
    { label: "Create Account", href: "/register" },
];

const DesktopAuthNav = ({ authUser }: { authUser: SessionUser }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <nav className="hidden items-center gap-4 md:flex">
            <Button variant="outline" className="hidden lg:flex" asChild>
                <Link href="/articles/new">
                    <IoAdd />
                    <span>New Article</span>
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                    <ProfileAvatar
                        username={authUser.username}
                        imageUrl={authUser.avatarImage}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
                    <DropdownMenuLabel className="overflow-hidden text-ellipsis">
                        {authUser.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {getAuthLinks(authUser).map((link) => (
                            <DropdownMenuItem key={link.href}>
                                <Link href={link.href} className="w-full hover:underline">
                                    {link.label}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <LogoutDialog />
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
};

const DesktopGuestNav = () => (
    <nav className="hidden space-x-4 md:block">
        <Button variant="link" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" asChild>
            <Link href="/register">Create Account</Link>
        </Button>
    </nav>
);

const MobileNavLinks = ({
    authUser,
    onNavigate,
}: {
    authUser: SessionUser | null;
    onNavigate: () => void;
}) => (
    <nav className="flex flex-col gap-2">
        {authUser ? (
            <>
                {getAuthLinks(authUser).map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onNavigate}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                        {link.label}
                    </Link>
                ))}
                <LogoutDialog
                    trigger={
                        <Button variant="outline" className="w-full">
                            Logout
                        </Button>
                    }
                />
            </>
        ) : (
            <>
                {guestLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onNavigate}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                        {link.label}
                    </Link>
                ))}
            </>
        )}
    </nav>
);

const MobileNav = ({ authUser }: { authUser: SessionUser | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const closeNav = () => setIsOpen(false);
    const panelId = "mobile-nav";

    useEffect(() => {
        if (!isOpen) return;
        const { body } = document;
        const previousOverflow = body.style.overflow;
        body.style.overflow = "hidden";
        return () => {
            body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setIsOpen(true)}
            >
                <Menu />
                <span className="sr-only">Open navigation</span>
            </Button>
            <button
                type="button"
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={closeNav}
            />
            <aside
                id={panelId}
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col border-l bg-background p-4 shadow-lg transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Menu</span>
                    <Button variant="ghost" size="icon" onClick={closeNav}>
                        <X />
                        <span className="sr-only">Close navigation</span>
                    </Button>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                    <SearchBar onSearch={closeNav} />
                    {authUser && (
                        <Button asChild className="w-full">
                            <Link href="/articles/new" onClick={closeNav}>
                                <IoAdd />
                                <span>New Article</span>
                            </Link>
                        </Button>
                    )}
                    <MobileNavLinks authUser={authUser} onNavigate={closeNav} />
                </div>
            </aside>
        </>
    );
};

const HeaderClient = ({ authUser }: HeaderClientProps) => {
    return (
        <header className="border-b border-border bg-card sticky top-0 z-50 w-full">
            <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-3xl">
                        <FaLaptopCode />
                    </Link>
                    <div className="hidden md:flex">
                        <SearchBar />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {authUser ? (
                        <DesktopAuthNav authUser={authUser} />
                    ) : (
                        <DesktopGuestNav />
                    )}
                    <MobileNav authUser={authUser} />
                </div>
            </div>
        </header>
    );
};

export default HeaderClient;
