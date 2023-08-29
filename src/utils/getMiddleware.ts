import { Middleware, MiddlewareRef } from "../core";
import { getModuleContainer } from "inversify-sugar";
import { MiddlewareRefObject } from "../core/presentation/types/MiddlewareRef";

export default function getMiddleware(
  container: ReturnType<typeof getModuleContainer>,
  middlewareRef: MiddlewareRef
): Middleware {
  const MiddlewareRefObject: MiddlewareRefObject =
    typeof middlewareRef === "function"
      ? {
          class: middlewareRef,
          source: "provided",
        }
      : middlewareRef;

  return container[
    MiddlewareRefObject.source === "provided" ? "getProvided" : "getImported"
  ](MiddlewareRefObject.class);
}
