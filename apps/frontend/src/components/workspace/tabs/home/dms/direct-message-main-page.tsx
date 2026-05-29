"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Loader2 } from "lucide-react";
import Quill from "quill";

import { getPreSignedUrl, uploadFileToStroage } from "@/actions/storage";
import { useUpsertDMGroup } from "@/hooks/useDMGroup";
import { useSocket } from "@/hooks/useSocket";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

import Editor from "../channels/editor";
import ChatSection from "../channels/messages/chat-section";
import DirectMessageFiles from "./direct-message-files";
import DirectMessageHeader from "./direct-message-header";
import DirectUserHeader from "./direct-message-user-header";

const DirectMessageMainPage = ({ userId, workspaceId }: { userId: string; workspaceId: string }) => {
    const { upsertDMGroupAsync, upsertDMGroupPending, dmGroupData } = useUpsertDMGroup();
    const [activeTab, setActiveTab] = useState<string>("messages");
    const quillRef = useRef<Quill | null>(null);
    const socket = useSocket();

    useEffect(() => {
        if (userId) {
            upsertDMGroupAsync({ workspaceId, userId });
        }
    }, [userId, workspaceId]);
    const handleSubmit = async ({ message, file }: { message: string; file: File | null }) => {
        let url;
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB limit");
                return;
            }

            const signedUrlResponse = await getPreSignedUrl(file.name, file.type);
            if (signedUrlResponse.status === SERVER_RESPONSE_STATUS.FAILED) {
                toast.error(signedUrlResponse.message);
                return;
            }
            const uploadUrlResponse = await uploadFileToStroage(
                signedUrlResponse.data.url,
                file.type,
                file
            );

            if (uploadUrlResponse.status === SERVER_RESPONSE_STATUS.FAILED) {
                toast.error(uploadUrlResponse.message);
                return;
            }
            url = uploadUrlResponse.data.url;
        }

        socket.emit("New_Message", {
            chatId: dmGroupData.id,
            message: message,
            attachment: url,
            type: "DM",
        });
        quillRef.current?.setContents([]);
    };
    return (
        <div className="flex h-full max-h-screen w-full flex-col overflow-hidden">
            {/* Show "New Message" header ONLY if we don't have a specific conversation open */}
            {!userId && (
                <div className="w-full">
                    <DirectMessageHeader />
                </div>
            )}

            <div className="flex max-h-screen flex-1 flex-col justify-between overflow-hidden">
                {upsertDMGroupPending && (
                    <div className="flex h-screen w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}
                {!upsertDMGroupPending && dmGroupData && (
                    <>
                        <DirectUserHeader
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            userData={dmGroupData.workspaceUsers[0].user}
                        />

                        {activeTab === "messages" && (
                            <div className="flex flex-1 flex-col overflow-hidden">
                                <ChatSection chatId={dmGroupData.id} type="DM" />
                                <div className="mx-4 mb-12 shrink-0">
                                    <Editor onSubmit={handleSubmit} innerRef={quillRef} />
                                </div>
                            </div>
                        )}

                        {activeTab === "files" && <DirectMessageFiles directId={dmGroupData.id} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default DirectMessageMainPage;
