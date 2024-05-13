import { AxiosRequestConfig, AxiosStatic } from "axios";

export type HandlerResponse = {
  status?: number;
  data?: any;
};

/**
 * 資料處理函式
 *
 * @param {AxiosRequestConfig} config AxiosRequestConfig
 *
 * @returns {HandlerResponse} HandlerResponse
 */
export type Handler = (config?: AxiosRequestConfig) => HandlerResponse;

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
}

export type VMoth = (axios: AxiosStatic) => VMothInstance;
