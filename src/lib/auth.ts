import { IRequest } from "itty-router";
import { Env } from "../types";

export async function authAdmin(request: IRequest, env: Env) {
  const header = request.headers.get("authorization") || "";
  const valid = `Basic ${btoa("admin:" + env.ADMIN_PASSWORD)}`;
  if (header !== valid) return new Response("Unauthorized", { status: 401, headers:{"WWW-Authenticate":"Basic realm=admin"} });
}
