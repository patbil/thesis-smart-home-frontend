import { Subject, takeUntil } from "rxjs";
import { LoginRequest } from "../../models/LoginRequest";
import { AuthService } from "../../services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  hide = true;
  loginForm!: FormGroup;

  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.f["email"].value,
      password: this.f["password"].value,
    };

    this.authService.signIn(loginRequest);

    this.authService
      .authSatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((auth) => {
        if (!auth) this.setErrors();
      });
  }

  private setErrors(): void {
    this.loginForm.reset();
    this.loginForm.setErrors({ unauthenticated: true });
    this.f["password"].setErrors({ incorrect: true });
    this.f["email"].setErrors({ incorrect: true });
  }
}
