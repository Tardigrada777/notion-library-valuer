export const averagePrice = (prices = []) => {
  return prices.reduce((avg, i, _, { length }) => avg + i / length, 0);
};
