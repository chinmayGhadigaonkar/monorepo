"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";

import { Paperclip, SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import Hint from "@/components/common/hint";
import { Button } from "@/components/ui/button";

import EmojiPickerPopover from "./emoji-picker-popover";

interface EditorProps {
    onSubmit: ({ message, file }: { message: string; file: File | null }) => void;
    placeholder?: string;
    disable?: boolean;
    defaultValue?: string;
    innerRef?: React.RefObject<Quill | null>;
}

const Editor = ({
    onSubmit,
    placeholder = " Type a message",
    disable = false,
    defaultValue,
    innerRef,
}: EditorProps) => {
    const [text, setText] = React.useState<string>("");
    const [file, setFile] = React.useState<File | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const onSubmitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef<string>(defaultValue || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<File | null>(null);

    const disableRef = useRef(false);

    useLayoutEffect(() => {
        onSubmitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue || "";
        disableRef.current = disable;
    });

    useEffect(() => {
        const container = containerRef.current;

        const editorContainer = container?.appendChild(container.ownerDocument.createElement("div"));

        const QuillOptions: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,

            modules: {
                toolbar: [
                    ["bold", "italic", "underline"],
                    ["link", "blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                const message = JSON.stringify(quill.getContents());

                                const isEmpty = quill.getText().trim().length === 0;

                                if (isEmpty) return;

                                onSubmitRef.current({ message, file: fileRef.current });
                                setFile(null);
                            },
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            },
                        },
                    },
                },
            },
        };
        const quill = new Quill(editorContainer!, QuillOptions);

        quillRef.current = quill;
        quillRef.current.focus();
        if (innerRef) {
            innerRef.current = quill;
        }
        if (defaultValueRef.current) {
            quill.setText(defaultValueRef.current);
        }
        setText(quill.getText());
        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = " ";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const isEmpty = text.replaceAll(/<(.|\n)*?>/g, "").trim().length === 0;

    const handleOnEmojiSelect = (emoji: string) => {
        const quill = quillRef.current;
        if (quill) {
            quill.insertText(quill.getSelection(true)?.index || 0, emoji);
        }
    };

    const handleOnSubmit = useCallback(() => {
        onSubmit({ message: JSON.stringify(quillRef.current?.getContents()), file: file });
        setFile(null);
    }, [onSubmit, file]);
    const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
        e.target.value = "";
    };

    useEffect(() => {
        fileRef.current = file;
    }, [file, setFile]);
    const handleOnFileRemove = () => {
        setFile(null);
    };
    const FileUi = (file: File) => {
        switch (file.type) {
            case "image/jpeg":
            case "image/jpg":
            case "image/png":
            case "image/gif":
                return (
                    <div className="group relative mx-2 w-16 cursor-pointer rounded-xl border-1 px-2">
                        <div className="h-12 w-full">
                            <Image
                                src={URL.createObjectURL(file)}
                                width={50}
                                height={50}
                                alt={file.name}
                                className="h-full w-full"
                            />
                        </div>
                        <button
                            className="absolute top-1 right-1 hidden cursor-pointer group-hover:block"
                            onClick={handleOnFileRemove}
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            default:
                return (
                    <div
                        className={`bg-btn-color group hover:bg-btn-color/70 relative mx-2 flex w-fit cursor-pointer gap-2 rounded-md border-1 px-4 py-2 text-white`}
                    >
                        <span className="flex items-center justify-center rounded-full text-white">
                            <FaFileAlt />
                        </span>
                        <div>
                            <p className="text-xs font-bold">{file.name.slice(0, 15) + "..."}</p>
                            <p className="text-[8px]">{file.type.split("/")[1]}</p>
                        </div>

                        <button
                            className="absolute top-1 right-1 hidden cursor-pointer group-hover:block"
                            onClick={handleOnFileRemove}
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
        }
    };
    return (
        <div className="mt-auto border border-[#dcdcdc] bg-white">
            <div ref={containerRef}></div>
            {file && FileUi(file)}

            <div className="bg-background flex items-center justify-between px-2 py-2">
                <div>
                    <Hint message="Emojis">
                        <EmojiPickerPopover hint="Emojis" onEmojiSelect={handleOnEmojiSelect}>
                            <Button
                                size={"icon"}
                                variant={"outline"}
                                className="cursor-pointer border-none"
                            >
                                <MdOutlineEmojiEmotions />
                            </Button>
                        </EmojiPickerPopover>
                    </Hint>
                    <Hint message="Attachments">
                        <Button
                            size={"icon"}
                            variant={"outline"}
                            className="cursor-pointer border-none"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip />
                        </Button>
                    </Hint>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleOnFileChange}
                        className="hidden"
                        accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,mp3,wav,ogg,mp4,mov,avi,wmv"
                    />
                </div>
                {/* submit button */}
                <div>
                    <Button size={"icon"} disabled={disable || isEmpty} onClick={handleOnSubmit}>
                        <SendHorizontal />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Editor;
