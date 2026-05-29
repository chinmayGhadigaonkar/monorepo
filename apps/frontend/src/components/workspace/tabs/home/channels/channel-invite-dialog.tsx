import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { CirclePlus, CircleX, Loader2, Mail, UserPlus } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

import { addMemberToWorkspaceChannel } from "@/actions/workspace-channel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, LoadingButton } from "@/components/ui/button";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetPeopleByChannel } from "@/hooks/useDIrectory";
import { useDebounce } from "@/hooks/useDebounce";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

const ChannelInviteDialog = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [inputValue, setInputValue] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [openCMD, setOpenCMD] = useState<boolean>(false);
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const searchParams = useSearchParams();
    const channelId = searchParams.get("id");
    const debouncedSearch = useDebounce(inputValue, 300);

    const { people, fetchPeopleLoading } = useGetPeopleByChannel({
        workspaceId,
        channelId: channelId!,
        search: debouncedSearch,
        isMember: false,
    });
    const [isPending, setTransition] = useTransition();

    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

    const handleOnAdd = (personId: string) => {
        setSelectedPeople((prev) => [...prev, personId]);
    };
    const handleOnRemove = (personId: string) => {
        setSelectedPeople((prev) => prev.filter((id) => id !== personId));
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setOpenCMD(true);
        } else {
            setOpenCMD(false);
        }
        setInputValue(e.target.value);
    };

    const handleOnSubmit = () => {
        setTransition(async () => {
            const payload = {
                workspaceId: workspaceId,
                channelId: channelId!,
                memberIds: selectedPeople,
            };
            const response = await addMemberToWorkspaceChannel(payload);
            if (response.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                setOpenDialog(false);
                setInputValue("");
                setSelectedPeople([]);
                setOpenCMD(false);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        });
    };

    const handleOnClose = () => {
        setOpenDialog(false);
        setInputValue("");
        setSelectedPeople([]);
        setOpenCMD(false);
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Teammates</DialogTitle>
                    <DialogDescription>Invite teammates to your Channel</DialogDescription>
                </DialogHeader>
                <div className={`relative gap-2 ${openCMD ? "h-32" : "h-full"}`}>
                    <Input
                        placeholder="Enter email address or name"
                        value={inputValue}
                        onChange={handleOnChange}
                        required
                    />
                    {openCMD && (
                        <Command
                            className="absolute h-20 min-h-20 w-full border"
                            shouldFilter={false}
                        >
                            {!fetchPeopleLoading && (
                                <CommandList>
                                    <CommandEmpty>No User Found</CommandEmpty>
                                </CommandList>
                            )}
                            {fetchPeopleLoading ? (
                                <div className="flex h-full items-center justify-center">
                                    <Loader2 className="animate-spin" />
                                </div>
                            ) : (
                                people?.map((person) => (
                                    <CommandItem
                                        key={person.id}
                                        value={person.email}
                                        className="top-1 m-2 flex items-center justify-between border"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={person.profileImage} />
                                                <AvatarFallback>
                                                    {person.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="ml-2 font-semibold">
                                                    {person.name}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {person.email}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedPeople.includes(person.id) ? (
                                            <Button
                                                variant={"destructive"}
                                                size={"sm"}
                                                className="rounded-md px-3 py-1 text-white"
                                                onClick={() => handleOnRemove(person.id)}
                                            >
                                                <CircleX className="text-white" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={"outline"}
                                                size={"sm"}
                                                className="rounded-md px-3 py-1"
                                                onClick={() => handleOnAdd(person.id)}
                                            >
                                                <CirclePlus />
                                            </Button>
                                        )}
                                    </CommandItem>
                                ))
                            )}
                        </Command>
                    )}
                </div>
                <DialogFooter>
                    <Button variant={"outline"} onClick={handleOnClose}>
                        Cancel
                    </Button>

                    <LoadingButton
                        loading={isPending}
                        disabled={selectedPeople.length === 0}
                        onClick={handleOnSubmit}
                        variant={"primary"}
                        className="w-20"
                    >
                        Add{" "}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChannelInviteDialog;
