import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean;
    checkPermissions?: boolean;
    menuId?: string | number;
    title?: string;
    perm?: string;
  }
}

export type languages = {
  [key: string]: dicts;
};

export type dicts = {
  [key: string]: string;
};
