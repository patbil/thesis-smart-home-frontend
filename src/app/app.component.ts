import { BreakpointObserver } from "@angular/cdk/layout";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { AuthService } from "./auth/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  public title = "Smart-Home";

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private readonly observer: BreakpointObserver,
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  // Changing the side menu properties when a page width change to less than 800px is detected.
  ngAfterViewInit(): void {
    this.observer.observe(["(max-width: 800px)"]).subscribe((res: any) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
