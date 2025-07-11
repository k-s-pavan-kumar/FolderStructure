"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('folderStructureTracker.saveFolderStructure', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder is open');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const outputPath = path.join(rootPath, 'folder_structure.md');
        try {
            const folderStructure = generateFolderStructure(rootPath);
            fs.writeFileSync(outputPath, folderStructure);
            vscode.window.showInformationMessage('Folder structure saved successfully!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error saving folder structure: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
function generateFolderStructure(rootPath, indentLevel = 0) {
    let structure = '';
    const files = fs.readdirSync(rootPath);
    files.forEach(file => {
        const fullPath = path.join(rootPath, file);
        const stats = fs.statSync(fullPath);
        const indent = '│   '.repeat(indentLevel);
        if (stats.isDirectory()) {
            structure += `${indent}├── ${file}/\n`;
            structure += generateFolderStructure(fullPath, indentLevel + 1);
        }
        else {
            structure += `${indent}├── ${file}\n`;
        }
    });
    return structure;
}
function deactivate() { }
//# sourceMappingURL=precode.js.map