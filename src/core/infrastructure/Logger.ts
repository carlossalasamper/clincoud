/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { injectable } from "inversify";
import { ILogger } from "../domain";

@injectable()
export default class Logger implements ILogger {
  private _prefix = "";

  public get prefix() {
    return this._prefix ? `[${this._prefix}]` : "";
  }

  public set prefix(value: string) {
    this._prefix = value;
  }

  info(...messages: any[]) {
    console.log(this.concat([this.prefix, ...messages]));
  }

  error(...messages: any[]) {
    console.error(this.concat([this.prefix, ...messages]));
  }

  warn(...messages: any[]) {
    console.warn(this.concat([this.prefix, ...messages]));
  }

  private concat(values: string | string[], separator = " ") {
    return Array.isArray(values)
      ? values.filter((value) => value !== "").join(separator)
      : values;
  }
}
