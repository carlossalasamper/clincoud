import { ZodSchema } from "zod";

type RequestValidation<
  TParams = Record<string, never>,
  TQuery = Record<string, never>,
  TBody = Record<string, never>
> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};

export default RequestValidation;
