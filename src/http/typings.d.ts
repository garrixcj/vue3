/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';

export interface HexResponse<T = ResponseData> extends AxiosResponse {
  data: T;
}

export type ResponseData = TrueResponse | FalseResponse;

export type TrueResponse = {
  result: true;
  data: any;
  response_code: string;
  [key: string]: unknown;
};

export type FalseResponse = {
  result: false;
  message: string;
  code: number;
  data?: any;
  response_code: string;
  [key: string]: unknown;
};

declare module 'axios' {
  export interface AxiosInstance extends Axios {
    (config: AxiosRequestConfig): AxiosPromise;
    (url: string, config?: AxiosRequestConfig): AxiosPromise;
    get<R = HexResponse, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    delete<R = HexResponse, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    post<R = HexResponse, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
    put<R = HexResponse, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
  }
}
