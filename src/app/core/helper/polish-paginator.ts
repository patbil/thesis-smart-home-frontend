import { MatPaginatorIntl } from "@angular/material/paginator";

const polishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0  z ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} z ${length}`;
};

export function getPolishPaginatorIntl() {
  const paginator = new MatPaginatorIntl();

  paginator.itemsPerPageLabel = "Rekordów na stronie:";
  paginator.nextPageLabel = "Następna strona";
  paginator.previousPageLabel = "Poprzednia strona";
  paginator.lastPageLabel = "Ostatnia strona";
  paginator.getRangeLabel = polishRangeLabel;

  return paginator;
}
