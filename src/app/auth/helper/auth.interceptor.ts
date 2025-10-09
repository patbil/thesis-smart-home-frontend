import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { SessionStorageService } from "../services/session-storage.service";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";

const TOKEN_HEADER_KEY = "x-access-token";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly storageService: SessionStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.storageService.getToken() || "";
    req = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, authToken) });
    return next.handle(req);
  }
}
