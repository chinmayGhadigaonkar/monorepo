import { redirect } from "next/navigation";

import { getServerSession } from "@/actions/session";

export default async function Home() {
    const session = await getServerSession();
    console.log("testing");
    console.log(session);

    if (session === null) {
        redirect("/signin");
    }

    if (session?.user?.lastUsedWorkspaceId === null) {
        redirect("/workspace/new");
    }

    return redirect(`/workspace/${session?.user?.lastUsedWorkspaceId}/home`);
}
