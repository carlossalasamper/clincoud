/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { z, ZodType, ZodTypeDef } from "zod";

export declare type TypedRequest<
  TParams extends ZodType<any, ZodTypeDef, any>,
  TQuery extends ZodType<any, ZodTypeDef, any>,
  TBody extends ZodType<any, ZodTypeDef, any>
> = Request<z.infer<TParams>, any, z.infer<TBody>, z.infer<TQuery>>;

export declare type TypedRequestBody<
  TBody extends ZodType<any, ZodTypeDef, any>
> = Request<ParamsDictionary, any, z.infer<TBody>, any>;

export declare type TypedRequestParams<
  TParams extends ZodType<any, ZodTypeDef, any>
> = Request<z.infer<TParams>, any, any, any>;

export declare type TypedRequestQuery<
  TQuery extends ZodType<any, ZodTypeDef, any>
> = Request<ParamsDictionary, any, any, z.infer<TQuery>>;
