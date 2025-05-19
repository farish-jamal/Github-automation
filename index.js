const simpleGit = require("simple-git");
const fetch = require("node-fetch");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
require("dotenv").config();

const git = simpleGit();
const { GITHUB_TOKEN, GITHUB_USERNAME, VERCEL_TOKEN } = process.env;

async function run(repoUrl, newRepoName, private) {
  const tempDir = path.join(__dirname, newRepoName);

  // Clone repo
  console.log("Cloning repo...");
  await git.clone(repoUrl, tempDir);

  const repo = simpleGit(tempDir);

  // Remove original origin
  console.log("Removing old origin...");
  await repo.removeRemote("origin");

  // Create new GitHub repo via API
  console.log("Creating new GitHub repo...");
  const res = await fetch(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newRepoName,
      private: private === "y",
    }),
  });

  const data = await res.json();

  if (!data.clone_url) {
    console.error("❌ Failed to create GitHub repo:", data);
    return;
  }

  const newRepoUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${newRepoName}.git`;

  // Add new remote and push
  console.log("Pushing to new GitHub repo...");
  await repo.addRemote("origin", newRepoUrl);
  await repo.push(["-u", "origin", "main"]);

//   fs.rmSync(tempDir, { recursive: true, force: true });

  // Deploy to Vercel
  console.log("Deploying to Vercel...");
  execSync(`vercel --prod --token=${VERCEL_TOKEN}`, {
    cwd: tempDir,
    stdio: "inherit",
  });

  console.log("✅ Done!");
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

(async () => {
  const originalRepo = await ask("Enter the GitHub repo URL to clone: ");
  const newRepoName = await ask("Enter the name for your new GitHub repo: ");
  const private = await ask("Is the new repo private? (y/n): ");
  await run(originalRepo, newRepoName, private);
})();
