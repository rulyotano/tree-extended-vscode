export default interface ICommand {
  name: string,
  action: (...args: any[]) => any
}