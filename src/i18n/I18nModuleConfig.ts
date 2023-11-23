import Locale from "./Locale";

export const I18nModuleConfigToken = Symbol("I18nModuleConfigToken");

export default interface I18nModuleConfig {
  defaultLocale: `${Locale}`;
  supportedLocales: `${Locale}`[];
}
