import {
  Newable,
  InversifySugar,
  InversifySugarOptions,
  getModuleContainer,
} from "inversify-sugar";
import { AppToken, BaseApp } from "../core";

const boot = (
  AppModule: Newable,
  options: Partial<InversifySugarOptions> = {}
) => {
  Object.assign(
    InversifySugar.options,
    {
      defaultScope: "Singleton",
    },
    options
  );

  InversifySugar.run(AppModule);

  getModuleContainer(AppModule).getProvided<BaseApp>(AppToken).initialize();
};

export default boot;
