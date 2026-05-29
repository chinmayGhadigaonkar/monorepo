import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fileUrl = searchParams.get("url");

        if (!fileUrl) {
            return NextResponse.json({ error: "File URL is required" }, { status: 400 });
        }

        // Fetch the file from Google Cloud Storage
        const response = await fetch(fileUrl);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
        }

        // Get the file data
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        // Extract filename from URL
        const filename = fileUrl.split("/").pop() || "download";

        // Return the file with appropriate headers
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": buffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error("Error downloading file:", error);
        return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }
}
