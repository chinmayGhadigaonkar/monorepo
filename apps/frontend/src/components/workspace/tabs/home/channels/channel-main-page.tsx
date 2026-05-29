import React, { useRef } from "react";
import toast from "react-hot-toast";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Quill from "quill";

import { getPreSignedUrl, uploadFileToStroage } from "@/actions/storage";
import { useSocket } from "@/hooks/useSocket";
import { useGetWorkspaceChannel } from "@/hooks/useWorkspaceChannel";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

import ChannelFiles from "./channel-files";
import ChannelHeader from "./channel-header";
import Editor from "./editor";
import ChatSection from "./messages/chat-section";

const ChannelMainPage = ({ channelId }: { channelId: string }) => {
    const { workspaceId } = useParams();
    const [activeTab, setActiveTab] = React.useState("messages");

    const socket = useSocket();

    const { workspaceChannelData, fetchWorkspaceChannelLoading } = useGetWorkspaceChannel(
        workspaceId as string,
        channelId
    );

    const quillRef = useRef<Quill | null>(null);

    const handleSubmit = async ({ message, file }: { message: string; file: File | null }) => {
        let url;
        if (file) {
            console.log(file);
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
            chatId: channelId,
            message: message,
            attachment: url,
        });
        quillRef.current?.setContents([]);
    };

    return (
        <div className="flex max-h-screen w-full flex-1 flex-col">
            {fetchWorkspaceChannelLoading ? (
                <div className="flex h-screen w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="flex h-screen flex-col">
                    <div className="shrink-0">
                        <ChannelHeader
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            workspaceChannelData={workspaceChannelData}
                        />
                    </div>
                    {activeTab == "messages" && (
                        <>
                            <ChatSection chatId={channelId} type="Channel" />
                            <div className="mx-4 mb-12 shrink-0">
                                <Editor onSubmit={handleSubmit} innerRef={quillRef} />
                            </div>
                        </>
                    )}
                    {activeTab == "files" && <ChannelFiles channelId={channelId} />}
                </div>
            )}
        </div>
    );
};

export default ChannelMainPage;
