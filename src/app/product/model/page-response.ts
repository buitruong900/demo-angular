export class PageResponse<T> {
  totalElements! : number;
  totalPages! : number;
  size!: number;
  page! : number;
  content! : T[];
}
