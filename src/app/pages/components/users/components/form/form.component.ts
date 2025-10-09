import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { User } from "src/app/core/models/User";
import { UsersService } from "src/app/core/services/users.service";
import { DialogComponent } from "src/app/shared/dialog/dialog.component";

const MAX_WIDTH = "450px";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["../../css/users.module.css"],
})
export class FormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private users: User[] = [];
  private userId: any;

  userForm = new FormGroup({});
  hide = true;
  hide_confirm = true;
  isAddMode = false;
  isChecked = false;

  get f() {
    return this.userForm.controls;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userservice: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id");
    this.isAddMode = !this.userId;

    this.getAllUsers();

    if (!this.isAddMode) {
      this.getUser();
    }

    this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  return(): void {
    this.router.navigate(["users"]);
  }

  onToggle(): void {
    this.toggle();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private getAllUsers() {
    this.userservice
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));
  }

  private getUser() {
    this.userservice
      .getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => this.userForm.patchValue(user[0]));
  }

  private createForm() {
    this.userForm = this.formBuilder.group(
      {
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        surname: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        username: [
          "",
          [
            Validators.required,
            this.isUsernameTaken(),
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: [
          "",
          [Validators.required, Validators.email, this.isEmailTaken()],
        ],
        password: [
          "",
          this.isAddMode
            ? [Validators.required, Validators.minLength(8)]
            : Validators.nullValidator,
        ],
        password_confirm: [
          "",
          this.isAddMode
            ? [Validators.required, Validators.minLength(8)]
            : Validators.nullValidator,
        ],
        role: ["", Validators.required],
      },
      { validators: this.matchPasswords("password", "password_confirm") }
    );
  }

  private toggle(): void {
    for (const key in this.userForm.controls) {
      if (key.includes("password")) {
        if (!this.isChecked) {
          this.userForm.controls[key].clearValidators();
          this.userForm.controls[key].reset();
        }

        if (this.isChecked) {
          this.userForm.controls[key].addValidators([
            Validators.minLength(8),
            Validators.required,
          ]);
        }

        this.userForm.controls[key].markAsPristine();
        this.userForm.controls[key].updateValueAndValidity();
      }
    }
  }

  private openDialog(title: string, info: string, deleted = false) {
    return this.dialog
      .open(DialogComponent, {
        maxWidth: MAX_WIDTH,
        data: {
          title,
          info,
          delete: deleted,
        },
      })
      .afterClosed();
  }

  private createUser() {
    this.userservice
      .createUser(this.userForm.value)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.openDialog("Dodaj użytkownika", "Użytkownik dodany pomyślnie.")
        )
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(["app/users"]);
          }
        },
        error: () =>
          this.openDialog(
            "Dodaj użytkownika",
            "Nie udało się dodać nowego użytkownika."
          ),
      });
  }

  private updateUser() {
    this.userservice
      .updateUser(this.userForm.value, this.userId)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.openDialog(
            "Edytuj użytkownika",
            "Użytkownik zaktualizowany pomyślnie."
          )
        )
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(["app/users"]);
          }
        },
        error: () =>
          this.openDialog(
            "Edytuj użytkownika",
            "Nie udało się edytować użytkownika. Ponów próbę."
          ),
      });
  }

  private matchPasswords(
    controlName: string,
    confirmName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(controlName);
      const confirm = control.get(confirmName);

      if (!password?.value || !confirm?.value) {
        return null;
      }

      if (password.value !== confirm.value) {
        confirm.setErrors({ mustMatch: true });
      } else {
        confirm.setErrors(null);
      }

      return null;
    };
  }

  private isUsernameTaken(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;

      if (!username) {
        return null;
      }

      if (!this.isAddMode) {
        const usernameEdit = this.users.find(
          (user) => user.id === Number(this.userId)
        )?.username;
        if (username === usernameEdit) return null;
      }

      const exists = this.users.find((user) => user.username === username);

      if (exists) {
        return { usernameTaken: true };
      }

      return null;
    };
  }

  private isEmailTaken(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;

      if (!email) {
        return null;
      }

      /* If this editing mode shows no errors - a email exists for the currently edited user. 
            Only omit the current email, otherwise show an error  */
      if (!this.isAddMode) {
        const emailEdit = this.users.find(
          (user) => user.id === Number(this.userId)
        )?.email;
        if (email === emailEdit) return null;
      }

      const exists = this.users.find((user) => user.email === email);
      if (exists) {
        return { emailTaken: true };
      }

      return null;
    };
  }
}
