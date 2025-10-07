export type CatalogType = "addon" | "eventGroup" | "guestType" | "package";

export interface Addon {
  id: number;
  title: string;
  icon: string;
}

export interface EventGroup {
  id: number;
  title: string;
}

export interface GuestType {
  id: number;
  title: string;
}

export interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
}

export type CatalogElement = Addon | EventGroup | GuestType | Package;

export interface CatalogTableResponse<T = CatalogElement> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CatalogTableParams {
  keyword?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  page?: number;
  size?: number;
}

export interface CreateAddonData {
  title: string;
  icon: string;
}

export interface CreateEventGroupData {
  title: string;
}

export interface CreateGuestTypeData {
  title: string;
}

export interface UpdateAddonData {
  id: number;
  title: string;
  icon: string;
}

export interface UpdateEventGroupData {
  id: number;
  title: string;
}

export interface UpdateGuestTypeData {
  id: number;
  title: string;
}

export type CreateCatalogData = CreateAddonData | CreateEventGroupData | CreateGuestTypeData;
export type UpdateCatalogData = UpdateAddonData | UpdateEventGroupData | UpdateGuestTypeData;
