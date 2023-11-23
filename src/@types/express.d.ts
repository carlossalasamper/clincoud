import Locale from "../i18n/Locale";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      locale: `${Locale}`;
    }
  }
}
