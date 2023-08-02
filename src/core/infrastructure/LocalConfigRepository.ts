import IConfigRepository from "../domain/IConfigRepository";
import AppConfig, { AppConfigToken } from "../domain/AppConfig";
import { inject, injectable } from "inversify";

@injectable()
class LocalConfigRepository implements IConfigRepository {
  constructor(@inject(AppConfigToken) public readonly config: AppConfig) {}
}

export default LocalConfigRepository;
