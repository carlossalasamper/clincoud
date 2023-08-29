import mongoose from "mongoose";
import { injectable } from "inversify-sugar";
import { DatabaseUriToken, IDatabaseService } from "../../domain";
import { ILogger, ILoggerToken } from "../../../core/domain/ILogger";
import { provided } from "inversify-sugar";

@injectable()
export default class MongooseDatabaseService implements IDatabaseService {
  constructor(
    @provided(ILoggerToken) private readonly logger: ILogger,
    @provided(DatabaseUriToken) private readonly databaseUri: string
  ) {
    this.logger.prefix = MongooseDatabaseService.name;
  }

  async connect() {
    mongoose.connection.once("open", () => {
      this.logger.info("Connected to database!");
    });
    mongoose.connection.on("error", (error) => {
      this.logger.error("Mongoose Connection Error : " + error);
    });

    await mongoose.connect(this.databaseUri);
  }
}
