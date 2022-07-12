import * as vscode from 'vscode';
import { Configuration } from 'tree-extended';
export const EMPTY_CONFIG = undefined;

export default class TreeConfigurationFromUser {
  cancelled: boolean;
  defaultConfig: Configuration;

  constructor(defaultConfig: Configuration) {
    this.defaultConfig = defaultConfig;
    this.cancelled = false;
  }

  isCancelled() {
    return this.cancelled;
  }

  async getConfigFromUser() {
    this.cancelled = false;

    if (!(await this.askShouldUseCustomConfiguration())) {
      return EMPTY_CONFIG;
    }

    const deep = await this.requestInputLevel();
    const ignore = await this.requestIgnore();
    const only = await this.requestOnly();

    if (this.cancelled) {
      return EMPTY_CONFIG;
    }

    return new Configuration(
      this.defaultConfig.charset,
      deep,
      this.defaultConfig.showIndicatorWhenDirectoryIsNotEmpty,
      this.defaultConfig.includeGitIgnore,
      ignore,
      only
    );
  }

  private async askShouldUseCustomConfiguration() {
    const description = 'Do you want to use a custom configuration to generate the directory tree?';
    const result = await vscode.window.showQuickPick(['No', 'Yes'], {
      placeHolder: description,
    });

    if (!result) {
      this.cancelled = true;
    }

    return result === 'Yes';
  }

  private async requestInputLevel() {
    if (this.cancelled) {
      return EMPTY_CONFIG;
    }

    const result = await vscode.window.showInputBox({
      value: `${this.defaultConfig.maximumDeep}`,
      title: 'Maximum Deep Level: Enter the maximum tree desired deep.',
      validateInput: text => {
        return Number.isNaN(Number.parseInt(text)) ? 'Maximum deep should be a number' : null;
      },
    });

    if (!result) {
      this.cancelled = true;
    }

    return result ? Number.parseInt(result) : EMPTY_CONFIG;
  }

  private async requestIgnore() {
    if (this.cancelled) {
      return EMPTY_CONFIG;
    }

    const result = await vscode.window.showInputBox({
      title: 'Ignore (do not include files and directories with this pattern)',
      placeHolder: 'e.g.: window, 1:red cat, 2:blue sky',
      value: '',
    });

    if (result === undefined) {
      this.cancelled = true;
    }

    return result || EMPTY_CONFIG;
  }

  private async requestOnly() {
    if (this.cancelled) {
      return EMPTY_CONFIG;
    }

    const result = await vscode.window.showInputBox({
      title: 'Only (only include files and directories with this pattern)',
      placeHolder: 'e.g.: window, 1:red cat, 2:blue sky',
      value: '',
    });

    if (result === undefined) {
      this.cancelled = true;
    }

    return result || EMPTY_CONFIG;
  }
}
