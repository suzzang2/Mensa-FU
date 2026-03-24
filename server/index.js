const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/api/menu', async (req, res) => {
  // 브라우저가 캐시를 사용하지 않도록 강제 설정 (304 방지)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const targetUrl = 'https://www.stw.berlin/mensen/einrichtungen/freie-universit%C3%A4t-berlin/mensa-fu-ii.html';
    
    const { data } = await axios.get(targetUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7' // 독일어 우선 요청
      }
    });
    
    const $ = cheerio.load(data);
    const menu = [];

    // 클래스명이 혹시 다를 경우를 대비해 더 넓은 범위로 탐색
    // .splMeal 이라는 클래스가 소스에 있는지 확인하는 것이 핵심
    const items = $('.splMeal');
    console.log(`발견된 메뉴 개수: ${items.length}`); // 서버 터미널에 출력됨

    // index.js의 items.each 부분을 이 코드로 완전히 교체하세요.
items.each((index, element) => {
  // 1. 이름 찾기: .col-xs-6.col-md-5 클래스 안의 span.bold를 정확히 조준
  let name = $(element).find('.col-xs-6.col-md-5 span.bold').text().trim();
  
  // 만약 못 찾으면 element 내부의 모든 span.bold를 뒤짐
  if (!name) {
    name = $(element).find('span.bold').first().text().trim();
  }

  // 2. 카테고리 찾기: 상위 그룹의 텍스트 추출
  const category = $(element).closest('.splGroupWrapper').find('.splGroup').text().trim() || 'Speisen';

  // 3. 가격 찾기: .text-right 안의 첫 번째 숫자 세트 (€ 3,95/4,35/4,75 -> 3.95)
  const priceRaw = $(element).find('.text-right').text().trim();
  const studentPriceMatch = priceRaw.match(/\d+[.,]\d+/);
  const price = studentPriceMatch ? parseFloat(studentPriceMatch[0].replace(',', '.')) : 0;

  // 4. 비건 여부: img src에 15.png가 포함되어 있는지 확인
  const isVegan = $(element).find('img[src*="15.png"]').length > 0 || 
                   name.toLowerCase().includes('vegan');

const htmlContent = $(element).html();
// 1. 영양 신호등 파일명 추출 (예: ampel_gruen_70x65.png)
  const ampelMatch = htmlContent.match(/ampel_[^"']+/);
  const nutritionLevel = ampelMatch ? ampelMatch[0] : null;

  // 2. CO2 등급 파일명 추출 (예: CO2_bewertung_A.svg)
  const co2Match = htmlContent.match(/CO2_bewertung_[A-D]\.svg/);
  const co2Level = co2Match ? co2Match[0] : null;

  // 3. H2O 등급 파일명 추출 (예: H2O_bewertung_A.svg)
  const h2oMatch = htmlContent.match(/H2O_bewertung_[A-C]\.svg/);
  const h2oLevel = h2oMatch ? h2oMatch[0] : null;

  // 디버깅 로그 (이제 이름이 잘 찍힐 겁니다!)
  console.log(`[메뉴 ${index}] 이름: ${name || '실패'}, 가격: ${price}, 비건: ${isVegan}`, `영양: ${nutritionLevel || '없음'}`, `CO2: ${co2Level || '없음'}`, `H2O: ${h2oLevel || '없음'}`);

  if (name && name.length > 1) {
    menu.push({
      id: `meal-${index}`,
      name,
      category,
      priceStudent: price,
      isVegan,
        nutritionIcon: nutritionLevel, 
        co2Icon: co2Level,
        h2oIcon: h2oLevel
    });
  }
});

    if (menu.length === 0) {
      console.log("HTML을 가져왔으나 메뉴 파싱에 실패했습니다. HTML 구조를 점검하세요.");
    }

    res.json(menu);
  } catch (error) {
    console.error('Scraping Error:', error.message);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});