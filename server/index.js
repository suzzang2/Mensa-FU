require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

// ✨ DeepL 패키지 설정
const deepl = require('deepl-node');
const authKey = process.env.DEEPL_AUTH_KEY;
const translator = new deepl.Translator(authKey);

const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// 캐시 설정
const CACHE_FILE = path.join(__dirname, 'translation-cache.json');
let translationCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (err) { console.error('캐시 로드 에러:', err); }
}
const saveCache = () => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf8');
};

const refineTranslation = (text) => {
  return text.replace(/와 함께/g, '를 곁들인').replace(/소스와 함께/g, '소스를 끼얹은').trim();
};

// API 엔드포인트: 파라미터 없이 무조건 "오늘" 데이터만 가져오기
app.get('/api/menu', async (req, res) => {
  try {
    console.log('📡 오늘 하루 치 메뉴 수집 시작...');

    const params = new URLSearchParams();
    params.append('resources_id', '322'); 

    const targetUrl = 'https://www.stw.berlin/xhr/speiseplan-wochentag.html';
    const { data } = await axios.post(targetUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const rawItems = $('.splMeal');
    
    // ✨ 1단계: 번역이 필요한 새로운 메뉴들만 모아둘 배열 만들기
    const textsToTranslate = [];
    const parsedItems = []; // 파싱된 원본 데이터를 임시 저장

    if (rawItems.length > 0) {
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
          // 캐시에 없는 단어라면 번역 대기열 배열에 추가!
          if (!translationCache[name] && !textsToTranslate.includes(name)) {
            textsToTranslate.push(name);
          }

          parsedItems.push({
            id: `meal-today-${index}`, 
            originalName: name, // 원본 독일어
            category,
            priceStudent: price,
            isVegan,
            nutritionIcon,
            co2Icon,
            h2oIcon
          });
        }
      }
    }

    // ✨ 2단계: 번역 대기열에 모인 단어들을 "한 번에" 통째로 DeepL에 보내기
    if (textsToTranslate.length > 0) {
      console.log(`🚀 DeepL 대량 번역 요청 중... (총 ${textsToTranslate.length}개)`);
      try {
        // 배열을 통째로 보내면 DeepL이 배열로 돌려줍니다.
        const results = await translator.translateText(textsToTranslate, 'de', 'ko');
        const translatedArray = Array.isArray(results) ? results : [results];

        // 받아온 번역 결과를 캐시에 한꺼번에 저장
        textsToTranslate.forEach((originalText, idx) => {
          translationCache[originalText] = refineTranslation(translatedArray[idx].text);
        });
        saveCache();
        console.log('✅ 대량 번역 완료 및 캐시 저장 성공!');
      } catch (err) {
        console.error('❌ DeepL 대량 번역 실패:', err.message);
      }
    }

    // ✨ 3단계: 완성된 캐시를 바탕으로 최종 프론트엔드용 배열 완성하기
    const dayMenu = parsedItems.map(item => {
      return {
        ...item,
        // 캐시에 있으면 한국어, 없으면(에러 났으면) 원래 독일어
        name: translationCache[item.originalName] || item.originalName 
      };
    });

    console.log('✅ 오늘 치 메뉴 수집 완료!');
    res.json(dayMenu); 

  } catch (error) {
    console.error('Scraping Error:', error.message);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다!`);
});