import axios from "axios";

export default async () => {
  try {
    const res = await axios.post("/users?team=1", { username: "jq" });
    console.log("test", res.data);
  } catch (e) {
    console.error("myError", e);
  }
};
