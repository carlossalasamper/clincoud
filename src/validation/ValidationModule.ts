import { module } from "inversify-sugar";
import Validator from "./Validator";

@module({
  providers: [Validator],
  exports: [Validator],
})
export default class ValidationModule {}
