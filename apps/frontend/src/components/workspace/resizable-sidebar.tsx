import { FC } from "react";

import HomeResizableSideBarContent from "@/components/workspace/tabs/home/home-resizablesidebar-content";
import { WorkspaceTab } from "@/types/workspace";

import FileSidebarContent from "../files/files-sidebar-content";
import ResizableSideBarHeader from "./resizable-sidebar-header";
import DMSidebarContent from "./tabs/dm-sidebar-content";

type Props = {
    workspaceId: string;
    tab: WorkspaceTab;
};
const ResizableSideBar: FC<Props> = ({ workspaceId, tab }) => {
    return (
        <div className="p-2">
            <ResizableSideBarHeader workspaceId={workspaceId} />

            <div className="flex flex-col gap-2">
                {tab === "home" && <HomeResizableSideBarContent workspaceId={workspaceId} />}
                {tab === "dms" && <DMSidebarContent workspaceId={workspaceId} />}
                {tab === "activity" && <div>Activity</div>}
                {tab === "files" && <FileSidebarContent workspaceId={workspaceId} />}
            </div>
        </div>
    );
};

export default ResizableSideBar;
