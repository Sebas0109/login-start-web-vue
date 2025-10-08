export interface Person {
  id: number;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  stateCode: string;
  phone: string;
}

export interface User {
  id: number;
  email: string;
  person: Person;
  profile: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  stateCode: string;
  phone: string;
}

export interface UpdateUserData {
  id: number;
  email: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  stateCode: string;
  phone: string;
}

export interface UsersTableParams {
  keyword?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export interface UsersTableResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface SelectClient {
  id: number;
  name: string;
}
