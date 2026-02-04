import { avatarVariants, getAvatarFallback } from "@/lib/avatarFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ProfileAvatarProps = {
    username: string;
    imageUrl: string | null;
    classname?: string
}

export default function ProfileAvatar({ username, imageUrl, classname = "" }: ProfileAvatarProps) {
    const { initials, colorIndex } = getAvatarFallback(username);

    return (
        <Avatar className={classname}>
            {imageUrl &&
                <AvatarImage
                    src={imageUrl}
                    alt={`@${username}`}
                />
            }

            <AvatarFallback className={avatarVariants[colorIndex]}>{initials}</AvatarFallback>
        </Avatar>
    )
}
