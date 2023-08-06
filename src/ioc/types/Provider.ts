/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import { z } from "zod";

const ScopeSchema = z.enum(["Singleton", "Request", "Transient"]);

const ClassProviderSchema = z.object({
  useClass: z.function(),
  scope: ScopeSchema.optional(),
});

const ValueProviderSchema = z.object({
  provide: z.string().or(z.symbol()),
  useValue: z.any(),
});

/**
 * Interface defining a *Class* type provider.
 *
 * For example:
 * ```typescript
 * const connectionProvider = {
 *   useClass: SomeClass,
 * };
 * ```
 *
 * @see [Value providers](https://docs.nestjs.com/fundamentals/custom-providers#value-providers-usevalue)
 *
 * @publicApi
 */
export interface ClassProvider<T = any> {
  /**
   * Instance of a provider to be injected.
   */
  useClass: T;
  /**
   * Binding scope of a provider.
   * @default 'Transient'
   */
  scope?: interfaces.BindingScope;
}

/**
 * Interface defining a *Value* type provider.
 *
 * For example:
 * ```typescript
 * const connectionProvider = {
 *   provide: 'CONNECTION',
 *   useValue: connection,
 * };
 * ```
 *
 * @see [Value providers](https://docs.nestjs.com/fundamentals/custom-providers#value-providers-usevalue)
 *
 * @publicApi
 */
export interface ValueProvider<T = any> {
  /**
   * Injection token
   */
  provide: interfaces.ServiceIdentifier;
  /**
   * Instance of a provider to be injected.
   */
  useValue: T;
}

type Provider<T = any> = ClassProvider<T> | ValueProvider<T>;

export default Provider;

export const isClassProvider = (data: unknown) => {
  return ClassProviderSchema.safeParse(data).success;
};
export const isValueProvider = (data: unknown) => {
  return ValueProviderSchema.safeParse(data).success;
};
