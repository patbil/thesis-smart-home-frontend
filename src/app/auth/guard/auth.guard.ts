import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../services/auth.service";
import { DialogComponent } from "src/app/shared/dialog/dialog.component";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.checkIsLoggedIn();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIsLoggedIn();
  }

  checkIsLoggedIn() {
    if (!this.authService.isLogged) {
      this.router.navigate(["login"]);

      this.dialog
        .open(DialogComponent, {
          maxWidth: "450px",
          data: {
            title: "Nieautoryzowany dostęp",
            info: "Dostęp tylko dla zalogowanych użytkowników. Zaloguj się, aby móc przejść do tej strony.",
            delete: false,
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) this.router.navigate(["login"]);
        });
      return false;
    }

    return true;
  }
}
