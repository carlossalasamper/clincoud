import { RequestHandler } from "express";

export const ControllerToken = Symbol("Controller");

type Controller = {
  handler: RequestHandler;
};

export default Controller;
