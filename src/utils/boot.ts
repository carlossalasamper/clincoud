import { Constructor } from "../common";
import { BaseApp } from "../core";
import { container, registerModules } from "../ioc";

const boot = <AppType extends BaseApp>(
  App: Constructor<AppType>,
  AppModule: Constructor
) => {
  registerModules(AppModule, true);

  container.bind(App).toSelf().inSingletonScope();
  container.get(App).initialize();
};

export default boot;
