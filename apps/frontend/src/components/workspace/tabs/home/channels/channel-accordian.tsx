"use client";

import React, { Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    CustomeAccordionTrigger,
} from "@/components/ui/accordion";
import { WorkspaceChannel } from "@/prisma-types/client";

import { ChannelsMenu } from "./channel-menu-dropdown";

const ChannelAccodian = ({ data }: { data: WorkspaceChannel[] }) => {
    const searchParams = useSearchParams();
    const channelId = searchParams.get("id");

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <div className="flex items-center justify-between">
                    <CustomeAccordionTrigger className="hover:cursor-pointer hover:no-underline">
                        Channels
                    </CustomeAccordionTrigger>
                    <ChannelsMenu />
                </div>
                <AccordionContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        {data.length === 0 ? (
                            <AccordionItem value="item-1" className="px-2">
                                <p>No Channels</p>
                            </AccordionItem>
                        ) : (
                            data.map((channel) => {
                                return (
                                    <Link
                                        href={`?type=channel&id=${channel.id}`}
                                        key={channel.id}
                                        className={`mb-2 flex items-center py-1 hover:cursor-pointer hover:bg-accent rounded-md ${channel.id === channelId ? "bg-accent" : ""} `}
                                    >
                                        <AccordionItem value={channel.id}>
                                            <p className="rounded-md px-2 font-medium">
                                                {"#"}
                                                {channel.name}
                                            </p>
                                        </AccordionItem>
                                    </Link>
                                );
                            })
                        )}
                    </Suspense>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ChannelAccodian;
