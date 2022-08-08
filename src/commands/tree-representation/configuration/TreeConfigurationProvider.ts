import { Configuration } from 'tree-extended';
import { extensionName, configuration } from '../../../constants';
import * as vscode from 'vscode';
import TreeConfigurationFromUser from './TreeConfigurationFromUser';

export default class TreeConfigurationProvider {
  configuration: Configuration;
  configFromUser: TreeConfigurationFromUser;
  constructor() {
    const config = vscode.workspace.getConfiguration(extensionName);

    this.configuration = new Configuration(
      config.get<string>(configuration.charset),
      config.get<number>(configuration.default.maxLevel),
      config.get<boolean>(configuration.showNotEmptyDirectoryIndicator),
      config.get<boolean>(configuration.gitignore),
      config.get<string>(configuration.default.ignore),
      config.get<string>(configuration.default.only)
    );
    this.configFromUser = new TreeConfigurationFromUser(this.configuration);
  }

  async getConfiguration() {
    const userConfig = await this.configFromUser.getConfigFromUser();

    if (this.configFromUser.isCancelled()) {
      return undefined;
    }

    if (!userConfig) {
      return this.configuration;
    }
    return userConfig;
  }
}
