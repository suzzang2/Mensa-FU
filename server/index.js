const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { translate } = require('@vitalets/google-translate-api');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());

// ✨ 캐시 파일 경로 및 초기 로드 로직
const CACHE_FILE = path.join(__dirname, 'translation-cache.json');
let translationCache = {};

// 서버 시작 시 캐시 파일이 있으면 읽어오기
if (fs.existsSync(CACHE_FILE)) {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    translationCache = JSON.parse(data);
    console.log('✅ 기존 번역 캐시를 성공적으로 불러왔습니다.');
  } catch (err) {
    console.error('❌ 캐시 파일 로드 에러:', err);
  }
}

// ✨ 캐시 저장 함수
const saveCache = () => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ 캐시 저장 실패:', err);
  }
};

// ✨ 번역 다듬기 함수
const refineTranslation = (text) => {
  return text
    .replace(/와 함께/g, '를 곁들인')
    .replace(/소스와 함께/g, '소스를 끼얹은')
    .replace(/에/g, '를 넣은')
    .replace(/스타일/g, '식')
    .replace(/유형/g, '풍')
    .trim();
};

// ✨ 대기 함수 (Rate Limit 우회용)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    const menu = [];

    console.log(`총 ${rawItems.length}개의 메뉴를 파싱 및 번역합니다...`);

    // ✨ Promise.all 대신 for문으로 순차 처리
    for (let index = 0; index < rawItems.length; index++) {
      const element = rawItems[index];
      
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
        // ✨ 1. 캐시에 이미 번역본이 있는지 확인
        if (translationCache[name]) {
          menu.push({
            id: `meal-${index}`,
            name: translationCache[name],
            originalName: name,
            category,
            priceStudent: price,
            isVegan,
            nutritionIcon,
            co2Icon,
            h2oIcon
          });
        } else {
          // ✨ 2. 캐시에 없으면 구글 번역 호출 (Delay 추가)
          try {
            console.log(`📡 신규 번역 요청 (${index + 1}/${rawItems.length}): ${name}`);
            
            // 구글의 의심을 피하기 위해 0.5~0.8초 랜덤 대기
            await delay(Math.floor(Math.random() * 300) + 500); 
            
            const translation = await translate(name, { from: 'de', to: 'ko' });
            const refined = refineTranslation(translation.text);
            
            // 캐시에 저장 및 파일 업데이트
            translationCache[name] = refined;
            saveCache(); 

            menu.push({
              id: `meal-${index}`,
              name: refined,
              originalName: name,
              category,
              priceStudent: price,
              isVegan,
              nutritionIcon,
              co2Icon,
              h2oIcon
            });
          } catch (err) {
            console.error(`❌ 번역 실패 (${name}):`, err.message);
            // 번역 실패 시 원문을 넣음
            menu.push({ 
              id: `meal-${index}`, 
              name: name, 
              originalName: name, 
              category, 
              priceStudent: price, 
              isVegan, 
              nutritionIcon, 
              co2Icon, 
              h2oIcon 
            });
            
            // ✨ 에러(429 등) 발생 시 더 길게(5초) 휴식
            if (err.message.includes('429')) {
              console.log('⚠️ 429 에러 감지: 5초간 대기합니다...');
              await delay(5000);
            }
          }
        }
      }
    }

    console.log('✅ 모든 처리가 완료되었습니다.');
    res.json(menu);
  } catch (error) {
    console.error('Scraping Error:', error.message);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});