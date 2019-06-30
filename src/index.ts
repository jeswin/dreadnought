#!/usr/bin/env node

import Koa = require("koa");
import Router = require("koa-router");
import bodyParser = require("koa-bodyparser");
import { join } from "path";
import * as db from "./db";
import * as jwt from "./utils/jwt";
import * as config from "./config";
import {
  createKeyValuePair,
  createResource
} from "./api/me";
import { IAppConfig, IJWTConfig } from "./types";

export async function init(configDir: string) {
  const dbConfig = require(join(configDir, "pg.js"));
  const jwtConfig: IJWTConfig = require(join(configDir, "jwt.js"));
  const appConfig: IAppConfig = require(join(configDir, "app.js"));

  // Init utils
  db.init(dbConfig);
  jwt.init(jwtConfig);
  config.init(appConfig);

  // Set up routes
  const router = new Router();

  /* Add a key value pair for a user */
  router.post(`/me/kvstore`, createKeyValuePair);

  /* Add a resource for a user */
  router.post(`/resources`, createResource);

  // Start app
  var app = new Koa();
  app.use(bodyParser());
  app.keys = appConfig.sessionKeys.split(",");
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

if (require.main === module) {
  if (!process.env.PORT) {
    throw new Error("The port should be specified in process.env.PORT");
  }

  if (!process.env.CONFIG_DIR) {
    throw new Error(
      "The configuration directory should be specified in process.env.CONFIG_DIR"
    );
  }

  const port: number = parseInt(process.env.PORT);

  init(process.env.CONFIG_DIR).then(app => {
    app.listen(port);
    console.log(`listening on port ${port}`);
  });
}
