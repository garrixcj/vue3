import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    auth?: boolean;
    checkPermissions?: boolean;
    menuId?: string | number;
    title?: string;
    perm?: string;
  }
}
