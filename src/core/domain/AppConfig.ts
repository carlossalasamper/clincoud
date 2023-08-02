import API from "./API";

export interface AppDocumentationConfig {
  swaggerDocument: Record<string, unknown>;
}

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
  documentation: AppDocumentationConfig;
  security: AppSecurityConfig;
  api: Record<keyof API, AppApiConfig>;
}
