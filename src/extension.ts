// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import TreeExtended, { Configuration } from "tree-extended";
import VsRunningEnvironment from "./VsCodeRunningEnvironment";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tree-extended-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tree-extended-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from tree-extended-vscode!');
	});

  let getTreeRepresentationDisposable = vscode.commands.registerCommand('tree-extended-vscode.getTreeRepresentation', async (uri: vscode.Uri) => {
    
		vscode.window.showInformationMessage(`Get tree located at ${uri.path}`);

    const fileName = vscode.Uri.joinPath(uri, `__directory-tree.txt`);
    const uriUntitled = vscode.Uri.file(fileName.path).with({ scheme: "untitled" });
    const doc = await vscode.workspace.openTextDocument(uriUntitled);

    const edit = new vscode.WorkspaceEdit();

    const treeExtended = new TreeExtended(new VsRunningEnvironment());
    const configuration = new Configuration('utf8-icons');
    const directoryTree = await treeExtended.getDirectoryTree(uri.fsPath, configuration);
    edit.insert(uriUntitled, new vscode.Position(0, 0), directoryTree);
    await vscode.workspace.applyEdit(edit);

    await vscode.window.showTextDocument(doc, { preview: false });
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(getTreeRepresentationDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
