export default interface IInitializable {
  initialize(): void | Promise<void>;
}
