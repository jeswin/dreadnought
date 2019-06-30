import { init } from "..";
import request = require("supertest");
import { IDbConfig } from "psychopiggy";
import * as userModule from "../domain/user";
import * as jwtModule from "../utils/jwt";

let app: any;

export default function run(dbConfig: IDbConfig, configDir: string) {
  describe("service", async () => {
    let app: any;

    before(async () => {
      const service = await init(configDir);
      app = service.listen();
    });

    it("adds a key value pair", async () => {
      // Mock a few things.
      const realVerify = jwtModule.verify;
      (jwtModule as any).verify = (() => ({
        valid: true,
        value: { userId: "jeswin" }
      })) as typeof realVerify;

      const realCreateKeyValuePair = userModule.createKeyValuePair;
      (userModule as any).createKeyValuePair = (async () => ({
        created: true,
        edit: "insert"
      })) as typeof realCreateKeyValuePair;

      const response = await request(app)
        .post("/me/kvstore")
        .set("Cookie", ["border-patrol-jwt=some_jwt"]);

      (jwtModule as any).verify = realVerify;
      (userModule as any).createKeyValuePair = realCreateKeyValuePair;

      JSON.parse(response.text).should.deepEqual({ success: true });
    });

    // it("adds a resource", async () => {
    //   // Mock a few things.
    //   const realVerify = jwtModule.verify;
    //   (jwtModule as any).verify = () => ({
    //     valid: true,
    //     value: { userId: "jeswin" }
    //   });

    //   const realCreateResource = userModule.createResource;
    //   (userModule as any).createResource = (async () => ({
    //     created: true
    //   })) as typeof realCreateResource;

    //   const response = await request(app)
    //     .post("/me/resources")
    //     .set("Cookie", ["border-patrol-jwt=some_jwt"]);

    //   (jwtModule as any).verify = realVerify;
    //   (userModule as any).createUser = realCreateResource;

    //   JSON.parse(response.text).should.deepEqual({ success: true });
    // });
  });
}
