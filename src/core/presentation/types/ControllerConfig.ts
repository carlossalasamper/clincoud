import API from "../../domain/API";

export default interface ControllerConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  api: keyof API;
  path: string;
}
