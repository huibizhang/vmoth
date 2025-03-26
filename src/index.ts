import { AxiosRequestConfig, AxiosStatic } from "axios";
import MockAdapter from "axios-mock-adapter";

export type HandlerResponse = {
  status?: number;
  data?: any;
};

export type Request = {
  method?: string;
  params?: any;
  data?: any;
};

/**
 * 資料處理函式
 * @param {Request} req Request 請求物件
 * @param {AxiosRequestConfig} config 原始 Request 請求
 *
 * @returns {HandlerResponse} HandlerResponse
 */
export type Handler = (
  req: Request,
  config?: AxiosRequestConfig
) => HandlerResponse;

export interface VMothPattern {
  [key: string]: Handler | HandlerResponse | undefined;
  /**
   * 將資料轉化為 json string 後輸出
   *
   * @param data 要處理的序列化資料
   * @returns {HandlerResponse}
   */
  json?: Handler;
}
export type URL = string | RegExp;

/**
 *
 * @param {URL} url 要 mock 的目標位址
 *
 * @param {Handler| HandlerResponse | string | object | number | []} handler
 * mock 的回傳值。可以帶入 Handler 回呼函式進行處理。
 *
 */
export declare function onRequest(
  url: URL,
  handler: Handler | HandlerResponse | string | object | number | []
): void;

export interface VMothInstance {
  on: typeof onRequest;
  off: () => void;
}

export type VMoth = (axios: AxiosStatic) => VMothInstance;

const getParams = (config: AxiosRequestConfig) => {
  let host = config.url?.startsWith("/") ? "http://localhost" : "";

  const url = new URL(`${host}${config.url ?? "/"}`);
  const entries = url.searchParams.entries();
  const params: { [key: string]: string } = {};

  for (const [k, v] of entries) {
    params[k] = v;
  }
  return params;
};

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
        const req: Request = {
          method: config.method,
          params: getParams(config),
          data: config.data,
        };
        try {
          req.data = JSON.parse(config.data);
        } catch (e) {}

        const result: HandlerResponse = handler(req, config);
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
    off()  {
      mock.restore();
    }
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
