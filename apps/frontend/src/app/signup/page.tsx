"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { FaGithub } from "react-icons/fa";

import Link from "next/link";

import SignUp from "@/components/auth/signup";
import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";

const Page = () => {
    const handleGithubSignup = async () => {
        const { data, error } = await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
        });
        if (error) {
            console.log(error);
            toast.error("Login failed");
        }
        if (data) {
            toast.success("Login successful");
        }
    };

    return (
        <div className="mx-auto flex max-w-md flex-1 flex-col justify-center gap-5 px-8 py-12">
            {/* Heading */}
            <div className="mx-auto">
                <div className="flex items-center justify-center">
                    <svg
                        className="text-text-light dark:text-text-dark"
                        fill="none"
                        height="48"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 12c-3.31 0-6-1.34-6-3s2.69-3 6-3 6 1.34 6 3-2.69 3-6 3z"></path>
                        <path d="M12 12c3.31 0 6 1.34 6 3s-2.69 3-6 3-6-1.34-6-3 2.69-3 6-3z"></path>
                        <path d="M12 12c-3.31 0-6-1.34-6-3s2.69-3 6-3 6 1.34 6 3-2.69 3-6 3z"></path>
                        <path d="M12 12c3.31 0 6 1.34 6 3s-2.69 3-6 3-6-1.34-6-3 2.69-3 6-3z"></path>
                    </svg>
                </div>
                <p className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tighter">
                    TeamSync
                </p>
            </div>
            <p className="text-text-light dark:text-text-dark text-center text-4xl leading-tight font-black tracking-[-0.033em]">
                Create an account
            </p>
            <p className="text-muted-light dark:text-muted-dark text-center text-base leading-normal font-normal">
                Let's get started with a free account.
            </p>
            {/* Signup Form */}
            <SignUp />
            <div className="flex items-center justify-center gap-3">
                <hr className="flex-1" />
                <p className="text-muted-light dark:text-muted-dark text-center text-base leading-normal font-normal opacity-50">
                    OR
                </p>
                <hr className="flex-1" />
            </div>
            {/* Outh */}
            <div className="space-y-6">
                <Button
                    variant="secondary"
                    onClick={handleGithubSignup}
                    className="bg-input-light hover:bg-input-light/50 dark:bg-input-dark dark:hover:bg-input-dark/50 w-full cursor-pointer py-4"
                >
                    <FaGithub /> Github
                </Button>
                <p className="text-muted-light dark:text-muted-dark text-center text-sm">
                    Already have an account?{" "}
                    <Link className="text-btn-color font-medium hover:underline" href="/signin">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
