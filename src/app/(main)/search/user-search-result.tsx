import ProfileAvatar from "@/components/profile-avatar";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { UserProfile } from "@/lib/types";
import { Plus } from "lucide-react";

export default function UserSearchResult({ users }: { users: UserProfile[] }) {
    return (
        <div className="flex flex-col gap-2">
            {users.map(user => (
                <Item variant="outline" key={user.id}>
                    <ItemMedia>
                        <ProfileAvatar imageUrl={user.avatarImage} username={user.username} classname="size-10" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{user.username}</ItemTitle>
                        <ItemDescription>{user.bio}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            className="rounded-full"
                            aria-label="Invite"
                        >
                            <Plus />
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
}
