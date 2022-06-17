"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gray_matter_1 = __importDefault(require("gray-matter"));
const marked_1 = require("marked");
const path_1 = require("path");
const fs_1 = require("fs");
let config = {
    index: "index.md",
    titlePrefix: "Untitled",
    defaultMetaDescription: "No description",
    nav: [],
};
const reservedDirs = ["assets", "engine", "extras", "uploads", "source"];
const rootPath = (0, path_1.normalize)(`${__dirname}/..`);
const sourceDirPath = (0, path_1.normalize)(`${rootPath}/source`);
// Read the template upfront - we only have a single template for now
const TEMPLATE = (0, fs_1.readFileSync)((0, path_1.normalize)(`${rootPath}/assets/template.html`), "utf-8");
// Recursively clean up old html pages before generating new ones
// Important so that we remove htmls when we remove source .md files.
function cleanUp(dirPath = rootPath) {
    (0, fs_1.readdirSync)(dirPath).forEach((fname) => {
        const filePath = `${dirPath}/${fname}`;
        const stats = (0, fs_1.statSync)((0, path_1.normalize)(filePath));
        if (stats.isDirectory() &&
            !fname.startsWith(".") && // Don't delete my git folder
            !reservedDirs.find((name) => name === fname)) {
            cleanUp(filePath);
        }
        else if (stats.isFile() && (fname.endsWith("html") || fname === "_config.json")) {
            (0, fs_1.unlinkSync)(filePath);
        }
    });
    if (dirPath !== rootPath) {
        (0, fs_1.rmdirSync)(dirPath);
    }
}
// Recursively parse the source dir and create htmls in the root dir
// at the equivalent location
function parseSources(dirPath = sourceDirPath) {
    let sources = [];
    const targetDirPath = `${rootPath}/${dirPath.substr(sourceDirPath.length)}`;
    if (dirPath !== sourceDirPath) {
        (0, fs_1.mkdirSync)(targetDirPath);
    }
    try {
        sources = (0, fs_1.readdirSync)(dirPath);
    }
    catch {
        console.log(`Invalid source directory ${dirPath}`);
        process.exit(1);
    }
    if (!sources.find((fname) => fname === "_config.json")) {
        console.log(`Source directory ${dirPath} does not contain a _config.json file`);
        process.exit(1);
    }
    sources = sources.filter((s) => s !== "_config.json");
    try {
        const configStr = (0, fs_1.readFileSync)((0, path_1.normalize)(`${dirPath}/_config.json`), "utf-8");
        config = Object.assign({}, config, JSON.parse(configStr));
    }
    catch {
        console.log("Invalid source/_config.json file.");
        process.exit(1);
    }
    const navHTML = config.nav
        .map((obj) => (obj.link ? `<a href="${obj.link}">${obj.title}</a>` : `<span>${obj.title}</span>`))
        .join("\n");
    sources.forEach((name) => {
        console.log(dirPath, name);
        if ((0, fs_1.statSync)((0, path_1.normalize)(`${dirPath}/${name}`)).isDirectory()) {
            parseSources(`${dirPath}/${name}`);
        }
        else {
            createPage(`${dirPath}/${name}`, navHTML, targetDirPath);
        }
    });
}
// Creates a html page from a source markdown file.
// Places it in a the same directory relative to the site root.
function createPage(path, navHTML, dirPath = rootPath) {
    const isMarkdown = path.endsWith(".md");
    const isHTML = path.endsWith(".html");
    const { content, data } = gray_matter_1.default.read(path);
    if (isMarkdown) {
        const pagename = (0, path_1.parse)(path).name;
        const html = (0, marked_1.marked)(content);
        const result = TEMPLATE.replace(/\{\{(.+)\}\}/g, (_match, varName) => {
            switch (varName) {
                case "meta-title":
                    return data.title ? `${config.titlePrefix} - ${data.title}` : config.titlePrefix;
                case "meta-description":
                    return data.description || config.defaultMetaDescription;
                case "navigation":
                    return navHTML;
                case "date":
                    if (!(data.date instanceof Date)) {
                        console.warn(`Missing front matter date in ${path}`);
                        return data.date || "Unknown";
                    }
                    return `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`;
                case "content":
                    return (0, marked_1.marked)(content);
                default:
                    console.warn(`Missing content for template var ${varName} in ${path}`);
                    return `{{ -?- ${varName} -?- }}`;
            }
        });
        (0, fs_1.writeFileSync)((0, path_1.normalize)(`${dirPath}/${pagename}.html`), result, "utf-8");
    }
}
cleanUp();
parseSources();
