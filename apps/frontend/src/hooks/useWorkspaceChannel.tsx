import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import axiosInstance from "@/utils/axios-instance";

const fetchWorkspaceChannel = async (workspaceId: string, channelId: string) => {
    try {
        const result = await axiosInstance.get(`/api/workspace/${workspaceId}/channel/${channelId}`);
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useGetWorkspaceChannel = (workspaceId: string, channelId: string) => {
    const { data: workspaceChannelData, isLoading } = useQuery({
        queryKey: ["workspace", workspaceId, "channel", channelId],
        queryFn: () => fetchWorkspaceChannel(workspaceId, channelId),
        enabled: !!workspaceId && !!channelId,
    });
    return {
        workspaceChannelData: workspaceChannelData?.channel,
        fetchWorkspaceChannelLoading: isLoading,
    };
};

// Fecth All Channel

const fetchWorkspaceChannels = async (workspaceId: string) => {
    try {
        const result = await axiosInstance.get(`/api/workspace/${workspaceId}/channel`);
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useGetWorkspaceChannels = (workspaceId: string) => {
    const { data: workspaceChannelData, isLoading } = useQuery({
        queryKey: ["workspace", workspaceId, "channel"],
        queryFn: () => fetchWorkspaceChannels(workspaceId),
    });
    return {
        workspaceChannelData: workspaceChannelData?.channels,
        fetchWorkspaceChannelLoading: isLoading,
    };
};
