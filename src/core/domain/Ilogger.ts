export const ILoggerToken = Symbol();

export default interface ILogger {
  get prefix(): string;
  set prefix(value: string);

  info(...message: string[]): void;
  error(...message: string[]): void;
  warn(...message: string[]): void;
}
