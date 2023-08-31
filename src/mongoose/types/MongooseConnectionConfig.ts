import { MongooseOptions } from "mongoose";

export default interface MongooseConnectionConfig {
  uri: string;
  options?: MongooseOptions;
}
