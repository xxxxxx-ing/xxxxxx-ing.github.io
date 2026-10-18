/**
 * Google Style Start Page Script
 * Functions:
 * 1. Real-time Weather Fetching (Seoul, Jeju) via Open-Meteo API
 * 2. Google Search Input Handling & Clear Button
 * 3. Daily / Random Inspirational Quotes Rotation in Footer
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. Weather Logic (Open-Meteo API - Free, No API Key Required)
  // =========================================================
  const cities = {
    seoul: {
      lat: 37.5665,
      lon: 126.9780,
      name: '서울',
      tempId: 'seoul-temp',
      descId: 'seoul-desc',
      iconId: 'seoul-icon'
    },
    jeju: {
      lat: 33.4996,
      lon: 126.5312,
      name: '제주',
      tempId: 'jeju-temp',
      descId: 'jeju-desc',
      iconId: 'jeju-icon'
    }
  };

  // WMO Weather interpretation code mapping to Korean descriptions and icons
  function getWeatherInfo(code, isDay = 1) {
    switch (code) {
      case 0:
        return { desc: '맑음', icon: isDay ? '☀️' : '🌙' };
      case 1:
        return { desc: '대체로 맑음', icon: '🌤️' };
      case 2:
        return { desc: '부분 흐림', icon: '⛅' };
      case 3:
        return { desc: '흐림', icon: '☁️' };
      case 45:
      case 48:
        return { desc: '안개', icon: '🌫️' };
      case 51:
      case 53:
        return { desc: '이슬비', icon: '🌦️' };
      case 55:
        return { desc: '강한 이슬비', icon: '🌧️' };
      case 61:
      case 63:
        return { desc: '비', icon: '🌧️' };
      case 65:
        return { desc: '강한 비', icon: '⛈️' };
      case 71:
      case 73:
      case 75:
        return { desc: '눈', icon: '❄️' };
      case 77:
        return { desc: '싸락눈', icon: '🌨️' };
      case 80:
      case 81:
      case 82:
        return { desc: '소나기', icon: '🌧️' };
      case 85:
      case 86:
        return { desc: '눈보라', icon: '🌨️' };
      case 95:
      case 96:
      case 99:
        return { desc: '뇌우', icon: '⚡' };
      default:
        return { desc: '구름', icon: '🌥️' };
    }
  }

  async function fetchCityWeather(cityKey) {
    const city = cities[cityKey];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=Asia%2FTokyo`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data && data.current_weather) {
        const rawTemp = data.current_weather.temperature;
        const temp = (Math.round(rawTemp * 10) / 10).toFixed(1);
        const weatherCode = data.current_weather.weathercode;
        const isDay = data.current_weather.is_day;
        const info = getWeatherInfo(weatherCode, isDay);

        const tempElem = document.getElementById(city.tempId);
        const descElem = document.getElementById(city.descId);
        const iconElem = document.getElementById(city.iconId);

        if (tempElem) tempElem.textContent = `${temp}°C`;
        if (descElem) descElem.textContent = info.desc;
        if (iconElem) iconElem.textContent = info.icon;
      }
    } catch (err) {
      console.warn(`Weather fetch failed for ${city.name}:`, err);
      // Fallback default
      const tempElem = document.getElementById(city.tempId);
      const descElem = document.getElementById(city.descId);
      const iconElem = document.getElementById(city.iconId);

      if (tempElem) tempElem.textContent = '25.6°C';
      if (descElem) descElem.textContent = '부분 흐림';
      if (iconElem) iconElem.textContent = '⛅';
    }
  }

  async function updateAllWeather() {
    await Promise.all([
      fetchCityWeather('seoul'),
      fetchCityWeather('jeju')
    ]);
  }

  // Weather card click event (manual refresh)
  const seoulCard = document.getElementById('weather-seoul');
  const jejuCard = document.getElementById('weather-jeju');

  if (seoulCard) seoulCard.addEventListener('click', updateAllWeather);
  if (jejuCard) jejuCard.addEventListener('click', updateAllWeather);

  // Initial weather load & automatic refresh every 30 minutes
  updateAllWeather();
  setInterval(updateAllWeather, 1000 * 60 * 30);


  // =========================================================
  // 2. Google Search & Interaction Logic
  // =========================================================
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-btn');

  if (searchInput && clearBtn) {
    searchInput.addEventListener('input', () => {
      clearBtn.style.display = searchInput.value.trim().length > 0 ? 'flex' : 'none';
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
    });
  }


  // =========================================================
  // 3. Inspirational Quotes Logic (Footer Bar)
  // =========================================================
  const quotes = [
    { text: "삶이 있는 한 희망은 있다.", author: "키케로" },
    { text: "시작하는 방법은 그만 말하고 행동하기 시작하는 것이다.", author: "월트 디즈니" },
    { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤자민 프랭클린" },
    { text: "인생은 자신을 찾는 것이 아니라 자신을 창조하는 것이다.", author: "조지 버나드 쇼" },
    { text: "어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기증세다.", author: "알베르트 아인슈타인" },
    { text: "성공이란 열정을 잃지 않고 실패를 거듭할 수 있는 능력이다.", author: "윈스턴 처칠" },
    { text: "가장 큰 위험은 위험을 감수하지 않는 것이다.", author: "마크 저커버그" },
    { text: "배움에는 끝이 없다. 나이가 들어 배움을 멈추는 것이 아니라 배움을 멈춰서 늙는 것이다.", author: "헨리 포드" },
    { text: "작은 일에 최선을 다하면 큰일도 이룰 수 있다.", author: "공자" },
    { text: "기회는 일어나는 것이 아니라 당신이 만들어내는 것이다.", author: "크리스 그로서" },
    { text: "위대한 일을 해내는 유일한 방법은 당신이 하는 일을 진정 사랑하는 것이다.", author: "스티브 잡스" },
    { text: "바람이 불지 않을 때 바람개비를 돌리는 방법은 앞으로 달려가는 것이다.", author: "데일 카네기" },
    { text: "어둠을 탓하기보다 작은 촛불 하나를 켜는 것이 낫다.", author: "엘리너 루스벨트" },
    { text: "생각하는 대로 살지 않으면 사는 대로 생각하게 된다.", author: "폴 부르제" },
    { text: "천 리 길도 한 걸음부터.", author: "노자" },
    { text: "단 하나의 목표를 향해 나아가는 자는 온 세상이 길을 비켜준다.", author: "랄프 왈도 에머슨" },
    { text: "포기하지 않는 자에게 불가능이란 단어는 없다.", author: "나폴레옹 보나파르트" },
    { text: "지식에 투자하는 것이 항상 최고의 이자를 지불한다.", author: "벤자민 프랭클린" },
    { text: "성공은 매일 반복되는 작은 노력들의 합이다.", author: "로버트 콜리어" },
    { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.", author: "헨리 포드" },
    { text: "미래는 자신의 꿈의 아름다움을 믿는 사람들의 것이다.", author: "엘리너 루스벨트" }
  ];

  let lastQuoteIdx = 0;

  function renderQuote() {
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * quotes.length);
    } while (randIdx === lastQuoteIdx && quotes.length > 1);

    lastQuoteIdx = randIdx;
    const quote = quotes[randIdx];

    const quoteContainer = document.getElementById('footer-quote');
    const textElem = document.getElementById('quote-text');
    const authorElem = document.getElementById('quote-author');

    if (quoteContainer && textElem && authorElem) {
      quoteContainer.style.opacity = '0';

      setTimeout(() => {
        textElem.textContent = `"${quote.text}"`;
        authorElem.textContent = quote.author;
        quoteContainer.style.opacity = '1';
      }, 250);
    }
  }

  const footerQuote = document.getElementById('footer-quote');
  if (footerQuote) {
    footerQuote.addEventListener('click', renderQuote);
  }

  // Change quote automatically every 60 seconds
  setInterval(renderQuote, 60000);
});
