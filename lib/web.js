import got from 'got';
import { load } from 'cheerio';
import { averagePrice } from './price.js';
import { MIN_BOOK_PRICE, wearByDate } from './book.js';
import { cache } from './cache.js';

const url = (isbn) => {
  return `https://www.findbook.ru/search/d1?isbn=${isbn}&r=0&s=1&viewsize=15&startidx=0`;
}

const searchBook = async (isbn) => {
  const cached = cache.getSync(isbn);
  if (cached) return cached;
  const _url = url(isbn);
  const res = await got(_url);
  cache.putSync(isbn, res.body);
  return cache.getSync(isbn);
};

/**
 * Find the book price in the market by isbn.
 */
const getBookAverageMarketPrice = async (isbn, pubYear = new Date()) => {
  if (!isbn.length) return 0;
  const page = await searchBook(isbn);
  const $ = load(page);
  const table = $('tbody')[13];
  const priceCells = $(table)
    .find(':nth-child(3)')
    .map((_, el) => $(el).text().trimStart().trimEnd())
    .toArray()
  const priceList = priceCells.map((el) => parseInt(el)).filter(Boolean);
  const price = Math.round(averagePrice(priceList));
  const wear = wearByDate(pubYear);
  return Math.round(price * wear) || MIN_BOOK_PRICE;
};

export { getBookAverageMarketPrice };
