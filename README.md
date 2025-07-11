# Folder Structure Tracker

## Overview

Folder Structure Tracker is a Visual Studio Code extension that helps you quickly generate a clean, readable Markdown representation of your project's folder structure.

## Features

- Automatically generates a project structure overview
- Excludes common build, dependency, and system folders
- Supports multiple programming languages and project types
- Saves the structure as `project_structure.md` in your project root

## How to Use

1. Open your project in Visual Studio Code
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type "Save Folder Structure"
4. Select the command to generate the project structure

![Screenshot](https://raw.githubusercontent.com/Evening-Elephant/folderstructure/refs/heads/main/images/folderstructure.gif)

## Excluded Folders

The extension automatically excludes:
- Dependency folders (node_modules, vendor, etc.)
- Build directories (dist, build, out, target)
- Version control folders (.git, .svn)
- IDE-specific folders (.vscode, .idea)
- Temporary and cache folders
- Environment and secret files

## Example Output

```
my-project/
│
├── src/
│   ├── components/
│   └── utils/
├── tests/
├── package.json
└── README.md
```

## Customization

Currently, the extension uses a predefined list of excluded folders. Future versions may include configuration options.

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Folder Structure Tracker"
4. Click Install

## Feedback

Found a bug or have a suggestion? Please file an issue on our GitHub repository.

