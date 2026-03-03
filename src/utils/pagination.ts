export function getPaginationItems(
  totalPages: number,
  currentPage: number,
): Array<number | "…"> {
  return Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(
      (pageNumber) =>
        pageNumber === 1 ||
        pageNumber === totalPages ||
        Math.abs(pageNumber - currentPage) <= 2,
    )
    .reduce<Array<number | "…">>((acc, pageNumber, index, pages) => {
      if (index > 0 && pageNumber - (pages[index - 1] as number) > 1) {
        acc.push("…");
      }
      acc.push(pageNumber);
      return acc;
    }, []);
}
