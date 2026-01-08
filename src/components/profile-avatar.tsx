import { avatarVariants, getAvatarFallback } from "@/lib/avatarFallback";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function ProfileAvatar({ username }: { username: string }) {
    const { initials, colorIndex } = getAvatarFallback(username);

    return (
        <Avatar>
            <AvatarFallback className={avatarVariants[colorIndex]}>{initials}</AvatarFallback>
        </Avatar>
    )
}
