import fs from "fs";
import path from "path";

interface WorkspaceInviteParams {
    inviterName: string;
    workspaceName: string;
    workspaceDescription?: string;
    inviteLink: string;
    baseUrl: string;
}

/**
 * Generate workspace invitation email HTML
 */
export function generateWorkspaceInviteEmail(params: WorkspaceInviteParams): string {
    const templatePath = path.join(
        process.cwd(),
        "src",
        "lib",
        "email-templates",
        "workspace-invite.html"
    );
    let template = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders with actual values
    template = template.replace(/{{INVITER_NAME}}/g, params.inviterName);
    template = template.replace(/{{WORKSPACE_NAME}}/g, params.workspaceName);
    template = template.replace(
        /{{WORKSPACE_DESCRIPTION}}/g,
        params.workspaceDescription || "Join us and start collaborating!"
    );
    template = template.replace(/{{INVITE_LINK}}/g, params.inviteLink);
    template = template.replace(/{{BETTER_AUTH_URL}}/g, params.baseUrl);

    return template;
}
