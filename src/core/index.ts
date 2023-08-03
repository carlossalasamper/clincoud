import { container } from "../ioc";
import { BaseApp } from "./infrastructure";

export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./presentation";

const boot = (app: BaseApp) => {
  container.bind<BaseApp>(BaseApp).toConstantValue(app);

  app.initialize();
};

export { boot };
