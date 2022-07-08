import ICommand from "./ICommand";
import * as vscode from 'vscode';

export default class HelloWorld implements ICommand {
  name: string = 'tree-extended-vscode.helloWorld';
  action: (...args: any[]) => any = () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from tree-extended-vscode!');
  };

}