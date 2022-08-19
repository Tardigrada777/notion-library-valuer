/**
 * The price of book if there is no data about isbn on market.
 */
export const MIN_BOOK_PRICE = 100;

/**
 * The min wear value that applied to each bought book by default.
 */
const DEFAULT_WEAR = 0.3;

/**
 * Wear percent decreased each year.
 */
const WEAR_EACH_YEAR = 0.01;

/**
 * Calculates wear for book.
 */
export const wearByDate = (pubDate) => {
  const yearsFromPub = new Date().getFullYear() - new Date(pubDate).getFullYear();
  // each year equal -0.01 + default wear equal 0.3
  return 1 - DEFAULT_WEAR - yearsFromPub * WEAR_EACH_YEAR;
};
