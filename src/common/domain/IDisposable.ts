export default interface IDisposable {
  dispose(): void | Promise<void>;
}
