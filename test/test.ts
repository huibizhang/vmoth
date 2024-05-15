import axios from "axios";
import { vMoth, pattern } from "../dist/index.js";
import call from "./call.mjs";

const mock = vMoth(axios);

mock.on("/users", (req) => {
  return {
    data: req,
  };
});

call();

export default () => {};
