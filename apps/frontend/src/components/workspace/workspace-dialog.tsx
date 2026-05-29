"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CreateWorkSpaceForm from "./create-workspace-form";

const WorkspaceDialog = () => {
    const [open, setOpen] = useState(true);
    return (
        <Dialog open={open} onOpenChange={(newValue) => setOpen(newValue)}>
            <DialogContent
                className="sm:max-w-lg"
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <CreateWorkSpaceForm />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WorkspaceDialog;
