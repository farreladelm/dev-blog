import { User } from "@/app/generated/prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { IoGlobe, IoLogoGithub } from "react-icons/io5"

type ProfileCardProps = {
    user: User;
    isAuthor: boolean;
}

export function ProfileCard({ user, isAuthor }: ProfileCardProps) {
    return (
        <Card className="mx-auto w-full max-w-4xl pt-0 mt-24">
            <div className="relative h-24">
                <img
                    src="/profile.png"
                    alt="profile picture"
                    className="z-20 aspect-square size-32 lg:size-40 object-cover mx-auto -translate-y-1/2 rounded-full"
                />
                {isAuthor &&
                    <Button variant="outline" className="absolute top-4 right-4">Edit</Button>
                }
            </div>
            <CardHeader>
                <CardTitle className="text-center text-lg">{user.name}</CardTitle>
                <CardDescription className="text-center max-w-sm mx-auto">
                    {user.bio ? user.bio : "Bio not found"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center items-center text-xs">
                <p className="text-muted-foreground">Joined On Jan 2026</p>
                <div className="flex gap-2">
                    {user.githubUrl && <Link href={user.githubUrl} className="padding-1 rounded-full border border-transparent hover:border-muted-foreground"><IoLogoGithub className="size-6" /></Link>}
                    {user.websiteUrl && <Link href={user.websiteUrl} className="underline text-muted-foreground hover:text-foreground">{user.websiteUrl}</Link>}
                </div>
            </CardContent>
        </Card>
    )
}
