"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { addUserToWorkspaceAction } from "@/actions/invite";
import { loginSchema } from "@/schema/auth";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { authClient } from "@/utils/auth-client";

import { LoadingButton } from "../ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const SignIn = () => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            const res = await authClient.signIn.email({
                email: values.email,
                password: values.password,

                callbackURL: "/",
            });

            if (res?.data) {
                const inviteCode = localStorage.getItem("inviteCode");
                if (inviteCode) {
                    const addUserToWorkspace = await addUserToWorkspaceAction({ inviteCode });
                    if (addUserToWorkspace.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                        toast.success("Signed in successfully!");
                        localStorage.removeItem("inviteCode");
                        router.push(`/workspace/${addUserToWorkspace.data?.workspaceId}`);
                    } else {
                        toast.error("Failed to add user to workspace");
                    }
                    return;
                }
                toast.success("Signed in successfully!");

                router.push("/");
                return;
            }

            toast.error("Invalid email or password!");
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto w-full max-w-md space-y-7"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter Email"
                                    {...field}
                                    className="bg-input-light dark:bg-input-dark"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter Password"
                                    type="password"
                                    {...field}
                                    className="bg-input-light dark:bg-input-dark"
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton
                    disabled={isPending}
                    loading={isPending}
                    type="submit"
                    size={"lg"}
                    className="bg-btn-color hover:bg-btn-color/50 w-full cursor-pointer"
                >
                    Sign In
                </LoadingButton>
            </form>
        </Form>
    );
};

export default SignIn;
