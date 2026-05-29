import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "@/utils/axios-instance";

const fetchWorkspaceInvitations = async (workspaceId: string) => {
    try {
        const result = await axiosInstance.get(`/api/workspace/${workspaceId}/invitation`);
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useGetWorkspaceInvitations = (workspaceId: string) => {
    const { data: workspaceInvitationData, isLoading } = useQuery({
        queryKey: ["workspace", workspaceId, "invitation"],
        queryFn: () => fetchWorkspaceInvitations(workspaceId),
    });
    return {
        workspaceInvitationData: workspaceInvitationData?.invitations,
        fetchWorkspaceInvitationLoading: isLoading,
    };
};
