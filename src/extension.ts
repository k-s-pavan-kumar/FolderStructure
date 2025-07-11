import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Folders to exclude
const EXCLUDED_FOLDERS = [
    // Build and dependency folders
    'node_modules', 
    '.next', 
    'dist', 
    'build', 
    'out', 
    'target', 
    'bin', 
    'obj',
    
    // Version control and IDE folders
    '.git', 
    '.svn', 
    '.hg', 
    '.vscode', 
    '.idea', 
    '.eclipse', 
    '.gradle',
    
    // Language-specific build/cache folders
    '__pycache__',
    '.pytest_cache',
    '.mypy_cache',
    '.cache',
    '.eggs',
    '.coverage',
    '.nyc_output',
    '.webpack',
    '.nuxt',
    '.expo',
    '.angular',
    
    // Dependency and package managers
    'bower_components',
    'jspm_packages',
    'vendor',
    
    // Logs and temporary files
    'logs',
    'tmp',
    'temp',
    '.tmp',
    '.log',
    
    // Testing and coverage
    'coverage',
    '.reports',
    
    // Environment and secret files
    '.env',
    '.env.local',
    '.env.development',
    '.env.production'
];

export function activate(context: vscode.ExtensionContext) {
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error saving folder structure: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

function shouldExcludeFolder(folderName: string): boolean {
    return EXCLUDED_FOLDERS.includes(folderName);
}

function generateFolderStructure(
    rootPath: string, 
    indentLevel: number = 0, 
    parentFolder: string = ''
): string {
    let structure = indentLevel === 0 ? `${path.basename(rootPath)}/\n│\n` : '';
    
    try {
        const files = fs.readdirSync(rootPath);

        // Sort files and folders for consistent output
        const sortedFiles = files.sort((a, b) => a.localeCompare(b));

        sortedFiles.forEach((file, index) => {
            // Skip excluded folders
            if (shouldExcludeFolder(file)) return;

            const fullPath = path.join(rootPath, file);
            
            try {
                const stats = fs.statSync(fullPath);
                const indent = '│   '.repeat(indentLevel);
                const isLastItem = index === sortedFiles.filter(f => !shouldExcludeFolder(f)).length - 1;
                const prefix = isLastItem ? '└── ' : '├── ';

                if (stats.isDirectory()) {
                    structure += `${indent}${prefix}${file}/\n`;
                    structure += generateFolderStructure(fullPath, indentLevel + 1, file);
                } else {
                    structure += `${indent}${prefix}${file}\n`;
                }
            } catch (fileError) {
                // Silently skip files/folders we can't access
                console.warn(`Could not process ${file}: ${fileError}`);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${rootPath}:`, error);
    }

    return structure;
}

export function deactivate() {}