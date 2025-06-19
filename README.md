## Prerequisites

- Node.js (version 16 or higher) - was built on 21.6.0
- npm package manager (yarn or yum may work, did not test)
- Not tested on Linux/Mac, will work on Windows machines.

## Getting started

This was built off Electron React Boilerplate - https://github.com/electron-react-boilerplate/electron-react-boilerplate

1. Clone the application
   `git clone https://github.com/richie47/GK-DEMO.git`

  Change directory
   `cd GK-DEMO`

2. Install dependencies
   `npm install`

3. Start the application
   `npm start`

## Usage

## Basic Usage (Public Repositories)

1. Enter a repository in the format owner/repo (e.g., facebook/react)
2. Click "Load Issues" to fetch and display open issues
3. Use "Load More Issues" to paginate through additional results
4. Click "Back to Search" to search for a different repository

## Private Repositories

Generate a Personal Access Token from GitHub:

Go to GitHub Settings → Developer settings → Personal access tokens
Generate a new (classic) token with repo scope

Enter the token in the "Personal Access Token" field
Enter your private repository and load issues

## License

This project is licensed under the MIT License - see the LICENSE file for details.
