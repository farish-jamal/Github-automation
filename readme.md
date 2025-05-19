# 🚀 GitHub Repo Cloner & Vercel Deployer

A Node.js tool that automates the process of:

1. Cloning an existing GitHub repository
2. Removing its original remote
3. Creating a new GitHub repo
4. Pushing the code to your new repo
5. Deploying the project to Vercel

---

## 📦 Features

- Fully automated using `simple-git`, `node-fetch`, and `Vercel CLI`
- GitHub API integration for repo creation
- Secure credential handling via `.env`
- CLI-based input for easy usage

---

## 🔧 Prerequisites

- **Node.js** installed
- **Git** installed and globally accessible
- **Vercel CLI** installed globally:  
  ```bash
  npm install -g vercel

## 🛠️ Setup

### Clone this automation tool:

```bash
git clone https://github.com/your-username/github-automation.git
cd github-automation

### Install dependencies:
    npm install

### Configure environment variables:

GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-token
VERCEL_TOKEN=your-vercel-token


### Run the script:
node index.js