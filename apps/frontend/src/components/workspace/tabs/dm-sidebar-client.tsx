"use client";

import React, { useEffect, useState } from "react";

import { Search } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Quill from "quill";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export type DMUser = {
    dmId: string;
    userId: string;
    name: string;
    profileImage: string | null;
    isCurrent: boolean;
    lastMessage: string;
    lastMessageSender: string;
};

export const DMSidebarClient = ({ workspaceId, dms }: { workspaceId: string; dms: DMUser[] }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const filteredDms = dms.filter((dm) =>
        dm.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="mt-2 flex flex-col gap-4">
            <div className="px-2">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                        placeholder="Find a DM"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-gray-200 bg-white pl-8 focus-visible:border-transparent focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto px-1">
                {filteredDms.map((other) => {
                    // let html = "";
                    // try {
                    //     const delta = JSON.parse(other.lastMessage ?? "");
                    //     const quill = new Quill(document.createElement("div"));
                    //     quill.setContents(delta);
                    //     html = quill.root.innerHTML;
                    // } catch (e) {
                    //     html = other.lastMessage || "";
                    // }
                    console.log(other.userId, id);
                    return (
                        <Link
                            key={other.dmId}
                            href={`/workspace/${workspaceId}/dms?id=${other.userId}`}
                            className={`flex items-center gap-2 rounded-lg px-2 py-4 transition-colors hover:bg-gray-100 ${other.userId === id ? "bg-gray-100" : ""}`}
                        >
                            <Avatar className="h-6 w-6 rounded-md">
                                <AvatarImage src={other.profileImage || ""} />
                                <AvatarFallback className="rounded-md bg-pink-600 text-[10px] font-bold text-white">
                                    {other.name.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-medium text-gray-900">
                                    {other.name || "Direct Message"}
                                    {other.isCurrent && " (you)"}
                                </span>
                                {/* <span className="truncate text-xs text-gray-500">
                                    {other?.lastMessageSender}:{" "}
                                    <span
                                        className="block"
                                        dangerouslySetInnerHTML={{ __html: html }}
                                    ></span>
                                </span> */}
                            </div>
                        </Link>
                    );
                })}
                {filteredDms.length === 0 && (
                    <p className="mt-4 text-center text-sm text-gray-500">No matching DMs</p>
                )}
            </div>
        </div>
    );
};
