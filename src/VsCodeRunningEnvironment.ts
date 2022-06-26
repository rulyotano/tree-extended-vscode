import type { IRunningEnvironment } from "tree-extended";
import { join } from 'path';
import { existsSync, readdirSync, lstatSync, readFileSync } from 'fs';
import { EOL } from 'os';

export default class NodeRunningEnvironment implements IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string {
    return join(leftPath, rightPath);
  }
  pathExist(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(existsSync(path)));
  }
  getCurrentPath(): Promise<string> {
    return new Promise(resolve => resolve(process.execPath));
  }
  getDirectoryContent(directoryPath: string): Promise<string[]> {
    return new Promise(resolve => resolve(readdirSync(directoryPath)));
  }
  isDirectory(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(lstatSync(path).isDirectory()));
  }
  isFile(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(lstatSync(path).isFile()));
  }
  readTextFile(path: string): Promise<string> {
    return new Promise(resolve => resolve(readFileSync(path, 'utf-8')));
  }
  getEndOfLine(): string {
    return EOL;
  }
}

// import * as vscode from 'vscode';



// export default class VsCodeRunningEnvironment implements IRunningEnvironment {
//   pathJoins(leftPath: string, rightPath: string): string {
//     return vscode.Uri.joinPath(vscode.Uri.parse(leftPath), rightPath).path;
//   }
//   async pathExist(path: string) {
//     try {
//       await vscode.workspace.fs.stat(vscode.Uri.parse(path));
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
//   getCurrentPath() {
//       if(vscode.workspace.workspaceFolders !== undefined) {
//         const fileSystemPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
//         return Promise.resolve(fileSystemPath);
//     } 
//     else {
//         const message = "YOUR-EXTENSION: Working folder not found, open a folder an try again";
//         vscode.window.showErrorMessage(message);
//         return Promise.resolve("");
//     }
//   }
//   getDirectoryContent(directoryPath: string): string[] {
//     throw new Error("Method not implemented.");
//   }
//   isDirectory(path: string): boolean {
//     throw new Error("Method not implemented.");
//   }
//   isFile(path: string): boolean {
//     throw new Error("Method not implemented.");
//   }
//   readTextFile(path: string): string {
//     throw new Error("Method not implemented.");
//   }
//   getEndOfLine(): string {
//     throw new Error("Method not implemented.");
//   }
// }