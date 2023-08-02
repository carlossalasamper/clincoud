import API from "./API";

export interface AppSecurityConfig {
  cors: {
    credentials: boolean;
    origin: string[];
    methods: string[];
  };
}

export interface AppApiConfig {
  path: string;
}

export const AppConfigToken = Symbol();

export default interface AppConfig {
  security: AppSecurityConfig;
  api: Record<keyof API, AppApiConfig>;
}
