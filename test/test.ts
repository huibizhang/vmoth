import axios from "axios";
import { vMoth, pattern } from "../dist";
import { VMothPattern } from "../dist/types";
import call from "./call.mjs";

const mock = vMoth(axios);

const customPattern: VMothPattern = {
  BAD_GATEWAY: { status: 501 },
  test: () => ({}),
  test2: { status: 4001 },
  go: () => ({}),
};

mock.on("/users", pattern.json("aaa"));

mock.on("/users", customPattern.BAD_GATEWAY);

// mock.on("/datas", {
//   username: 534763573,
// });

call();

export default () => {};
