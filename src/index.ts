import axios from "axios";
import MockAdapter from "axios-mock-adapter";

var mock = new MockAdapter(axios);
export const vMoth = mock.onGet;
