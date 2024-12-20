import { UrlApi } from "./url-api";

export class Role {
  roleId? : number;
  name? : string;
  selected?: boolean;
  permissions?: UrlApi[];
}
