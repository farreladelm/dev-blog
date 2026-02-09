import { User } from "@/app/generated/prisma/client"
import ProfileAvatar from "@/components/profile-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link2 } from "lucide-react"
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
                <ProfileAvatar username={user.username} imageUrl={user.avatarImage} classname="z-20 aspect-square size-32 lg:size-40 object-cover mx-auto -translate-y-1/2 rounded-full text-5xl" />
                {isAuthor &&
                    <Button variant="outline" className="absolute top-4 right-4" asChild>
                        <Link href="/profile/edit">Edit</Link>
                    </Button>
                }
            </div>
            <CardHeader>
                <CardTitle className="text-center text-lg">{user.name}</CardTitle>
                <CardDescription className="text-center max-w-sm mx-auto">
                    {user.bio ? user.bio : "Bio not found"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8 justify-center items-center text-xs">
                <p className="text-muted-foreground">Joined On {user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                <div className="flex gap-4 items-center">
                    {user.websiteUrl && <Link href={user.websiteUrl} className="underline text-muted-foreground hover:text-foreground"><Link2 className="size-4 mr-1 inline" />{user.websiteUrl}</Link>}
                    {user.githubUrl && <Link href={user.githubUrl} className="padding-1 rounded-full border border-transparent hover:border-muted-foreground"><IoLogoGithub className="size-5" /></Link>}
                </div>
            </CardContent>
        </Card>
    )
}
