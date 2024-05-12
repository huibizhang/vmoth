import { vMoth } from "../dist/index.js";
import axios from "axios";

vMoth("/users").reply(200, {
  users: [{ id: 1, name: "John Smith" }],
});

const res = await axios.get("/users");
console.log("test", res.data);

export default () => {};
