import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileServices } from "./profile.service";
import { environment } from "src/environments/environment";
import { LoginRequest } from "../../auth/models/LoginRequest";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly url = environment.baseUrl;
  private _authStatus$ = new Subject<boolean>();

  get authSatus$() {
    return this._authStatus$.asObservable();
  }

  get isLogged(): boolean {
    return this.storageService.getToken() !== null ? true : false;
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly storageService: SessionStorageService,
    private readonly profileService: ProfileServices
  ) {}

  public signIn(loginRequest: LoginRequest): void {
    this.httpClient
      .post<any>(this.url + `users/sign-in`, loginRequest)
      .subscribe({
        error: (err: any) => {
          this._authStatus$.next(false);
        },
        next: (res: any) => {
          this._authStatus$.next(true);
          this.storageService.saveToken(res.token);
          this.storageService.saveUser(res.user);
          this.profileService.setUsername(res.user);
          this.router.navigate(["home"]);
        },
      });
  }

  logout(): void {
    this.storageService.clear();
    this.router.navigate(["login"]);
  }
}
