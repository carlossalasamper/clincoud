/* eslint-disable @typescript-eslint/no-explicit-any */
import { container } from "../ioc";
import { BaseApp } from "./infrastructure";

export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./presentation";

const boot = <AppType extends BaseApp>(App: {
  new (...args: any[]): AppType;
}) => {
  container.bind(App).toSelf().inSingletonScope();
  container.get<BaseApp>(typeof App).initialize();
};

export { boot };
