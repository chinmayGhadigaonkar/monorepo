import React from "react";

import { File } from "lucide-react";
import Link from "next/link";

const FileSidebarContent = ({ workspaceId }: { workspaceId: string }) => {
    return (
        <div className="mt-4">
            <Link
                href={`/workspace/${workspaceId}/files`}
                className={`bg-background hover:bg-background-secondary hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-4 transition-colors`}
            >
                <File className="h-4 w-4" />
                <span>All Files</span>
            </Link>
        </div>
    );
};

export default FileSidebarContent;
