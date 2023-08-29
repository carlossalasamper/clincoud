import IConfigRepository from "../domain/IConfigRepository";
import AppConfig, { AppConfigToken } from "../domain/AppConfig";
import { injectable, provided } from "inversify-sugar";

@injectable()
class LocalConfigRepository implements IConfigRepository {
  constructor(@provided(AppConfigToken) public readonly config: AppConfig) {}
}

export default LocalConfigRepository;
