"server only";

import { Storage } from "@google-cloud/storage";

import { PROJECT_ID } from "./constants";

const storage = new Storage({
    projectId: PROJECT_ID,
    keyFilename: "google-service.json",
});

export { storage };
