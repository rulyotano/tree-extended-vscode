import { Configuration } from 'tree-extended';
import { extensionName, configuration } from "./consts";
import * as vscode from 'vscode';

export default class TreeConfigurationProvider {
  configuration: Configuration;
  constructor() {
    const config = vscode.workspace.getConfiguration(extensionName);
    
    this.configuration = new Configuration(
      config.get<string>(configuration.default.charset),
      config.get<number>(configuration.default.maxLevel),
      config.get<boolean>(configuration.default.showNotEmptyDirectoryIndicator),
      config.get<boolean>(configuration.default.gitignore),
      config.get<string>(configuration.default.ignore),
      config.get<string>(configuration.default.only)
    );
  }

  getConfiguration() {
    return this.configuration;
  }
}
