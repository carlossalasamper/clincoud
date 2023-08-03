import { container } from "../ioc";
import { BaseApp } from "./infrastructure";

export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./presentation";

const boot = <AppType extends typeof BaseApp>(App: AppType) => {
  container.bind<BaseApp>(App).toSelf().inSingletonScope();
  container.get<BaseApp>(App).initialize();
};

export { boot };
