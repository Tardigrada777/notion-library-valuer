import PersistentCache from 'persistent-cache';

export const cache = new PersistentCache({
  duration: 1000 * 60 * 5,
  base: '.cache',
  name: 'isbn',
});
