import { redirect } from "next/navigation";

import WorkspaceDialog from "@/components/workspace/workspace-dialog";
import { prisma } from "@/lib/prisma";

type Param = Promise<{ workspaceId: string }>;
const NewWorkspacePage = async ({ params }: { params: Param }) => {
    const { workspaceId } = await params;

    if (workspaceId === "new") return <WorkspaceDialog />;

    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
        },
    });

    if (workspace === null) return <div>workspace not found</div>;

    return redirect(`/workspace/${workspaceId}/home`);
};

export default NewWorkspacePage;
