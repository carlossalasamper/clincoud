export const IDatabaseServiceToken = Symbol("IDatabaseService");

export const DatabaseUriToken = Symbol("DatabaseUri");

export default interface IDatabaseService {
  connect(): Promise<void>;
}
