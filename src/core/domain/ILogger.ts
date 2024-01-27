export const ILoggerToken = Symbol("ILogger");

export interface ILogger {
  get prefix(): string;
  set prefix(value: string);

  alt(...message: string[]): void;
  success(...message: string[]): void;
  info(...message: string[]): void;
  error(...message: string[]): void;
  warn(...message: string[]): void;
}
