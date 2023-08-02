import AppConfig from "./AppConfig";

export const IConfigRepositoryToken = Symbol("IConfigRepository");

export default interface IConfigRepository {
  readonly config: AppConfig;
}
