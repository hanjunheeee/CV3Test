import * as cheerio from 'cheerio';

export function parsePage(html, sourceUrl) {
  const $ = cheerio.load(html);

  // TODO: 크롤링 대상 사이트에 맞게 파싱 로직 수정
  const items = [];

  $('body').find('h1, h2, p').each((_, element) => {
    const title = $(element).text().trim();
    if (!title) return;

    items.push({
      title: title.slice(0, 255),
      content: title,
      sourceUrl,
    });
  });

  return items.slice(0, 10);
}
