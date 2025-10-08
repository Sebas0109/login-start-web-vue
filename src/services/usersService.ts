import { apiClient } from "@/lib/apiClient";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersTableParams,
  UsersTableResponse,
  SelectClient,
} from "@/types/user";

class UsersService {
  async createUser(data: CreateUserData): Promise<User> {
    return await apiClient.post<User>("/api/user/register-user", data);
  }

  async getUsersPage(params: UsersTableParams = {}): Promise<UsersTableResponse> {
    const {
      keyword = "",
      sortBy = "id",
      order = "DESC",
      page = 0,
      size = 10,
    } = params;

    const queryParams = new URLSearchParams({
      keyword,
      sortBy,
      order,
      page: page.toString(),
      size: size.toString(),
    });

    return await apiClient.get<UsersTableResponse>(
      `/api/user/get-all?${queryParams.toString()}`
    );
  }

  async getUserById(id: number): Promise<User> {
    return await apiClient.get<User>(`/api/user/get/${id}`);
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    return await apiClient.put<User>("/api/user/update", data);
  }

  async deleteUser(id: number): Promise<string> {
    return await apiClient.delete<string>(`/api/user/delete-user/${id}`);
  }

  async getSelectClients(): Promise<SelectClient[]> {
    return await apiClient.get<SelectClient[]>("/api/user/select-clients");
  }
}

export const usersService = new UsersService();
