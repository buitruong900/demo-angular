import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { Product } from '../model/product';
import { PageResponse } from '../model/page-response';
import { ProductDto } from '../model/product-dto';
import { ProductCreatdto } from '../model/product-createdto';
import { ProductUpdatedto } from '../model/product-updatedto';
import { ProductDeletedto } from '../model/product-deletedto';
import { ProductFinddto } from '../model/product-finddto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrel = 'http://localhost:2809/product';

  constructor(private httpClient : HttpClient) { }

  getProductList() : Observable<Product[]>{
    return this.httpClient.post<Product[]>(`${this.baseUrel}/all`,{});
  }

  createProduct(productCreatdto : ProductCreatdto) : Observable<Object>{
    return this.httpClient.post<Product>(`${this.baseUrel}/add`, productCreatdto);
  }

  updateProduct(productUpdateDto : ProductUpdatedto) : Observable<ProductUpdatedto>{
    return this.httpClient.post<ProductUpdatedto>(`${this.baseUrel}/update`,productUpdateDto);
  }

  deleteProduct(productDeleteDto : ProductDeletedto) : Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrel}/delete`,productDeleteDto);
  }

  searchProduct(searchProductDto : ProductDto, ) : Observable<PageResponse<Product>>{
    return this.httpClient.post<PageResponse<Product>>(`${this.baseUrel}/search`,searchProductDto);
  }

  detaillProduct(productFinddto: ProductFinddto): Observable<ProductFinddto> {
    return this.httpClient.post<ProductFinddto>(`${this.baseUrel}/detail`, productFinddto);
  }

  exportExcelProduct(searchProductDto : ProductDto): Observable<any> {
    return this.httpClient.post<ProductDto>(`${this.baseUrel}/export-excel`, searchProductDto, {
        responseType : 'blob' as 'json',
    });
  }
  importExcelProduct(file : File): Observable<any>{
    const formData : FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(`${this.baseUrel}/import-excel`,formData,{
      headers : new HttpHeaders({
        'Accept' : 'application/json'
      }),

    })
  }
  importSkipDuplicateExcelProduct(file : File): Observable<any>{
    const formData : FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(`${this.baseUrel}/import-excelSkipDuplicate`,formData,{
      headers : new HttpHeaders({
        'Accept' : 'application/json'
      })
    })
  }
}
