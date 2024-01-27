/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod";

type RequestValidation<
  TParams = Record<string, any>,
  TQuery = Record<string, any>,
  TBody = Record<string, any>
> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  queryTransform?: (query: TQuery) => TQuery;
  body?: ZodSchema<TBody>;
};

export default RequestValidation;
