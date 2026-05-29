import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { FetchWorkspaceOutput, FetchWorkspacesOutput } from "@/types/workspace";
import axiosInstance from "@/utils/axios-instance";

export const fetchWorkspaces = async () => {
    try {
        const result = await axiosInstance.get(`/api/workspace`);
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

const useGetAllWorkpace = () => {
    const { data: workspaceData, isLoading: fetchWorkspaceLoading } = useQuery<FetchWorkspacesOutput>(
        {
            queryKey: ["workspace"],
            queryFn: () => fetchWorkspaces(),
        }
    );

    return {
        workspaces: workspaceData?.workspaces,
        fetchWorkspaceLoading,
    };
};

//  Fetch workspace by id
export const fetchWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
    try {
        const result = await axiosInstance.get(`/api/workspace/${workspaceId}`);
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
    const { data: workspaceData, isLoading: fetchWorkspaceLoading } = useQuery<FetchWorkspaceOutput>({
        queryKey: ["workspace", workspaceId],
        queryFn: () => fetchWorkspace({ workspaceId }),
    });

    return {
        workspace: workspaceData?.workspace,
        fetchWorkspaceLoading,
    };
};

export default useGetAllWorkpace;
