import React from "react";

import { Input } from "@/components/ui/input";

const Toolbar = () => {
    return (
        <div className="bg-sidebar text-sidebar-foreground border-sidebar-border/30 mx-auto h-12 w-full border-r transition-colors duration-200">
            <div className="mx-auto flex h-full w-full max-w-[80rem] items-center justify-center">
                <div>
                    <Input placeholder="Search" className="w-[32rem]" />
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
