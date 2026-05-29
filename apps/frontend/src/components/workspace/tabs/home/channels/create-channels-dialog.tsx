"use client";

import React from "react";
import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import CreateChannelForm from "./create-channel-form";

interface CreateChannelDialogProps {
    children?: React.ReactNode;
}

const CreateChannelDialog: React.FC<CreateChannelDialogProps> = ({ children }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="" asChild>
                {children ? (
                    children
                ) : (
                    <button className="flex items-center gap-2 hover:cursor-pointer hover:text-blue-500">
                        {" "}
                        <IoAdd size={15} className="my-auto text-inherit" />
                        Create Channel
                    </button>
                )}
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle className="text-start">Create Channel</DialogTitle>
                </DialogHeader>
                <CreateChannelForm />
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelDialog;
