import { NextFunction, Request, Response } from "express";
import AcceptLanguageHeader from "../types/AcceptLanguageHeader";
import { injectable, provided } from "inversify-sugar";
import { Middleware } from "../../../core";
import Locale from "../../Locale";
import I18nModuleConfig, {
  I18nModuleConfigToken,
} from "../../I18nModuleConfig";

@injectable()
export default class AcceptLanguageMiddleware implements Middleware {
  constructor(
    @provided(I18nModuleConfigToken)
    private readonly i18nConfig: I18nModuleConfig
  ) {}

  public handler = (req: Request, _res: Response, next: NextFunction) => {
    const acceptLanguageContent = req.headers[AcceptLanguageHeader];
    let locale = this.i18nConfig.defaultLocale;

    if (typeof acceptLanguageContent === "string") {
      const headerLocale = acceptLanguageContent.substring(0, 2);

      if (this.i18nConfig.supportedLocales.includes(headerLocale as Locale)) {
        locale = headerLocale as Locale;
      }
    } else if (
      Array.isArray(acceptLanguageContent) &&
      acceptLanguageContent.length > 0
    ) {
      const headerLocale = acceptLanguageContent[0].substring(0, 2);

      if (this.i18nConfig.supportedLocales.includes(headerLocale as Locale)) {
        locale = headerLocale as Locale;
      }
    }

    req.locale = locale;

    next();
  };
}
