export function filterWithDefaultsToUrlQuery(filter: Partial<Filter>): string {
  const urlParams = new URLSearchParams();
  const order = filter.order ?? "asc";
  const take = filter.take ? filter.take.toString() : "20";
  const skip = filter.skip ? filter.skip.toString() : "0";

  urlParams.set("order", order);
  filter.search && urlParams.set("search", filter.search);
  urlParams.set("take", take);
  urlParams.set("skip", skip);
  return urlParams.toString();
}
