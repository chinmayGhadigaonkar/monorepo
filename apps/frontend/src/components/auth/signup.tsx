"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schema/auth";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { authClient } from "@/utils/auth-client";

const SignUp = () => {
    const router = useRouter();
    const [isPending, startSignUpTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        startSignUpTransition(async () => {
            const response = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
            });

            if (response.data) {
                toast.success("User created successfully");

                form.reset();
                router.push("/signin");
            } else {
                const { message } = response.error;
                toast.error(message!);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter full name"
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
                <Button
                    type="submit"
                    size={"lg"}
                    className="bg-btn-color hover:bg-btn-color/50 w-full cursor-pointer"
                    disabled={isPending}
                >
                    Sign Up
                </Button>
            </form>
        </Form>
    );
};

export default SignUp;
