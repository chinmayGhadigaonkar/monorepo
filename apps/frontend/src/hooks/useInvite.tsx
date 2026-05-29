import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import axiosInstance from "@/utils/axios-instance";

interface InviteDetails {
    workspace: {
        id: string;
        name: string;
    };
    inviter: {
        name: string;
        email: string;
    };
    expiryAt: string;
    status: string;
}

// Hook to fetch invite details
export const useGetInviteDetails = (inviteCode: string) => {
    return useQuery<InviteDetails>({
        queryKey: ["invite-details", inviteCode],
        queryFn: async () => {
            try {
                const response = await axiosInstance.post("/api/invite/get-invite-details", {
                    inviteCode,
                });
                return response.data;
            } catch (error) {
                throw new Error(
                    error instanceof AxiosError
                        ? error.response?.data.error || "Failed to fetch invite details"
                        : "An error occurred while fetching invite details"
                );
            }
        },
        enabled: !!inviteCode,
    });
};

// Hook to accept invite
export const useAcceptInvite = () => {
    return useMutation<{ workspaceId: string }, Error, { inviteCode: string }>({
        mutationFn: async ({ inviteCode }) => {
            try {
                const response = await axiosInstance.post("/api/invite/accept-invite", {
                    inviteCode,
                });
                return response.data;
            } catch (error) {
                throw new Error(
                    error instanceof AxiosError
                        ? error.response?.data.error || "Failed to accept invite"
                        : "An error occurred while accepting the invite"
                );
            }
        },
    });
};

// Hook to reject invite
export const useRejectInvite = () => {
    return useMutation<void, Error, { inviteCode: string }>({
        mutationFn: async ({ inviteCode }) => {
            try {
                await axiosInstance.post("/api/invite/reject-invite", {
                    inviteCode,
                });
            } catch (error) {
                throw new Error(
                    error instanceof AxiosError
                        ? error.response?.data.error || "Failed to reject invite"
                        : "An error occurred while rejecting the invite"
                );
            }
        },
    });
};
