const child_process = require("child_process");
const path = require("path");
const fs = require("fs");

let version = child_process
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString().trim();

version += "/" + child_process
    .execSync("git rev-parse HEAD")
    .toString().trim().substring(0, 7);

if (
    child_process
        .execSync("git status --porcelain")
        .toString().trim()
)
    version += "/dirty";


console.log(`Building version [${version}]…\n`);

child_process.spawnSync(
    "ng", [ "build", ...process.argv.slice(2) ],
    { stdio: "inherit", shell: true }
);

console.log("Adding ngAppVersion to HTML…\n");

const htmlPath = path.join(__dirname, "dist", "index.html");
const content = fs.readFileSync(htmlPath, "utf8");

fs.writeFileSync(
    htmlPath, content.replace(
        /(<\/title>)/gi,
        `$1\n\t<meta name="ngAppVersion" value="${version}" />`
    )
);

console.log("Angular build complete!\n\n");
