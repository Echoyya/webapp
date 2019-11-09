const path = require("path");
const fs = require("fs");
const glob = require("glob");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const pages = {};
let entries;
try {
  entries = glob("src/pages/**/main.js", { sync: true });
} catch (err) {
  entries = [];
  throw err;
}

entries.forEach(file => {
  // eslint-disable-next-line no-console
  const pageName = file.replace("src/pages/", "").replace("/main.js", "");
  let pageHtml = file.replace("main.js", "index.html");
  if (!fs.existsSync(pageHtml)) {
    pageHtml = "public/index.html";
  }
  pages[pageName] = {
    entry: file,
    template: pageHtml,
    filename: `${pageName}.html`
  };
});

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  assetsDir: "assets",
  pages: pages,
  devServer: {
    host:'localhost',
    port: 80
  }
};
