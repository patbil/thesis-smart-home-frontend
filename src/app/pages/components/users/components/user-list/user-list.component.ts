import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { first, Subject, takeUntil } from "rxjs";
import { User } from "src/app/core/models/User";
import { UsersService } from "src/app/core/services/users.service";
import { DialogComponent } from "src/app/shared/dialog/dialog.component";

const MAX_WIDTH = "450px";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["../../css/users.module.css"],
})
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dataTable!: MatTableDataSource<User>;
  headTable: string[] = [
    "name",
    "surname",
    "email",
    "username",
    "role",
    "actions",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private userService: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAdd(): void {
    this.router.navigate(["users/add"]);
  }

  onEdit(user: any): void {
    this.router.navigate(["users/modify", user.id]);
  }

  onDelete(user: any): void {
    this.openDialog(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.deleteUser(user.id);
        }
      });
  }

  private getData(): void {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataTable = new MatTableDataSource<User>(res);
        this.dataTable.paginator = this.paginator;
      });
  }

  private openDialog(user: any) {
    return this.dialog
      .open(DialogComponent, {
        maxWidth: MAX_WIDTH,
        data: {
          title: "Usuń użytkownika",
          info: `Czy na pewno chcesz usunąć użytkownika ${
            user.name + " " + user.surname
          }?`,
          delete: true,
        },
      })
      .afterClosed();
  }

  private deleteUser(id: any): void {
    this.userService
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getData();
        },
        error: () => {
          this.dialog.open(DialogComponent, {
            maxWidth: MAX_WIDTH,
            data: {
              title: "Usuń użytkownika",
              info: "Nie udało się usunąć użytkownika. Ponów próbę za chwilę.",
              delete: false,
            },
          });
        },
      });
  }
}
