"use server";

import { GetSignedUrlConfig } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import path from "node:path";

import { BUCKET_NAME } from "@/lib/constants";
import { storage } from "@/lib/stoage";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

const formatFileName = (originalFilename: string) => {
    const extension = path.extname(originalFilename);
    const base = path.basename(originalFilename, extension);

    const safeFilename = base.replaceAll(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();

    return `${safeFilename}_${Date.now()}${extension}`;
};

export const getPreSignedUrl = async (fileName: string, contentType: string) => {
    try {
        const config: GetSignedUrlConfig = {
            version: "v4",
            action: "write",
            expires: Date.now() + 5 * 60 * 1000,
            contentType,
        };

        const formatttedFileName = formatFileName(fileName);
        const [url] = await storage.bucket(BUCKET_NAME).file(formatttedFileName).getSignedUrl(config);

        if (!url) {
            throw new Error("Failed to generate pre-signed URL");
        }
        return {
            data: {
                url,
            },
            message: "Pre-signed URL generated successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const uploadFileToStroage = async (signedUrl: string, contentType: string, blob: Blob) => {
    try {
        const res = await fetch(signedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": contentType,
            },
            body: blob,
        });

        if (!res.ok) {
            throw new Error(`Upload failed: ${res.statusText}`);
        }

        return {
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            message: "File uploaded successfully",
            data: { url: signedUrl.split("?")[0] },
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const deleteFileFromStorage = async (fileName: string) => {
    try {
        await storage.bucket(BUCKET_NAME).file(fileName).delete();
    } catch (error: unknown) {
        return handleError(error, NextResponse);
    }
};
