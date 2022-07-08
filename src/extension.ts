// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GetTreeRepresentation, HelloWorld } from './commands';
import ICommand from './commands/ICommand';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commands: ICommand[] = [new HelloWorld(), new GetTreeRepresentation()];
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "tree-extended-vscode" is now active!');

  commands.forEach(command => {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(command.name, command.action);
    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
