import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
  providedIn: "root",
})
export class ProfileServices {
  private _username$ = new BehaviorSubject<any>(
    this.storageService.getUser().name
  );

  get username$() {
    return this._username$.asObservable();
  }

  constructor(private readonly storageService: SessionStorageService) {}

  setUsername(user: any) {
    this._username$.next(user.name);
  }
}
