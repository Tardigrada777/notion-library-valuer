import { Client } from '@notionhq/client';
import { getOrThrow } from './config.js';

const notion = new Client({
  auth: getOrThrow('NOTION_API_KEY'),
});

export const loadRows = async (db) => {
  if (!db) return [];
  const response = await notion.databases.query({
    database_id: db,
    filter: {
      and: [
        {
          property: 'Synced',
          checkbox: {
            equals: false,
          },
        }
      ]
    }
  });
  const pages = response.results;
  const rows = [];
  for await (const page of pages) {
    const isbnProperty = await notion.pages.properties.retrieve({
      page_id: page.id,
      property_id: page.properties.ISBN.id,
    });
    const pubYearProperty = await notion.pages.properties.retrieve({
      page_id: page.id,
      property_id: page.properties['Год издания'].id,
    });
    rows.push({
      pageId: page.id,
      isbn: isbnProperty.results[0].rich_text.plain_text,
      pubYear: pubYearProperty.number,
    });
  }
  return rows;
};

export const setBookPrice = async (pageId, price) => {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      'Стоимость': {
        number: price,
      },
      Synced: {
        checkbox: true,
      },
    },
  });
};
