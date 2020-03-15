import matter from 'gray-matter';
import marked from 'marked';
import { normalize, parse } from 'path';
import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, rmdirSync, mkdirSync } from 'fs';

let config = {
  index: "index.md",
  titlePrefix: "Untitled",
  defaultMetaDescription: "No description",
  nav: [] as { title: string; link?: string }[]
}

const reservedDirs = ['assets', 'engine', 'extras', 'uploads', 'source'];
const rootPath = normalize(`${__dirname}/..`);
const sourceDirPath = normalize(`${rootPath}/source`);
const assetsDirPath = normalize(`${rootPath}/assets`);

// Read the template upfront - we only have a single template for now
let TEMPLATE: string = "";
try {
  TEMPLATE = readFileSync(normalize(`${assetsDirPath}/template.html`), 'utf-8');
} catch {
  console.log("Invalid assets/template.html file.");
  process.exit(1);
}

// Recursively clean up old html pages before generating new ones
// Important so that we remove htmls when we remove source .md files.
function cleanUp(dirPath: string = rootPath) {
  readdirSync(dirPath).forEach(fname => {
    const filePath = `${dirPath}/${fname}`;
    const stats = statSync(normalize(filePath));
    if (
      stats.isDirectory() &&
      !fname.startsWith('.') &&
      !reservedDirs.find(name => name === fname)
    ) {
      cleanUp(filePath);
    } else if (stats.isFile() && (fname.endsWith('html') || fname === '_config.json')) {
      unlinkSync(filePath);
    }
  });
  if (dirPath !== rootPath) {
    rmdirSync(dirPath);
  }
}

// Recursively parse the source dir and create htmls in the root dir
// at the equivalent location
function parseSources(dirPath: string = sourceDirPath) {
  let sources: string[] = [];
  const targetDirPath = `${rootPath}/${dirPath.substr(sourceDirPath.length)}`;

  if (dirPath !== sourceDirPath) {
    mkdirSync(targetDirPath);
  }

  try {
    sources = readdirSync(dirPath);
  } catch {
    console.log(`Invalid source directory ${dirPath}`);
    process.exit(1);
  }

  if (!sources.find((fname) => fname === "_config.json")) {
    console.log(`Source directory ${dirPath} does not contain a _config.json file`);
    process.exit(1);
  }

  sources = sources.filter((s) => s !== "_config.json");

  try {
    const configStr = readFileSync(normalize(`${dirPath}/_config.json`), 'utf-8');
    config = Object.assign({}, config, JSON.parse(configStr));
  } catch {
    console.log("Invalid source/_config.json file.");
    process.exit(1);
  }

  const navHTML = config.nav.map((obj) =>
    obj.link ? `<a href="${obj.link}">${obj.title}</a>` : `<span>${obj.title}</span>`
  ).join('\n');

  sources.forEach((name) => {
    console.log(dirPath, name);
    if (statSync(normalize(`${dirPath}/${name}`)).isDirectory()) {
      parseSources(`${dirPath}/${name}`);
    } else {
      createPage(`${dirPath}/${name}`, navHTML, targetDirPath);
    }
  });
}

// Creates a html page from a source markdown file.
// Places it in a the same directory relative to the site root.
function createPage(path: string, navHTML: string, dirPath: string = rootPath) {
  const isMarkdown = path.endsWith(".md");
  const isHTML = path.endsWith(".html");
  const { content, data } = matter.read(path);

  if (isMarkdown) {
    const pagename = parse(path).name;
    const html = marked(content);
    const result = TEMPLATE.replace(/\{\{(.+)\}\}/g, (_match, varName) => {
      switch(varName) {
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
          return marked(content);
        default:
          console.warn(`Missing content for template var ${varName} in ${path}`);
          return `{{ -?- ${varName} -?- }}`;
      }
    });
    writeFileSync(normalize(`${dirPath}/${pagename}.html`), result, 'utf-8');
  }
}

cleanUp();
parseSources();
