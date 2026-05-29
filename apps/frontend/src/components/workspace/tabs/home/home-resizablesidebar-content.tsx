import React from "react";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";

import ChannelAccodian from "./channels/channel-accordian";
import Directory from "./directories/directory";
import DirectMessagesList from "./dms/direct-message-list";

const HomeResizableSideBarContent = async ({ workspaceId }: { workspaceId: string }) => {
    const session = await getServerSession();
    const data = await prisma.workspaceChannel.findMany({
        where: {
            workspaceId: workspaceId,
            OR: [
                {
                    workspaceUsers: {
                        some: {
                            userId: session?.user.id,
                        },
                    },
                },
                {
                    createdByUserId: session?.user.id,
                },
            ],
        },
    });

    return (
        <div className="p-2">
            <Directory />
            {/* Channels */}
            <ChannelAccodian data={data} />
            {/* Direct Messages */}
            <DirectMessagesList workspaceId={workspaceId} />
        </div>
    );
};
export default HomeResizableSideBarContent;
