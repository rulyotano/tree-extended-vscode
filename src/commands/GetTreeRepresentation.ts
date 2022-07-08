import type ICommand from './ICommand';
import * as vscode from 'vscode';
import TreeExtended from 'tree-extended';
import VsRunningEnvironment from '../VsCodeRunningEnvironment';
import TreeConfigurationProvider from '../TreeConfigurationProvider';
import { getTreeFileNameFromUri } from '../helpers';

export default class GetTreeRepresentation implements ICommand {
  name = 'tree-extended-vscode.getTreeRepresentation';
  action: (...args: any[]) => any = async (uri: vscode.Uri) => {
    vscode.window.showInformationMessage(`Get tree located at ${uri.path}`);

    const fileName = vscode.Uri.joinPath(uri, getTreeFileNameFromUri(uri));
    const uriUntitled = vscode.Uri.file(fileName.path).with({ scheme: 'untitled' });
    const doc = await vscode.workspace.openTextDocument(uriUntitled);

    const edit = new vscode.WorkspaceEdit();

    const treeExtended = new TreeExtended(new VsRunningEnvironment());
    const configProvider = new TreeConfigurationProvider();
    const configuration = configProvider.getConfiguration();
    const directoryTree = await treeExtended.getDirectoryTree(uri.fsPath, configuration);
    edit.insert(uriUntitled, new vscode.Position(0, 0), directoryTree);
    await vscode.workspace.applyEdit(edit);

    await vscode.window.showTextDocument(doc, { preview: false });
  };
}
