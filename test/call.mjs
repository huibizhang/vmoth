import axios from "axios";

export default async () => {
  try {
    const res = await axios.get("/users");
    console.log("test", res.data);
  } catch (e) {
    console.error("myError", e);
  }
};
