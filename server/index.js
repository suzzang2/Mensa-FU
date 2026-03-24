const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { translate } = require('@vitalets/google-translate-api');

const app = express();
const PORT = 4000;

app.use(cors());

// ✨ 독일어 메뉴명을 자연스러운 한국어로 다듬는 함수
const refineTranslation = (text) => {
  return text
    .replace(/와 함께/g, '를 곁들인')
    .replace(/소스와 함께/g, '소스를 끼얹은')
    .replace(/에/g, '를 넣은')
    .replace(/스타일/g, '식')
    .replace(/유형/g, '풍')
    .trim();
};

app.get('/api/menu', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const targetUrl = 'https://www.stw.berlin/mensen/einrichtungen/freie-universit%C3%A4t-berlin/mensa-fu-ii.html';
    
    const { data } = await axios.get(targetUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    const $ = cheerio.load(data);
    const rawItems = $('.splMeal');
    const menuPromises = [];

    rawItems.each((index, element) => {
      let name = $(element).find('.col-xs-6.col-md-5 span.bold').text().trim();
      if (!name) name = $(element).find('span.bold').first().text().trim();

      const category = $(element).closest('.splGroupWrapper').find('.splGroup').text().trim() || 'Speisen';
      const priceRaw = $(element).find('.text-right').text().trim();
      const studentPriceMatch = priceRaw.match(/\d+[.,]\d+/);
      const price = studentPriceMatch ? parseFloat(studentPriceMatch[0].replace(',', '.')) : 0;

      const htmlContent = $(element).html();
      const isVegan = htmlContent.includes('15.png') || name.toLowerCase().includes('vegan');

      const ampelMatch = htmlContent.match(/ampel_[^"']+/);
      const nutritionIcon = ampelMatch ? ampelMatch[0] : null;

      const co2Match = htmlContent.match(/CO2_bewertung_[A-D]\.svg/);
      const co2Icon = co2Match && co2Match[0] !== 'CO2_bewertung_D.svg' ? co2Match[0] : null;

      const h2oMatch = htmlContent.match(/H2O_bewertung_[A-C]\.svg/);
      const h2oIcon = h2oMatch ? h2oMatch[0] : null;

      if (name && name.length > 1) {
        // ✨ 번역 프로세스를 프로미스 배열에 담음
        const menuPromise = (async () => {
          try {
            const translation = await translate(name, { from: 'de', to: 'ko' });
            return {
              id: `meal-${index}`,
              name: refineTranslation(translation.text), // 자연스러운 번역 처리
              originalName: name, // 원문도 함께 보냄 (디버깅용)
              category,
              priceStudent: price,
              isVegan,
              nutritionIcon,
              co2Icon,
              h2oIcon
            };
          } catch (err) {
            return { id: `meal-${index}`, name, category, priceStudent: price, isVegan, nutritionIcon, co2Icon, h2oIcon };
          }
        })();
        menuPromises.push(menuPromise);
      }
    });

    // ✨ 모든 메뉴 번역이 완료될 때까지 기다림
    const menu = await Promise.all(menuPromises);
    console.log(`성공적으로 ${menu.length}개의 메뉴를 번역 및 파싱했습니다.`);

    res.json(menu);
  } catch (error) {
    console.error('Scraping/Translation Error:', error.message);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});