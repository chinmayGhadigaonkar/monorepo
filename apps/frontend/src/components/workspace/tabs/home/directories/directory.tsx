"use client";

import React from "react";

import { LucideNotebook } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Directory = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    return (
        <div>
            {/* Directories */}
            <Link
                href={`?type=directory`}
                className={`mb-2 flex items-center rounded-md py-1.5 pl-2 text-sm hover:cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${
                    type === "directory" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
                <span className="text-xs">
                    <LucideNotebook size={"16"} />
                </span>
                <p className="rounded-md px-2 font-medium">Directories</p>
            </Link>
        </div>
    );
};

export default Directory;
