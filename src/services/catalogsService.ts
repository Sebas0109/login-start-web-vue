import { apiClient } from "@/lib/apiClient";
import type {
  CatalogType,
  CatalogElement,
  CatalogTableResponse,
  CatalogTableParams,
  CreateCatalogData,
  UpdateCatalogData,
} from "@/types/catalog";

const VALID_CATALOGS: CatalogType[] = ["addon", "eventGroup", "guestType", "package"];

class CatalogsService {
  private validateCatalog(catalog: string): void {
    if (!VALID_CATALOGS.includes(catalog as CatalogType)) {
      throw new Error("Invalid Catalog Try Again");
    }
  }

  async createCatalog(catalog: CatalogType, data: CreateCatalogData): Promise<CatalogElement> {
    this.validateCatalog(catalog);
    return await apiClient.post<CatalogElement>(`/api/catalogs/create/${catalog}`, data);
  }

  async getCatalogTable(
    catalog: CatalogType,
    params: CatalogTableParams = {}
  ): Promise<CatalogTableResponse> {
    this.validateCatalog(catalog);
    
    const searchParams = new URLSearchParams();
    if (params.keyword !== undefined) searchParams.append("keyword", params.keyword);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.order) searchParams.append("order", params.order);
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/catalogs/table/${catalog}${queryString ? `?${queryString}` : ""}`;
    
    return await apiClient.get<CatalogTableResponse>(endpoint);
  }

  async getCatalogSelect(catalog: CatalogType): Promise<CatalogElement[]> {
    this.validateCatalog(catalog);
    return await apiClient.get<CatalogElement[]>(`/api/catalogs/select/${catalog}`);
  }

  async getCatalogById(catalog: CatalogType, id: number): Promise<CatalogElement> {
    this.validateCatalog(catalog);
    return await apiClient.get<CatalogElement>(`/api/catalogs/select/${catalog}/${id}`);
  }

  async updateCatalog(catalog: CatalogType, data: UpdateCatalogData): Promise<CatalogElement> {
    this.validateCatalog(catalog);
    return await apiClient.put<CatalogElement>(`/api/catalogs/update/${catalog}`, data);
  }

  async deleteCatalog(catalog: CatalogType, id: number): Promise<string> {
    this.validateCatalog(catalog);
    return await apiClient.delete<string>(`/api/catalogs/delete/${catalog}?id=${id}`);
  }
}

export const catalogsService = new CatalogsService();
