"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploader_1 = __importDefault(require("./uploader"));
const core_1 = __importDefault(require("@actions/core"));
const path_1 = require("path");
try {
    const source = core_1.default.getInput('source');
    const storageZoneName = core_1.default.getInput('storageZoneName');
    const accessKey = core_1.default.getInput('accessKey');
    uploader_1.default(path_1.resolve(source), storageZoneName, accessKey);
}
catch (error) {
    core_1.default.setFailed(error.message);
}
//# sourceMappingURL=index.js.map