// CoinGecko API integration

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache to prevent hitting rate limits (CoinGecko free tier is ~10-30 req/min)
const cache = {
  prices: { data: null, timestamp: 0 },
  global: { data: null, timestamp: 0 },
  history: {}
};

const CACHE_DURATION = 60000; // 1 minute

export const fetchCryptoPrices = async () => {
  const now = Date.now();
  if (cache.prices.data && (now - cache.prices.timestamp < CACHE_DURATION)) {
    return cache.prices.data;
  }

  try {
    // Fetch top 3 cryptos for dashboard: bitcoin, ethereum, solana
    const response = await fetch(`${BASE_URL}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
    const data = await response.json();
    
    cache.prices = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    // Return mock data fallback if API fails
    return {
      bitcoin: { usd: 65000, usd_24h_change: 2.5, usd_market_cap: 1200000000000 },
      ethereum: { usd: 3500, usd_24h_change: 1.2, usd_market_cap: 400000000000 },
      solana: { usd: 145, usd_24h_change: -0.5, usd_market_cap: 65000000000 }
    };
  }
};

export const fetchGlobalStats = async () => {
  const now = Date.now();
  if (cache.global.data && (now - cache.global.timestamp < CACHE_DURATION * 5)) { // cache global for 5 mins
    return cache.global.data;
  }

  try {
    const response = await fetch(`${BASE_URL}/global`);
    const data = await response.json();
    
    cache.global = { data: data.data, timestamp: now };
    return data.data;
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return null;
  }
};

// Fetch historical market chart data for Analytics
export const fetchHistoricalData = async (coinId = 'bitcoin', days = 30) => {
  const cacheKey = `${coinId}-${days}`;
  const now = Date.now();
  
  if (cache.history[cacheKey] && (now - cache.history[cacheKey].timestamp < CACHE_DURATION * 5)) {
    return cache.history[cacheKey].data;
  }

  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const data = await response.json();
    
    // Format for Recharts
    const formattedData = data.prices.map(price => ({
      timestamp: price[0],
      value: price[1]
    }));
    
    cache.history[cacheKey] = { data: formattedData, timestamp: now };
    return formattedData;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return [];
  }
};
