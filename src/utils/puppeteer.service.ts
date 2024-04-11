import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async getSearchContent(keyword: string): Promise<any[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'font' || req.resourceType() === 'image') {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(
      `http://korean.visitkorea.or.kr/search/search_list.do?keyword=${keyword}`,
      { waitUntil: 'networkidle2' },
    );

    const specificContent = await page.$$eval('.search_info_list', (divs) =>
      divs.map((div) => div.innerHTML),
    );

    const extractedData = await page.evaluate((content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const data = [];
      const items = doc.querySelectorAll('.cont');
      items.forEach((item) => {
        const placeName = (
          item.querySelector('.tit a') as HTMLElement
        ).innerText.trim();
        const tags = Array.from(item.querySelectorAll('.tag span')).map((tag) =>
          (tag as HTMLElement).innerText.trim().substring(1),
        );
        if (placeName === keyword) {
          data.push({ placeName, tags });
        }
      });
      return data;
    }, specificContent[0]);

    await browser.close();
    return extractedData;
  }
}
