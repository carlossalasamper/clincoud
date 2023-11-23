/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";

export type ValidatedParamsRequest<ValidatedParamsType> = Request & {
  validatedParams: ValidatedParamsType;
};

export type ValidatedBodyRequest<ValidatedBodyType> = Request & {
  validatedBody: ValidatedBodyType;
};

export type ValidatedQueryRequest<ValidatedQueryType> = Request & {
  validatedQuery: ValidatedQueryType;
};

type ValidatedRequest<
  ValidatedParamsType = any,
  ValidatedBodyType = any,
  ValidatedQueryType = any
> = Request & {
  validatedParams: ValidatedParamsType;
  validatedBody: ValidatedBodyType;
  validatedQuery: ValidatedQueryType;
};

export default ValidatedRequest;
