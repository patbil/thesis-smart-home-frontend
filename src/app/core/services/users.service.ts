import { User } from "../models/User";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly url = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  getAllUsers() {
    return this.httpClient.get<User[]>(this.url + `users`);
  }

  getUser(id: any) {
    return this.httpClient.get<User[]>(this.url + `users/${id}`);
  }

  createUser(user: User) {
    return this.httpClient.post<User>(this.url + `users/sign-up`, user);
  }

  deleteUser(id: any) {
    return this.httpClient.delete<User>(this.url + `users/${id}`);
  }

  updateUser(user: User, id: any) {
    return this.httpClient.put<User>(this.url + `users/${id}`, user);
  }
}
