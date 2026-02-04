import { getUserDetail } from "@/actions/profile";
import { getSession } from "@/lib/auth"
import { notFound, unauthorized } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    if (!session) {
        unauthorized();
    }

    const getUserDetailResult = await getUserDetail(session.username);

    if (!getUserDetailResult.success) {
        notFound();
    }

    const user = getUserDetailResult.data;

    return (
        <div>Hi {user.name}</div>
    )
}
