import Link from 'next/link'
import ProfileAvatar from '../profile-avatar'

export default function UserDetail({ username, name }: {
    username: string,
    name: string
}) {
    return (
        <Link href={`/profile/${username}`} className="w-fit group">
            <div className="py-2 flex items-center gap-3 w-fit">
                <ProfileAvatar username={username} />
                <div className="flex flex-col">
                    <span className="font-medium group-hover:underline">{name}</span>
                    <span className="text-xs text-muted-foreground">{username}</span>
                </div>
            </div>
        </Link>
    )
}
