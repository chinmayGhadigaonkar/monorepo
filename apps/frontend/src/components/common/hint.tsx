import React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Hint = ({ children, message }: { children: React.ReactNode; message: string }) => {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent sideOffset={5}>{message}</TooltipContent>
        </Tooltip>
    );
};

export default Hint;
