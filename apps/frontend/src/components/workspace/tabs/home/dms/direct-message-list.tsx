import React from "react";

import { Plus } from "lucide-react";
import Link from "next/link";

import { getServerSession } from "@/actions/session";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    CustomeAccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

import { DirectMessageLink } from "./direct-message-link";
import { DMsMenu } from "./dms-menu";

const DirectMessagesList = async ({ workspaceId }: { workspaceId: string }) => {
    const session = await getServerSession();

    const findUserId = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: session?.user.id,
        },
    });
    const dms = await prisma.dMGroup.findMany({
        where: {
            // Filter to DMs that belong to this workspace
            workspaceId: workspaceId,

            // DMs where the current user is the creator OR a participant
            workspaceUserIds: {
                hasSome: [findUserId?.id ?? ""],
            },
        },
        take: 5,
    });

    const allWorkspaceUserIds = Array.from(new Set(dms.flatMap((dm) => dm.workspaceUserIds)));
    const workspaceUsers = await prisma.workspaceUser.findMany({
        where: { id: { in: allWorkspaceUserIds } },
        include: { user: true },
    });

    const dmsWithUsers = dms.map((dm) => ({
        ...dm,
        workspaceUsers: dm.workspaceUserIds
            .map((id) => workspaceUsers.find((wu) => wu.id === id))
            .filter(Boolean) as typeof workspaceUsers,
    }));

    console.log(dms);

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <div className="flex items-center justify-between">
                    <CustomeAccordionTrigger className="hover:cursor-pointer hover:no-underline">
                        Direct Messages
                    </CustomeAccordionTrigger>
                    <div className="flex gap-2">
                        <Link
                            href={`/workspace/${workspaceId}/home?type=dms`}
                            className="cursor-pointer p-0"
                        >
                            <Plus size={15} />
                        </Link>
                        <DMsMenu />
                    </div>
                </div>
                <AccordionContent>
                    {dmsWithUsers?.map((dm) => {
                        // Show the other participant, not the current user. Fallback to current user if self-DM.
                        const other =
                            dm.workspaceUsers.find((wu) => wu?.userId !== session?.user.id) ||
                            dm.workspaceUsers[0];
                        return (
                            <DirectMessageLink
                                key={dm.id}
                                workspaceId={workspaceId}
                                otherUserId={other?.userId}
                                otherUserName={other?.user?.name}
                            />
                        );
                    })}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default DirectMessagesList;
