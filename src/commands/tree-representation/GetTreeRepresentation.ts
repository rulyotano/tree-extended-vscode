import type ICommand from '../ICommand';
import * as vscode from 'vscode';
import TreeExtended from 'tree-extended';
import VsRunningEnvironment from './VsCodeRunningEnvironment';
import TreeConfigurationProvider from './configuration/TreeConfigurationProvider';
import { getTreeFileNameFromUri } from '../../helpers';

export default class GetTreeRepresentation implements ICommand {
  name = 'tree-extended.getTreeRepresentation';
  alreadyGeneratingTree = false;
  action: (...args: any[]) => any = async (uri: vscode.Uri) => {
    if (this.alreadyGeneratingTree) {
      vscode.window.showInformationMessage('Already generating directory tree. Please wait.');
      return;
    }

    this.alreadyGeneratingTree = true;

    const configProvider = new TreeConfigurationProvider();
    const configuration = await configProvider.getConfiguration();

    if (!configuration) {
      this.alreadyGeneratingTree = false;
      return;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: `Generating directory tree from "${uri.path}"`,
      },

      async inputProgress => {
        const progress = new CustomProgress(inputProgress);

        progress.initialize();
        const treeExtended = new TreeExtended(new VsRunningEnvironment());

        const directoryTree = await treeExtended.getDirectoryTree(uri.fsPath, configuration);

        await this.writeDirectoryTreeToNewFileTab(uri, directoryTree);

        this.alreadyGeneratingTree = false;
        progress.finalize();
      }
    );
  };

  private async writeDirectoryTreeToNewFileTab(uri: vscode.Uri, directoryTree: string) {
    const fileName = vscode.Uri.joinPath(uri, getTreeFileNameFromUri(uri));
    const uriUntitled = vscode.Uri.file(fileName.path).with({ scheme: 'untitled' });
    const doc = await vscode.workspace.openTextDocument(uriUntitled);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uriUntitled, new vscode.Position(0, 0), directoryTree);
    await vscode.workspace.applyEdit(edit);
    await vscode.window.showTextDocument(doc, { preview: false });
  }
}

class CustomProgress {
  progress: vscode.Progress<{ increment: number }>;
  constructor(progress: vscode.Progress<{ increment: number }>) {
    this.progress = progress;
  }

  initialize() {
    this.progress.report({ increment: 0 });
    setTimeout(() => {
      this.progress.report({ increment: 10 });
    }, 1000);
    setTimeout(() => {
      this.progress.report({ increment: 40 });
    }, 2000);
    setTimeout(() => {
      this.progress.report({ increment: 90 });
    }, 3000);
  }

  finalize() {
    this.progress.report({ increment: 100 });
  }
}
