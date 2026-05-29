import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "@/utils/axios-instance";

const upsertDMGroup = async ({ workspaceId, userId }: { workspaceId: string; userId: string }) => {
    try {
        const result = await axiosInstance.post("/api/dm-group", {
            workspaceId,
            userId,
        });
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useUpsertDMGroup = () => {
    const { mutate, mutateAsync, isPending, data, error } = useMutation({
        mutationFn: upsertDMGroup,
    });

    return {
        upsertDMGroup: mutate,
        upsertDMGroupAsync: mutateAsync,
        upsertDMGroupPending: isPending,
        dmGroupData: data?.data?.dmGroup,
        upsertDMGroupError: error,
    };
};
