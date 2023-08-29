import { Newable, Provider } from "inversify-sugar";
import { Controller, ControllerToken } from "../core";
import { controllerModuleKey } from "../core/presentation/types/ControllerMetadata";

export default function provideControllers(
  Module: Newable,
  controllerClasses: Newable<Controller>[]
): Provider[] {
  controllerClasses.forEach((Controller) => {
    Reflect.defineMetadata(controllerModuleKey, Module, Controller.prototype);
  });

  return controllerClasses.map((Controller) => ({
    provide: ControllerToken,
    useClass: Controller,
  }));
}
