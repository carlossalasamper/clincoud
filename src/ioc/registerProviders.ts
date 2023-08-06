/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import container from "./container";
import Provider, {
  ClassProvider,
  ValueProvider,
  isClassProvider,
  isValueProvider,
} from "./types/Provider";

const registerProviders = (providers: Provider[]) => {
  for (const provider of providers) {
    if (isClassProvider(provider)) {
      const classProvider = provider as ClassProvider;
      setScope(
        container.bind(classProvider.useClass).toSelf(),
        classProvider.scope
      );
    } else if (isValueProvider(provider)) {
      const valueProvider = provider as ValueProvider;
      container
        .bind(valueProvider.provide)
        .toConstantValue(valueProvider.useValue);
    }
  }
};

function setScope(
  binding: interfaces.BindingInWhenOnSyntax<any>,
  scope?: interfaces.BindingScope
) {
  switch (scope) {
    case "Singleton":
      binding.inSingletonScope();
      break;
    case "Request":
      binding.inRequestScope();
      break;
    case "Transient":
    default:
      binding.inTransientScope();
      break;
  }
}

export default registerProviders;
