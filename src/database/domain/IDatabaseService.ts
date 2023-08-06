export const IDatabaseServiceToken = Symbol.for("IDatabaseService");

export const DatabaseUriToken = Symbol.for("DatabaseUri");

export default interface IDatabaseService {
  connect(): Promise<void>;
}
