"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const readdirp_1 = __importDefault(require("readdirp"));
function uploadFile(entry, storageName, accessKey) {
    const stats = fs_1.default.statSync(entry.fullPath);
    const fileSizeInBytes = stats.size;
    let readStream = fs_1.default.createReadStream(entry.fullPath);
    return node_fetch_1.default(`https://storage.bunnycdn.com/${storageName}/${entry.path}`, {
        method: 'POST',
        headers: {
            "AccessKey": accessKey,
            "Content-length": fileSizeInBytes.toString()
        },
        body: readStream
    });
}
async function run(path, storageName, accessKey) {
    for await (const entry of readdirp_1.default(path)) {
        uploadFile(entry, storageName, accessKey);
    }
}
exports.default = run;
//# sourceMappingURL=uploader.js.map