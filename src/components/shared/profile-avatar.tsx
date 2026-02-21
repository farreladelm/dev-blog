import { avatarVariants, getAvatarFallback } from "@/lib/avatar-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ProfileAvatarProps = {
    username?: string | null;
    imageUrl?: string | null;
    classname?: string
}

export default function ProfileAvatar({ username, imageUrl, classname = "" }: ProfileAvatarProps) {
    const safeUsername = username?.trim() || undefined;
    const safeImageUrl = imageUrl?.trim() || undefined;
    const { initials, colorIndex } = getAvatarFallback(safeUsername);


    return (
        <Avatar className={classname}>

            <AvatarImage
                src={safeImageUrl}
                alt={safeUsername ? `@${safeUsername}` : "User avatar"}
                className="object-cover"
            />
            <AvatarFallback className={avatarVariants[colorIndex]}>{initials}</AvatarFallback>
        </Avatar>
    )
};


