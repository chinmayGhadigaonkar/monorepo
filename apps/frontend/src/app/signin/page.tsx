"use client";

import React from "react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";

import Link from "next/link";

import SignIn from "@/components/auth/signin";
import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";

const Page = () => {
    const handleGithubLogin = async () => {
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
        <div className="mx-auto flex max-w-md flex-1 flex-col justify-center gap-6 px-8 py-12">
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
                Sign in to your account
            </p>
            <p className="text-muted-light dark:text-muted-dark text-center text-base leading-normal font-normal">
                Welcome back! Please enter your details.
            </p>
            {/* Login Form */}
            <SignIn />
            <div className="flex items-center justify-center gap-3">
                <hr className="flex-1" />
                <p className="text-muted-light dark:text-muted-dark text-center text-base leading-normal font-normal opacity-50">
                    OR
                </p>
                <hr className="flex-1" />
            </div>
            {/* Outh */}
            <div className="space-y-5">
                <Button
                    variant="secondary"
                    onClick={handleGithubLogin}
                    className="bg-input-light hover:bg-input-light/50 dark:bg-input-dark dark:hover:bg-input-dark/50 w-full cursor-pointer py-4"
                >
                    <FaGithub /> Github
                </Button>
                <p className="text-muted-light dark:text-muted-dark text-center text-sm">
                    Don't have an account?{" "}
                    <Link className="text-btn-color font-medium hover:underline" href="/signup">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
