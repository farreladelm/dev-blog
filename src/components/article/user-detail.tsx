import Link from 'next/link'
import ProfileAvatar from '../shared/profile-avatar'

type UserDetailProps = {
    username: string;
    name: string;
    imageUrl: string | null;
};

export default function UserDetail({ username, name, imageUrl }: UserDetailProps) {
    return (
        <Link href={`/${username}`} className="w-fit group">
            <div className="py-2 flex items-center gap-3 w-fit">
                <ProfileAvatar username={username} imageUrl={imageUrl} />
                <div className="flex flex-col">
                    <span className="font-medium group-hover:underline">{name}</span>
                    <span className="text-xs text-muted-foreground">{username}</span>
                </div>
            </div>
        </Link>
    )
}
