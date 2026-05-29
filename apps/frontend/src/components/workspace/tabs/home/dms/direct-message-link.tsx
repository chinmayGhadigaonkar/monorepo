"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const DirectMessageLink = ({
    workspaceId,
    otherUserId,
    otherUserName,
}: {
    workspaceId: string;
    otherUserId: string | undefined;
    otherUserName: string | undefined;
}) => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    return (
        <Link
            href={`/workspace/${workspaceId}/home?type=dms&id=${otherUserId}`}
            className={`hover:bg-accent flex items-center gap-2 rounded px-2 py-1 text-sm font-semibold transition-colors ${
                otherUserId === id ? "bg-accent" : ""
            }`}
        >
            {otherUserName ?? "Direct Message"}
        </Link>
    );
};
