import { PageDto } from "./page-dto";
import { Product } from "./product";

export class ProductDto extends PageDto{
  products?: Product[];
  proId?: number;
  proName?: string;
  producer?: string;
  yearMaking?: number;
  startDate?: Date;
  expDate?: Date;
  quality?: number;
  price?: number;
}
