import React from "react";

import Channel from "./channel";
import DirectoryHeader from "./directory-header";
import Invitation from "./invitation";
import People from "./people";

const DirectoryPage = () => {
    const [activeTab, setActiveTab] = React.useState("people");

    return (
        <div className="flex h-screen w-full flex-1 flex-col overflow-hidden">
            <div className="shrink-0">
                <DirectoryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex-1 overflow-hidden">
                {activeTab === "people" && <People />}
                {activeTab === "channels" && <Channel />}
                {activeTab === "invitations" && <Invitation />}
            </div>
        </div>
    );
};

export default DirectoryPage;
