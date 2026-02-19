import { getSession } from "@/lib/auth";
import HeaderClient from "./header-client";

const Header = async () => {
    const authUser = await getSession();

    return (
        <HeaderClient authUser={authUser} />
    )
}

export default Header
