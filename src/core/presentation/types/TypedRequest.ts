/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ZodType, ZodTypeDef } from "zod";

export declare type TypedRequest<
  TParams extends ZodType<any, ZodTypeDef, any>,
  TQuery extends ZodType<any, ZodTypeDef, any>,
  TBody extends ZodType<any, ZodTypeDef, any>
> = Request<TParams, any, TBody, TQuery>;

export declare type BodyTypedRequest<
  TBody extends ZodType<any, ZodTypeDef, any>
> = Request<ParamsDictionary, any, TBody, any>;

export declare type ParamsTypedRequest<
  TParams extends ZodType<any, ZodTypeDef, any>
> = Request<TParams, any, any, any>;

export declare type QueryTypedRequest<
  TQuery extends ZodType<any, ZodTypeDef, any>
> = Request<ParamsDictionary, any, any, TQuery>;
