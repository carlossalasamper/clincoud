import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { DatabaseUriToken, IDatabaseService } from "../../domain";
import { ILogger, ILoggerToken } from "../../../core/domain/ILogger";

@injectable()
export default class MongooseDatabaseService implements IDatabaseService {
  constructor(
    @inject(ILoggerToken) private readonly logger: ILogger,
    @inject(DatabaseUriToken) private readonly databaseUri: string
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
