import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "@/utils/axios-instance";

const fetchSearch = async (workspaceId: string, search: string, type: string) => {
    try {
        const result = await axiosInstance.get(
            `/api/search/dms-channels?workspaceId=${workspaceId}&search=${search}&type=${type}`
        );
        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error instanceof AxiosError ? error.response?.data.message : error.message);
    }
};

export const useSearch = (workspaceId: string, search: string, type: string) => {
    const { data: searchData, isLoading } = useQuery({
        queryKey: ["workspace", workspaceId, "search", search, type],
        queryFn: () => fetchSearch(workspaceId, search, type),
        enabled: !!search && !!workspaceId,
    });
    return {
        searchData: searchData?.results,
        fetchSearchLoading: isLoading,
    };
};
