import { AxiosRequestConfig, AxiosStatic } from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  Handler,
  HandlerResponse,
  onRequest,
  VMothInstance,
  VMoth,
  VMothPattern,
} from "./types";

/**
 *
 * @param {AxiosStatic} axios AxiosStatic
 * @returns 回傳 vMoth 實體
 *
 * @example
 * // 內容結構
 * {
 *   on (url, handler) => viod
 * }
 *
 */
export function vMoth(axios: AxiosStatic): VMothInstance;

export function vMoth(axios: AxiosStatic): VMothInstance {
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  function onRequest(
    url: string | RegExp,
    handler: Handler | HandlerResponse | string | object | number | []
  ) {
    function isHandlerResponse(_h: any): _h is HandlerResponse {
      return (_h as HandlerResponse)?.status || (_h as HandlerResponse)?.data;
    }
    if (handler && handler instanceof Function) {
      mock.onAny(url).reply((config) => {
        const result: HandlerResponse = handler(config);
        return [result?.status ?? 200, result?.data ?? {}];
      });
      return;
    } else if (handler && isHandlerResponse(handler)) {
      mock.onAny(url).reply(handler?.status ?? 200, handler?.data ?? {});
    }
    mock.onAny(url).reply(200, handler);
  }

  return {
    on: onRequest,
  };
}

/**
 * 預設回傳值樣板
 *
 * @param _400
 * @param _401
 * @param _404
 * @param _500
 * @param json
 */
export const pattern: VMothPattern = {
  _400: { status: 400 },
  _401: { status: 401 },
  _404: { status: 404 },
  _500: { status: 500 },
  json: (data: any): HandlerResponse => {
    let result;
    try {
      result = JSON.stringify(data);
      JSON.parse(result);
    } catch (err: any) {
      result = JSON.stringify({
        error: true,
        message: "Error: Un-parseable Object.",
      });
    }
    return {
      data: result,
    };
  },
};
