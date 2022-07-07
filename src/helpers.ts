import * as vscode from 'vscode';
import * as path from 'path';

export function getTreeFileNameFromUri(directoryUri: vscode.Uri): string {
  const directoryName =  path.basename(directoryUri.fsPath);
  const currentDate = new Date();
  return `${directoryName}-${currentDate.getTime()}.tree`;
}