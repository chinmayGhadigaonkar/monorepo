import { headers } from "next/headers";

import { auth } from "@/utils/auth";

export const getServerSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
};
