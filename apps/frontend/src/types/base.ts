export const SERVER_RESPONSE_STATUS = {
    SUCCESS: "success",
    FAILED: "failed",
} as const;

export type ServerResponseStatus =
    (typeof SERVER_RESPONSE_STATUS)[keyof typeof SERVER_RESPONSE_STATUS];

export type ErrorResponse = {
    message: string;
    status: typeof SERVER_RESPONSE_STATUS.FAILED;
};

export type SuccessResponse<T> = {
    message: string;
    status: typeof SERVER_RESPONSE_STATUS.SUCCESS;
    data: T;
};
