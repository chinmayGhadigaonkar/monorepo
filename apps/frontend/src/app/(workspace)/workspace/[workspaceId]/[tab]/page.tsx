import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ResizableSideBar from "@/components/workspace/resizable-sidebar";
import {
    ActivityWorkspaceTab,
    DMWorkspaceTab,
    FilesWorkspaceTab,
    HomeWorkspaceTab,
} from "@/components/workspace/tabs";
import { SocketProvider } from "@/lib/socket";
import { WorkspaceTab } from "@/types/workspace";

const WorkspaceTabPage = async ({
    params,
}: {
    params: Promise<{ tab: WorkspaceTab; workspaceId: string }>;
}) => {
    const { tab, workspaceId } = await params;

    return (
        <ResizablePanelGroup
            autoSaveId="persistence"
            direction="horizontal"
            className="focus-visible:ring-ring/50 w-full rounded-sm focus-visible:border-0 focus-visible:ring-0"
        >
            {/* TODO: Fix auto resize */}
            <ResizablePanel minSize={20} defaultSize={30} maxSize={35} id="panel-1">
                <ResizableSideBar workspaceId={workspaceId} tab={tab} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} id="panel-2">
                <SocketProvider>
                    <div className="flex flex-1">
                        {tab === "home" && <HomeWorkspaceTab />}
                        {tab === "dms" && <DMWorkspaceTab />}
                        {tab === "activity" && <ActivityWorkspaceTab />}
                        {tab === "files" && <FilesWorkspaceTab workspaceId={workspaceId} />}
                    </div>
                </SocketProvider>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default WorkspaceTabPage;
