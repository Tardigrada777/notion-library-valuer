import { loadRows, setBookPrice } from '../lib/notion.js';
import { getBookAverageMarketPrice } from '../lib/web.js';
import { getOrThrow } from '../lib/config.js';
import CliProgress, { Presets } from 'cli-progress';

const progress = new CliProgress.SingleBar({}, Presets.shades_classic);

const main = async () => {
  const id = getOrThrow('NOTION_DB_ID');

  console.info('Loading db rows...');
  const rows = await loadRows(id);

  console.info('Finding price and updating db records...');
  progress.start(rows.length);
  let currentRow = 0;

  // for each row in table
  // get isbn and pubDate
  for await (const row of rows) {
    // load actual average price
    const price = await getBookAverageMarketPrice(row.isbn, new Date(row.pubYear, 1));
    
    await setBookPrice(row.pageId, price);

    // update progress
    currentRow += 1;
    progress.update(currentRow);
  }

  progress.stop();
};

main();
