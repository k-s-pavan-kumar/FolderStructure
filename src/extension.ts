import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Type definitions
interface FileTypeInfo {
    icon: string;
    category: string;
    description: string;
}

interface ImportantFileInfo {
    icon: string;
    importance: 'critical' | 'high' | 'medium';
    description: string;
}

interface FolderTypeInfo {
    icon: string;
    description: string;
}

// File type configurations with icons and categories
const FILE_TYPES: Record<string, FileTypeInfo> = {
    // Web Development
    'html': { icon: '🌐', category: 'Web', description: 'HTML files' },
    'css': { icon: '🎨', category: 'Styles', description: 'Stylesheets' },
    'scss': { icon: '🎨', category: 'Styles', description: 'Sass stylesheets' },
    'less': { icon: '🎨', category: 'Styles', description: 'Less stylesheets' },
    
    // JavaScript/TypeScript
    'js': { icon: '📜', category: 'JavaScript', description: 'JavaScript files' },
    'jsx': { icon: '⚛️', category: 'React', description: 'React JSX files' },
    'ts': { icon: '🔷', category: 'TypeScript', description: 'TypeScript files' },
    'tsx': { icon: '⚛️', category: 'React', description: 'React TypeScript files' },
    'vue': { icon: '💚', category: 'Vue', description: 'Vue.js files' },
    
    // Configuration
    'json': { icon: '⚙️', category: 'Config', description: 'JSON files' },
    'yaml': { icon: '⚙️', category: 'Config', description: 'YAML files' },
    'yml': { icon: '⚙️', category: 'Config', description: 'YAML files' },
    'toml': { icon: '⚙️', category: 'Config', description: 'TOML files' },
    'xml': { icon: '⚙️', category: 'Config', description: 'XML files' },
    
    // Documentation
    'md': { icon: '📖', category: 'Docs', description: 'Markdown files' },
    'txt': { icon: '📄', category: 'Docs', description: 'Text files' },
    'pdf': { icon: '📕', category: 'Docs', description: 'PDF files' },
    
    // Images
    'png': { icon: '🖼️', category: 'Assets', description: 'PNG images' },
    'jpg': { icon: '🖼️', category: 'Assets', description: 'JPEG images' },
    'jpeg': { icon: '🖼️', category: 'Assets', description: 'JPEG images' },
    'gif': { icon: '🖼️', category: 'Assets', description: 'GIF images' },
    'svg': { icon: '🎨', category: 'Assets', description: 'SVG images' },
    'webp': { icon: '🖼️', category: 'Assets', description: 'WebP images' },
    'ico': { icon: '🖼️', category: 'Assets', description: 'Icon files' },
    
    // Other assets
    'woff': { icon: '🔤', category: 'Assets', description: 'Web fonts' },
    'woff2': { icon: '🔤', category: 'Assets', description: 'Web fonts' },
    'ttf': { icon: '🔤', category: 'Assets', description: 'TrueType fonts' },
    'otf': { icon: '🔤', category: 'Assets', description: 'OpenType fonts' },
    
    // Build/Deploy
    'dockerfile': { icon: '🐳', category: 'DevOps', description: 'Docker files' },
    'dockerignore': { icon: '🐳', category: 'DevOps', description: 'Docker ignore' },
    'gitignore': { icon: '🚫', category: 'DevOps', description: 'Git ignore' },
    'env': { icon: '🔐', category: 'Config', description: 'Environment files' },
    
    // Default
    'default': { icon: '📄', category: 'Other', description: 'Other files' }
};

// Important files that should be highlighted
const IMPORTANT_FILES: Record<string, ImportantFileInfo> = {
    'package.json': { icon: '📦', importance: 'critical', description: 'Package configuration' },
    'package-lock.json': { icon: '🔒', importance: 'high', description: 'Dependency lock' },
    'tsconfig.json': { icon: '🔷', importance: 'high', description: 'TypeScript config' },
    'next.config.js': { icon: '▲', importance: 'high', description: 'Next.js config' },
    'next.config.ts': { icon: '▲', importance: 'high', description: 'Next.js config' },
    'tailwind.config.js': { icon: '🎨', importance: 'high', description: 'Tailwind config' },
    'eslint.config.mjs': { icon: '🔍', importance: 'medium', description: 'ESLint config' },
    'README.md': { icon: '📖', importance: 'critical', description: 'Project documentation' },
    'CHANGELOG.md': { icon: '📝', importance: 'medium', description: 'Change log' },
    'Dockerfile': { icon: '🐳', importance: 'high', description: 'Docker container' },
    'docker-compose.yml': { icon: '🐳', importance: 'high', description: 'Docker compose' },
    '.gitignore': { icon: '🚫', importance: 'high', description: 'Git ignore rules' },
    '.env': { icon: '🔐', importance: 'critical', description: 'Environment variables' },
    '.env.local': { icon: '🔐', importance: 'critical', description: 'Local environment' },
    'vercel.json': { icon: '▲', importance: 'medium', description: 'Vercel config' },
    'netlify.toml': { icon: '🌍', importance: 'medium', description: 'Netlify config' }
};

// Folder types with icons
const FOLDER_TYPES: Record<string, FolderTypeInfo> = {
    'src': { icon: '📁', description: 'Source code' },
    'app': { icon: '🚀', description: 'Application' },
    'pages': { icon: '📄', description: 'Pages' },
    'components': { icon: '🧩', description: 'UI Components' },
    'hooks': { icon: '🎣', description: 'React Hooks' },
    'lib': { icon: '📚', description: 'Libraries' },
    'utils': { icon: '🔧', description: 'Utilities' },
    'api': { icon: '🔌', description: 'API Routes' },
    'public': { icon: '🌐', description: 'Public assets' },
    'assets': { icon: '📦', description: 'Assets' },
    'images': { icon: '🖼️', description: 'Images' },
    'styles': { icon: '🎨', description: 'Stylesheets' },
    'css': { icon: '🎨', description: 'CSS files' },
    'ui': { icon: '🎨', description: 'UI Components' },
    'tests': { icon: '🧪', description: 'Test files' },
    '__tests__': { icon: '🧪', description: 'Test files' },
    'docs': { icon: '📖', description: 'Documentation' },
    'config': { icon: '⚙️', description: 'Configuration' },
    'default': { icon: '📂', description: 'Folder' }
};

// Folders and files to exclude
const EXCLUDED_ITEMS = [
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
    '.env.production',
    // System files (macOS, Windows, Linux)
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',
    '.directory',
    // Generated folder structure file
    'folder_structure.md'
];

export function activate(context: vscode.ExtensionContext) {
    console.log('Folder Structure extension is now active!');

    // FIXED: Match the command name in package.json
    let disposable = vscode.commands.registerCommand('folderStructure.saveFolderStructure', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder is open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const outputPath = path.join(rootPath, 'folder_structure.md');

        try {
            // Check if file already exists
            const fileExists = fs.existsSync(outputPath);
            
            // Generate comprehensive folder analysis
            const analysis = generateProjectAnalysis(rootPath);
            const folderStructure = generateFolderStructure(rootPath, 0, '', analysis);
            
            // Create enhanced markdown content
            const markdownContent = createEnhancedMarkdown(analysis, folderStructure, path.basename(rootPath));
            
            let shouldProceed = true;
            
            // Ask for confirmation if file exists
            if (fileExists) {
                const result = await vscode.window.showWarningMessage(
                    'folder_structure.md already exists. Do you want to overwrite it?',
                    'Yes, Overwrite',
                    'Cancel'
                );
                shouldProceed = result === 'Yes, Overwrite';
            }
            
            if (shouldProceed) {
                fs.writeFileSync(outputPath, markdownContent);
                
                const actionMessage = fileExists ? 'Folder structure updated successfully!' : 'Folder structure saved successfully!';
                
                // Show success message with options
                const result = await vscode.window.showInformationMessage(
                    actionMessage,
                    'Open File',
                    'Copy to Clipboard'
                );

                if (result === 'Open File') {
                    const doc = await vscode.workspace.openTextDocument(outputPath);
                    await vscode.window.showTextDocument(doc);
                } else if (result === 'Copy to Clipboard') {
                    await vscode.env.clipboard.writeText(folderStructure);
                    vscode.window.showInformationMessage('Folder structure copied to clipboard!');
                }
            } else {
                vscode.window.showInformationMessage('Operation cancelled.');
            }

        } catch (error) {
            vscode.window.showErrorMessage(`Error saving folder structure: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

// Helper functions for file analysis
function getFileExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase().substring(1);
    if (!ext) {
        // Handle special files without extensions
        const lowerName = filename.toLowerCase();
        if (lowerName === 'dockerfile') return 'dockerfile';
        if (lowerName === '.dockerignore') return 'dockerignore';
        if (lowerName === '.gitignore') return 'gitignore';
        if (lowerName.startsWith('.env')) return 'env';
    }
    return ext;
}

function getFileInfo(filename: string): {
    extension: string;
    type: FileTypeInfo;
    importance: ImportantFileInfo | undefined;
    isImportant: boolean;
} {
    const ext = getFileExtension(filename);
    const fileType = FILE_TYPES[ext] || FILE_TYPES['default'];
    const importance = IMPORTANT_FILES[filename];
    
    return {
        extension: ext,
        type: fileType,
        importance: importance,
        isImportant: !!importance
    };
}

function getFolderInfo(foldername: string): FolderTypeInfo {
    const folderType = FOLDER_TYPES[foldername.toLowerCase()] || FOLDER_TYPES['default'];
    return folderType;
}

// Project analysis function
interface ProjectAnalysis {
    totalFiles: number;
    totalFolders: number;
    maxDepth: number;
    filesByType: Map<string, number>;
    filesByCategory: Map<string, number>;
    importantFiles: string[];
    techStack: string[];
    largestDirectories: { name: string; count: number }[];
}

function generateProjectAnalysis(rootPath: string): ProjectAnalysis {
    const analysis: ProjectAnalysis = {
        totalFiles: 0,
        totalFolders: 0,
        maxDepth: 0,
        filesByType: new Map(),
        filesByCategory: new Map(),
        importantFiles: [],
        techStack: [],
        largestDirectories: []
    };

    const directoryFileCounts: Map<string, number> = new Map();

    function analyzeDirectory(dirPath: string, depth: number = 0) {
        if (depth > analysis.maxDepth) {
            analysis.maxDepth = depth;
        }

        try {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });
            const filteredItems = items.filter(item => !shouldExcludeItem(item.name));
            
            let filesInThisDir = 0;
            
            filteredItems.forEach(item => {
                if (item.isDirectory()) {
                    analysis.totalFolders++;
                    const subdirPath = path.join(dirPath, item.name);
                    const subDirCount = analyzeDirectory(subdirPath, depth + 1);
                    filesInThisDir += subDirCount;
                } else {
                    analysis.totalFiles++;
                    filesInThisDir++;
                    
                    const fileInfo = getFileInfo(item.name);
                    
                    // Count by file extension
                    const count = analysis.filesByType.get(fileInfo.extension) || 0;
                    analysis.filesByType.set(fileInfo.extension, count + 1);
                    
                    // Count by category
                    const categoryCount = analysis.filesByCategory.get(fileInfo.type.category) || 0;
                    analysis.filesByCategory.set(fileInfo.type.category, categoryCount + 1);
                    
                    // Track important files
                    if (fileInfo.isImportant) {
                        analysis.importantFiles.push(item.name);
                    }
                }
            });
            
            // Track directory file counts
            directoryFileCounts.set(path.relative(rootPath, dirPath) || 'root', filesInThisDir);
            
            return filesInThisDir;
        } catch (error) {
            return 0;
        }
    }

    analyzeDirectory(rootPath);
    
    // Determine tech stack
    analysis.techStack = detectTechStack(analysis.filesByType, analysis.importantFiles);
    
    // Get largest directories
    analysis.largestDirectories = Array.from(directoryFileCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name: name || 'root', count }));

    return analysis;
}

function detectTechStack(filesByType: Map<string, number>, importantFiles: string[]): string[] {
    const stack: string[] = [];
    
    // React/Next.js detection
    if (filesByType.has('tsx') || filesByType.has('jsx')) {
        stack.push('React');
    }
    
    if (importantFiles.some(f => f.includes('next.config'))) {
        stack.push('Next.js');
    }
    
    // TypeScript detection
    if (filesByType.has('ts') || filesByType.has('tsx')) {
        stack.push('TypeScript');
    }
    
    // Vue detection
    if (filesByType.has('vue')) {
        stack.push('Vue.js');
    }
    
    // Styling
    if (filesByType.has('css')) stack.push('CSS');
    if (filesByType.has('scss')) stack.push('Sass/SCSS');
    if (importantFiles.some(f => f.includes('tailwind.config'))) {
        stack.push('Tailwind CSS');
    }
    
    // Build tools
    if (importantFiles.includes('package.json')) stack.push('Node.js');
    if (importantFiles.includes('Dockerfile')) stack.push('Docker');
    
    return stack;
}

function createEnhancedMarkdown(analysis: ProjectAnalysis, structure: string, projectName: string): string {
    const date = new Date().toLocaleString();
    
    let markdown = `# 📁 ${projectName} - Project Structure\n\n`;
    markdown += `*Generated on: ${date}*\n\n`;
    
    // Quick Overview Section
    markdown += `## 📋 Quick Overview\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| 📄 Total Files | ${analysis.totalFiles} |\n`;
    markdown += `| 📁 Total Folders | ${analysis.totalFolders} |\n`;
    markdown += `| 🌳 Max Depth | ${analysis.maxDepth} levels |\n`;
    
    if (analysis.techStack.length > 0) {
        markdown += `| 🛠️ Tech Stack | ${analysis.techStack.join(', ')} |\n`;
    }
    markdown += `\n`;
    
    // Important Files Section
    if (analysis.importantFiles.length > 0) {
        markdown += `## ⭐ Important Files\n\n`;
        analysis.importantFiles.forEach(file => {
            const info = IMPORTANT_FILES[file];
            if (info) {
                const priority = info.importance === 'critical' ? '🔴' : info.importance === 'high' ? '🟡' : '🔵';
                markdown += `- ${priority} ${info.icon} **${file}** - ${info.description}\n`;
            }
        });
        markdown += `\n`;
    }
    
    // File Statistics Section
    markdown += `## 📊 File Statistics\n\n`;
    
    // By file type
    if (analysis.filesByType.size > 0) {
        markdown += `### By File Type\n\n`;
        const sortedTypes = Array.from(analysis.filesByType.entries())
            .sort((a, b) => b[1] - a[1]);
        
        sortedTypes.forEach(([ext, count]) => {
            const fileType = FILE_TYPES[ext] || FILE_TYPES['default'];
            const percentage = ((count / analysis.totalFiles) * 100).toFixed(1);
            markdown += `- ${fileType.icon} **.${ext}** (${fileType.description}): ${count} files (${percentage}%)\n`;
        });
        markdown += `\n`;
    }
    
    // By category
    if (analysis.filesByCategory.size > 0) {
        markdown += `### By Category\n\n`;
        const sortedCategories = Array.from(analysis.filesByCategory.entries())
            .sort((a, b) => b[1] - a[1]);
        
        sortedCategories.forEach(([category, count]) => {
            const percentage = ((count / analysis.totalFiles) * 100).toFixed(1);
            markdown += `- **${category}**: ${count} files (${percentage}%)\n`;
        });
        markdown += `\n`;
    }
    
    // Largest directories
    if (analysis.largestDirectories.length > 0) {
        markdown += `### 📁 Largest Directories\n\n`;
        analysis.largestDirectories.forEach(({ name, count }) => {
            markdown += `- **${name}**: ${count} files\n`;
        });
        markdown += `\n`;
    }
    
    // File Structure Section
    markdown += `## 🌳 Directory Structure\n\n`;
    markdown += `\`\`\`\n${structure}\`\`\`\n\n`;
    
    // Legend
    markdown += `## 📖 Legend\n\n`;
    markdown += `### File Types\n`;
    const uniqueTypes = new Set(Array.from(analysis.filesByType.keys()).map(ext => FILE_TYPES[ext] || FILE_TYPES['default']));
    uniqueTypes.forEach(type => {
        markdown += `- ${type.icon} ${type.category}: ${type.description}\n`;
    });
    markdown += `\n`;
    
    markdown += `### Importance Levels\n`;
    markdown += `- 🔴 Critical: Essential project files\n`;
    markdown += `- 🟡 High: Important configuration files\n`;
    markdown += `- 🔵 Medium: Helpful but not essential files\n`;
    
    return markdown;
}

function shouldExcludeItem(itemName: string): boolean {
    return EXCLUDED_ITEMS.includes(itemName);
}

function generateFolderStructure(
    rootPath: string,
    indentLevel: number = 0,
    parentFolder: string = '',
    analysis?: ProjectAnalysis
): string {
    let structure = indentLevel === 0 ? `${path.basename(rootPath)}/\n` : '';

    try {
        const files = fs.readdirSync(rootPath);
        
        // Filter out excluded items (both files and folders), then sort
        const filteredFiles = files.filter(file => !shouldExcludeItem(file));
        const sortedFiles = filteredFiles.sort((a, b) => a.localeCompare(b));

        sortedFiles.forEach((file, index) => {
            const fullPath = path.join(rootPath, file);
            
            try {
                const stats = fs.statSync(fullPath);
                const indent = '│   '.repeat(indentLevel);
                
                // Calculate isLastItem correctly
                const isLastItem = index === sortedFiles.length - 1;
                const connector = isLastItem ? '└── ' : '├── ';

                if (stats.isDirectory()) {
                    const folderInfo = getFolderInfo(file);
                    structure += `${indent}${connector}${folderInfo.icon} ${file}/\n`;
                    
                    // Recursively process subdirectory
                    const subStructure = generateFolderStructure(fullPath, indentLevel + 1, file, analysis);
                    if (subStructure && indentLevel >= 0) {
                        structure += subStructure;
                    }
                } else {
                    const fileInfo = getFileInfo(file);
                    let fileName = file;
                    
                    // Highlight important files
                    if (fileInfo.isImportant && fileInfo.importance) {
                        const importance = fileInfo.importance;
                        const priority = importance.importance === 'critical' ? '🔴' : 
                                       importance.importance === 'high' ? '🟡' : '🔵';
                        fileName = `${priority} ${importance.icon} **${file}**`;
                    } else {
                        fileName = `${fileInfo.type.icon} ${file}`;
                    }
                    
                    structure += `${indent}${connector}${fileName}\n`;
                }
            } catch (fileError) {
                // Silently skip files/folders we can't access
                console.warn(`Could not process ${file}: ${fileError}`);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${rootPath}:`, error);
        structure += `${indentLevel === 0 ? '' : '│   '.repeat(indentLevel)}└── [Error reading directory]\n`;
    }

    return structure;
}

export function deactivate() {
    console.log('Folder Structure extension deactivated');
}