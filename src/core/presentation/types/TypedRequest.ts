/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export declare type TypedRequest<TParams, TQuery, TBody> = Request<
  TParams,
  any,
  TBody,
  TQuery
>;

export declare type BodyTypedRequest<TBody> = Request<
  ParamsDictionary,
  any,
  TBody,
  any
>;

export declare type ParamsTypedRequest<TParams> = Request<
  TParams,
  any,
  any,
  any
>;

export declare type QueryTypedRequest<TQuery> = Request<
  ParamsDictionary,
  any,
  any,
  TQuery
>;
