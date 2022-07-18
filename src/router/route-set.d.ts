/* eslint-disable @typescript-eslint/no-explicit-any */
export as namespace Router;

export interface RouteSet {
  id: number;
  route: string;
  note: string;
  dict: string;
  component: string;
  host: string;
  file: string;
  qstr: string;
  name: string;
  perm: string;
  [key: string]: string;
}
