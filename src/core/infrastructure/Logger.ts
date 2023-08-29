/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import clc from "cli-color";
import { ILogger } from "../domain/ILogger";
import { injectable } from "inversify-sugar";

@injectable()
export default class Logger implements ILogger {
  private _prefix = "";

  public get prefix() {
    return this._prefix ? `[${this._prefix}]` : "";
  }

  public set prefix(value: string) {
    this._prefix = value;
  }

  alt(...messages: any[]) {
    const color = clc.xterm(250);
    console.log(this.concat([clc.bold(this.prefix), color(...messages)]));
  }

  success(...messages: any[]) {
    const color = clc.greenBright;
    console.log(this.concat([clc.bold(this.prefix), color(...messages)]));
  }

  info(...messages: any[]) {
    const color = clc.blue;
    console.log(this.concat([clc.bold(this.prefix), color(...messages)]));
  }

  error(...messages: any[]) {
    const color = clc.red.bold;
    console.error(this.concat([clc.bold(this.prefix), color(...messages)]));
  }

  warn(...messages: any[]) {
    const color = clc.yellow;
    console.warn(this.concat([clc.bold(this.prefix), color(...messages)]));
  }

  private concat(values: string | string[], separator = " ") {
    return Array.isArray(values)
      ? values.filter((value) => value !== "").join(separator)
      : values;
  }
}
