import toast from "react-hot-toast";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { MessageType } from "@/types/message";
import axiosInstance from "@/utils/axios-instance";

type Props = {
    channelId: string | null;
    directId: string | null;
};

const useMessage = ({ channelId, directId }: Props) => {
    const fetchMessages = async (cursorId: string | null) => {
        try {
            const searchParams = new URLSearchParams({
                ...(cursorId && { cursorId }),
                ...(channelId && { channelId: channelId }),
                ...(directId && { directId: directId }),
            });
            const response = await axiosInstance.get(`/api/messages?${searchParams.toString()}`);

            return response?.data;
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw new Error(
                error instanceof AxiosError ? error.response?.data.message : error.message
            );
        }
    };

    const {
        data: messagesData,
        hasNextPage,
        isFetching,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery<{
        data: {
            messages: MessageType[];
            nextCursor: string | null;
        };
    }>({
        queryKey: ["messages", channelId, directId],
        initialPageParam: null,

        queryFn: async ({ pageParam }) => {
            return await fetchMessages(pageParam as string);
        },
        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor;
        },
    });

    return {
        messages: (messagesData?.pages || [])
            .flatMap((page) => page.data.messages)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        hasNextPage,
        isFetching,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    };
};

export const useMessageDocuments = ({ channelId, directId }: Props) => {
    const fetchMessages = async () => {
        try {
            const searchParams = new URLSearchParams({
                ...(channelId && { channelId: channelId }),
                ...(directId && { directId: directId }),
            });
            const response = await axiosInstance.get(
                `/api/messages/document?${searchParams.toString()}`
            );

            return response?.data;
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw new Error(
                error instanceof AxiosError ? error.response?.data.message : error.message
            );
        }
    };

    const {
        data: messagesData,
        isLoading,
        isFetching,
        refetch,
    } = useQuery<{
        data: {
            messages: MessageType[];
        };
    }>({
        queryKey: ["messages", "Documents", channelId, directId],
        queryFn: async () => {
            return await fetchMessages();
        },
    });

    return {
        messages: messagesData?.data,
        isLoading,
        isFetching,
        refetch,
    };
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    const deleteMessageFn = async (messageId: string) => {
        try {
            const response = await axiosInstance.delete(`/api/messages/${messageId}`);
            return response.data;
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw new Error(
                error instanceof AxiosError ? error.response?.data.message : error.message
            );
        }
    };

    return useMutation({
        mutationFn: deleteMessageFn,
        onSuccess: () => {
            // Invalidate the message queries to refresh the list
            toast.success("Message deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error(error.message);
            }
        },
    });
};

export default useMessage;
