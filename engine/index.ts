import { readdirSync, readFileSync, fstat, writeFileSync, stat, statSync, unlinkSync } from 'fs';
import { normalize } from 'path';
import matter from 'gray-matter';
import marked from 'marked';

let config = {
  index: "index.md",
  titlePrefix: "Untitled",
  defaultMetaDescription: "No description",
  nav: [] as { title: string; link?: string }[]
}

const rootPath = normalize(`${__dirname}/..`);
const sourceDirPath = normalize(`${rootPath}/source`);
const assetsDirPath = normalize(`${rootPath}/assets`);

let sources: string[] = [];
try {
  sources = readdirSync(sourceDirPath);
} catch {
  console.log(`Invalid source directory ${sourceDirPath}`);
  process.exit(1);
}

if (!sources.find((fname) => fname === "_config.json")) {
  console.log(`Source directory ${sourceDirPath} does not contain a _config.json file`);
  process.exit(1);
}

sources = sources.filter((s) => s !== "_config.json");

try {
  const configStr = readFileSync(normalize(`${sourceDirPath}/_config.json`), 'utf-8');
  config = Object.assign(config, JSON.parse(configStr));
} catch {
  console.log("Invalid source/_config.json file.");
  process.exit(1);
}

let assets: string[] = [];
try {
  assets = readdirSync(assetsDirPath);
} catch {
  console.log(`Invalid assets directory ${assetsDirPath}`);
  process.exit(1);
}

let template: string = "";
try {
  template = readFileSync(normalize(`${assetsDirPath}/template.html`), 'utf-8');
} catch {
  console.log("Invalid assets/template.html file.");
  process.exit(1);
}

const navHTML = config.nav.map((obj) => {
  if (!obj.link) {
    return `<span>${obj.title}</span>`;
  } else if (obj.link.match(/^(http(s)?:\/\/)/)) {
    return `<a href="${obj.link}">${obj.title}</a>`;
  } else {
    if (sources.findIndex((s) => s === obj.link) === -1) {
      console.warn(
        `Broken link: "${obj.title}" links to "${obj.link}" which is not in the source dir`);
    }
    const ext = obj.link.substring(obj.link.lastIndexOf('.'));
    const fname = obj.link.substring(0, obj.link.length - ext.length);
    return `<a href="/${fname}.html">${obj.title}</a>`;
  }
}).join('\n');


// Clean up old html pages before generating new ones
// Important so that we remove htmls when we remove source .md files.
readdirSync(rootPath).filter(fname => fname.endsWith('.html')).forEach(fname => {
  const pth = normalize(`${rootPath}/${fname}`);
  try {
    const stats = statSync(pth);
    if (stats.isFile()) {
      unlinkSync(pth);
    }
  } catch {
    console.log(`Can't stat or unlink ${pth}`);
  }
});

sources.forEach(createPage);

/**
 * Creates a page from a source.
 * @param source String the source filename.
 */
function createPage(fname: string) {
  const isMarkdown = fname.endsWith(".md");
  const isHTML = fname.endsWith(".html");
  const { content, data } = matter.read(normalize(`${sourceDirPath}/${fname}`));

  if (isMarkdown) {
    const pagename = fname.replace(/\.md$/, "");
    const html = marked(content);
    const result = template.replace(/\{\{(.+)\}\}/g, (_match, varName) => {
      switch(varName) {
        case "meta-title":
          return data.title ? `${config.titlePrefix} - ${data.title}` : config.titlePrefix;
        case "meta-description":
          return data.description || config.defaultMetaDescription;
        case "navigation":
          return navHTML;
        case "date":
            if (!(data.date instanceof Date)) {
              console.warn(`Missing front matter date in ${fname}`);
              return data.date || "Unknown";
            }
            return `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`;
        case "content":
          return marked(content);
        default:
          console.warn(`Missing content for template var ${varName} in ${fname}`);
          return `{{ -?- ${varName} -?- }}`;
      }
    });
    writeFileSync(normalize(`${rootPath}/${pagename}.html`), result, 'utf-8');
  }
}
