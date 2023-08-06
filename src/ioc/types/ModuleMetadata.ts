import { keys } from "ts-transformer-keys";
import { Constructor } from "../../common";
import { Controller } from "../../core";
import Provider from "./Provider";

/**
 * Interface defining the property object that describes the module.
 *
 * @see [Modules](https://github.com/carlossalasamper/clincoud#modules)
 *
 * @publicApi
 */
export interface ModuleMetadataArgs {
  /**
   * Optional list of submodules defined in this module which have to be
   * registered.
   */
  imports?: Constructor[];

  /**
   * Optional list of controllers defined in this module which have to be
   * instantiated.
   */
  controllers?: Constructor<Controller>[];

  /**
   * Optional list of providers defined in this module which have to be
   * registered.
   */
  providers?: Provider[];
}

export default interface ModuleMetadata {
  imports: Constructor[];
  controllers: Constructor<Controller>[];
  providers: Provider[];
}

export const moduleMetadataKeys = keys<ModuleMetadata>();
