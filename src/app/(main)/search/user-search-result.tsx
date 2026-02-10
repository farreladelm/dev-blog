import ProfileAvatar from "@/components/shared/profile-avatar";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { UserProfile } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function UserSearchResult({ users }: { users: UserProfile[] }) {
    return (
        <div className="flex flex-col gap-2">
            {users.map(user => (
                <Item variant="outline" key={user.id}>
                    <ItemMedia>
                        <ProfileAvatar imageUrl={user.avatarImage} username={user.username} classname="size-10" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{user.name}</ItemTitle>
                        <ItemDescription>@{user.username}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button
                            variant="outline"
                        >
                            <Link href={`/${user.username}`}>View Profile</Link>
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
}
