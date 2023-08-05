export const ILoggerToken = Symbol();

export interface ILogger {
  get prefix(): string;
  set prefix(value: string);

  success(...message: string[]): void;
  info(...message: string[]): void;
  error(...message: string[]): void;
  warn(...message: string[]): void;
}
