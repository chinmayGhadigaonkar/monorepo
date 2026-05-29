import { Job, Worker } from "bullmq";
import nodemailer from "nodemailer";

import { SERVER_RESPONSE_STATUS } from "../types/base";
import { redis_connection } from "./queue";

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        // Create transporter with simple SMTP authentication
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD, // App password instead of OAuth
            },
        });

        await transporter.sendMail({
            from: `"My App" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });

        return {
            message: "Email sent successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
        };
    } catch (error) {
        console.error("Error in sendEmail:", error);
        throw error;
    }
}

export const initEmailWorker = () => {
    const worker = new Worker(
        "emailQueue",
        async (job: Job<{ to: string; subject: string; html: string }>): Promise<void> => {
            const { to, subject, html } = job.data;
            await sendEmail(to, subject, html);
            console.log("Email sent to ", to);
        },
        { connection: redis_connection }
    );

    worker.on("ready", () => {
        console.log("Worker is ready and waiting for jobs");
    });

    worker.on("completed", (job: Job) => {
        console.log(`Job ${job.id} completed`);
    });

    worker.on("error", (error: Error) => {
        console.error(`Job failed: ${error.message}`);
    });

    return worker;
};
