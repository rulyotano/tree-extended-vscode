import type { IRunningEnvironment } from 'tree-extended';
import { join, sep } from 'path';
import { existsSync, readdir, lstat, readFile, exists } from 'fs';
import { EOL } from 'os';
import * as util from 'util';

const readdirAsync = util.promisify(readdir);
const lstatAsync = util.promisify(lstat);
const readFileAsync = util.promisify(readFile);

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
    return readdirAsync(directoryPath);
  }
  async isDirectory(path: string): Promise<boolean> {
    return (await lstatAsync(path)).isDirectory();
  }
  async isFile(path: string): Promise<boolean> {
    return (await lstatAsync(path)).isFile();
  }
  readTextFile(path: string): Promise<string> {
    return readFileAsync(path, 'utf-8');
  }
  getEndOfLine(): string {
    return EOL;
  }
  getPathParts(path: string): string[] {
    return path.split(sep);
  }
}
