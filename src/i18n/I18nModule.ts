import { DynamicModule, module } from "inversify-sugar";
import AcceptLanguageMiddleware from "./presentation/middlewares/AcceptLanguageMiddleware";
import I18nModuleConfig, { I18nModuleConfigToken } from "./I18nModuleConfig";

@module({
  providers: [AcceptLanguageMiddleware],
  exports: [AcceptLanguageMiddleware],
})
export default class I18nModule {
  static forRoot(config: I18nModuleConfig): DynamicModule {
    if (config.supportedLocales.length === 0) {
      throw new Error("Supported locales cannot be empty");
    }

    if (!config.supportedLocales.includes(config.defaultLocale)) {
      throw new Error(
        `Default locale (${
          config.defaultLocale
        }) is not included in supported locales (${config.supportedLocales.join(
          ", "
        )})`
      );
    }

    return {
      module: I18nModule,
      providers: [
        {
          provide: I18nModuleConfigToken,
          useValue: config,
          isGlobal: true,
        },
      ],
    };
  }
}
