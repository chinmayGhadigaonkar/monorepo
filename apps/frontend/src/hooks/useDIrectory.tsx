import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { People } from "@/types/people";

const useGetPeople = ({ workspaceId, search }: { workspaceId: string; search: string }) => {
    const fetchPeople = async () => {
        const resp = await axios.get(`/api/workspace/${workspaceId}/people?search=${search}`);
        return resp.data;
    };

    const {
        data: people,
        isLoading: fetchPeopleLoading,
        error,
    } = useQuery<{ member: People[] }, Error, People[]>({
        queryKey: ["people", workspaceId, search],
        queryFn: fetchPeople,
        select: (data) => data.member,
        enabled: !!workspaceId,
    });

    return {
        people,
        fetchPeopleLoading,
        error,
    };
};

const useGetPeopleByChannel = ({
    workspaceId,
    channelId,
    search,
    isMember,
}: {
    workspaceId: string;
    channelId: string;
    search: string;
    isMember?: boolean;
}) => {
    const fetchPeople = async () => {
        const resp = await axios.get(`/api/workspace/${workspaceId}/people/${channelId}`, {
            params: {
                search,
                isMember: isMember,
            },
        });
        return resp.data;
    };

    const {
        data: people,
        isLoading: fetchPeopleLoading,
        error,
    } = useQuery<{ member: People[] }, Error, People[]>({
        queryKey: ["people", workspaceId, channelId, search, isMember],
        queryFn: fetchPeople,
        select: (data) => data.member,
        enabled: !!workspaceId && !!channelId,
    });

    return {
        people,
        fetchPeopleLoading,
        error,
    };
};

export { useGetPeopleByChannel };
export default useGetPeople;
