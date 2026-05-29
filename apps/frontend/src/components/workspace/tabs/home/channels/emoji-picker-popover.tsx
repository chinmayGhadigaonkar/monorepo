import React from "react";

import { EmojiClickData } from "emoji-picker-react";
import dynamic from "next/dynamic";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Picker = dynamic(
    () => import("emoji-picker-react").then((mod) => mod.default),
    { ssr: false }
);

const EmojiPickerPopover = ({
    children,
    hint,
    onEmojiSelect,
}: {
    children: React.ReactNode;
    hint: string;
    onEmojiSelect: (emoji: string) => void;
}) => {
    const [isToolTipOpen, setIsToolTipOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleOnEmoji = (data: EmojiClickData) => {
        onEmojiSelect(data.emoji);
        setIsPopoverOpen(false);

        setTimeout(() => {
            setIsToolTipOpen(false);
        }, 100);
    };

    return (
        <TooltipProvider delayDuration={500}>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip open={isToolTipOpen} onOpenChange={setIsToolTipOpen}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent sideOffset={5}>{hint}</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-full">
                    <Picker onEmojiClick={(d) => handleOnEmoji(d)} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
};

export default EmojiPickerPopover;
