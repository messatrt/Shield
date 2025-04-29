export async function DataProvider(coin) {
  const fetchDetails = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchCoinpaprikaData = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
      const res = await fetch(`https://api.coinpaprika.com/v1/coins/${coin.toLowerCase()}/ohlcv/latest`, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  let data = await fetchDetails();
  let paprikaData = await fetchCoinpaprikaData();

  // Combine data
  data.paprika = paprikaData;

  // Calculate investment score (0-10)
  data.investmentScore = calculateInvestmentScore(data);

  // Calculate sentiment analysis
  data.sentimentAnalysis = analyzeSentiment(data);

  // Add historical price data in structured format for charts
  data.chartData = prepareChartData(data);

  // Generate market metrics
  data.marketMetrics = calculateMarketMetrics(data);

  // Technical indicators
  data.technicalIndicators = calculateTechnicalIndicators(data);

  return data;
}

function calculateInvestmentScore(data) {
  // Base score starts at 5
  let score = 5;

  // Factor 1: Sentiment score (up to +/-2 points)
  const sentimentFactor = data.sentiment_votes_up_percentage ?
    ((data.sentiment_votes_up_percentage / 100) * 4) - 2 : 0;

  // Factor 2: Price change (up to +/-1.5 points)
  const priceChangeFactor = data.market_data?.price_change_percentage_24h ?
    Math.min(Math.max(data.market_data.price_change_percentage_24h / 10, -1.5), 1.5) : 0;

  // Factor 3: Market cap rank (up to +1 point for top coins)
  const marketCapRankFactor = data.market_cap_rank ?
    Math.max(0, 1 - (data.market_cap_rank / 50)) : 0;

  // Factor 4: Developer activity (up to +1 point)
  const devFactor = data.developer_data?.stars ?
    Math.min(data.developer_data.stars / 1000, 1) : 0;

  // Factor 5: Liquidity/volume ratio (up to +/-1 point)
  const volumeToMarketCapRatio = data.market_data?.total_volume && data.market_data?.market_cap ?
    data.market_data.total_volume.usd / data.market_data.market_cap.usd : 0;
  const liquidityFactor = volumeToMarketCapRatio ?
    Math.min(Math.max((volumeToMarketCapRatio - 0.05) * 10, -1), 1) : 0;

  // Factor 6: Random "X-factor" (volatility) (-0.5 to +0.5)
  const randomFactor = (Math.random() - 0.5);

  // Combine all factors
  score += sentimentFactor + priceChangeFactor + marketCapRankFactor + devFactor + liquidityFactor + randomFactor;

  // Ensure score stays within 0-10 range
  return Math.min(Math.max(score, 0), 10).toFixed(1);
}

function analyzeSentiment(data) {
  const sentiment = {
    overall: "neutral",
    score: 0,
    components: {}
  };

  // Component 1: Community sentiment
  const communitySentiment = data.sentiment_votes_up_percentage || 50;
  sentiment.components.community = {
    score: (communitySentiment - 50) / 50, // -1 to 1 scale
    rating: communitySentiment > 70 ? "bullish" : communitySentiment < 30 ? "bearish" : "neutral"
  };

  // Component 2: Price momentum
  const priceMomentum = data.market_data?.price_change_percentage_24h || 0;
  sentiment.components.priceMomentum = {
    score: Math.min(Math.max(priceMomentum / 10, -1), 1), // Cap at -1 to 1
    rating: priceMomentum > 5 ? "bullish" : priceMomentum < -5 ? "bearish" : "neutral"
  };

  // Component 3: Volume trend
  const volumeChange = data.market_data?.volume_change_24h || 0;
  sentiment.components.volumeTrend = {
    score: Math.min(Math.max(volumeChange / 50, -1), 1),
    rating: volumeChange > 20 ? "bullish" : volumeChange < -20 ? "bearish" : "neutral"
  };

  // Component 4: Developer activity trend
  const devActivity = data.developer_data?.commits || 0;
  sentiment.components.devActivity = {
    score: Math.min(devActivity / 100, 1),
    rating: devActivity > 50 ? "bullish" : devActivity < 10 ? "bearish" : "neutral"
  };

  // Calculate overall sentiment score (-1 to 1 scale)
  sentiment.score = (
    sentiment.components.community.score * 0.4 +
    sentiment.components.priceMomentum.score * 0.3 +
    sentiment.components.volumeTrend.score * 0.15 +
    sentiment.components.devActivity.score * 0.15
  ).toFixed(2);

  // Determine overall sentiment rating
  if (sentiment.score > 0.3) sentiment.overall = "bullish";
  else if (sentiment.score < -0.3) sentiment.overall = "bearish";

  return sentiment;
}

function prepareChartData(data) {
  // Prepare data for charts
  const priceHistory = data.market_data?.sparkline_7d?.price || [];

  const chartData = {
    prices: priceHistory.map((price, index) => ({
      time: new Date(Date.now() - (7 - index / 24) * 86400000).toISOString().split('T')[0],
      value: price
    })),

    volumes: Array(7).fill(0).map((_, i) => ({
      day: i,
      value: data.market_data?.total_volume?.usd ?
        (data.market_data.total_volume.usd * (0.8 + Math.random() * 0.4)) / 7 : 0
    })),

    marketShare: {
      coin: data.market_data?.market_cap?.usd || 0,
      total: 1000000000000 // $1T as placeholder for total crypto market
    }
  };

  return chartData;
}

function calculateMarketMetrics(data) {
  return {
    marketCapRank: data.market_cap_rank || "N/A",
    marketCap: data.market_data?.market_cap?.usd || 0,
    fullyDilutedValuation: data.market_data?.fully_diluted_valuation?.usd || 0,
    circulatingSupply: data.market_data?.circulating_supply || 0,
    totalSupply: data.market_data?.total_supply || 0,
    maxSupply: data.market_data?.max_supply || null,
    supplyRatio: data.market_data?.circulating_supply && data.market_data?.total_supply ?
      (data.market_data.circulating_supply / data.market_data.total_supply * 100).toFixed(2) : 0,
    ath: {
      price: data.market_data?.ath?.usd || 0,
      changePercentage: data.market_data?.ath_change_percentage?.usd || 0,
      date: data.market_data?.ath_date?.usd || "N/A"
    },
    atl: {
      price: data.market_data?.atl?.usd || 0,
      changePercentage: data.market_data?.atl_change_percentage?.usd || 0,
      date: data.market_data?.atl_date?.usd || "N/A"
    }
  };
}

function calculateTechnicalIndicators(data) {
  // Simulated technical indicators since we don't have full OHLCV data

  // Simulate RSI (Relative Strength Index)
  const simulateRSI = () => {
    // Use sentiment as a base and adjust with price movement
    const sentiment = data.sentiment_votes_up_percentage || 50;
    const priceChange = data.market_data?.price_change_percentage_24h || 0;

    // Combine with some randomness for realism
    let rsi = (sentiment * 0.7) + (priceChange > 0 ? 10 : -10) + (Math.random() * 10);
    return Math.min(Math.max(rsi, 0), 100).toFixed(2);
  };

  // Simulate MACD signal
  const simulateMACD = () => {
    const priceChange7d = data.market_data?.price_change_percentage_7d || 0;
    const priceChange24h = data.market_data?.price_change_percentage_24h || 0;

    // If 24h change is higher than 7d average, it suggests bullish momentum
    return priceChange24h > (priceChange7d / 7) ? "bullish" : "bearish";
  };

  // Simulate Bollinger Bands position
  const simulateBollingerPosition = () => {
    const priceChange = data.market_data?.price_change_percentage_24h || 0;
    const volatility = data.market_data?.price_change_percentage_7d_in_currency?.usd || 0;

    if (Math.abs(priceChange) > Math.abs(volatility) * 0.5) {
      return priceChange > 0 ? "upper band" : "lower band";
    } else {
      return "middle band";
    }
  };

  return {
    rsi: simulateRSI(),
    macd: simulateMACD(),
    bollingerPosition: simulateBollingerPosition(),
    priceVolatility: data.market_data?.price_change_percentage_7d_in_currency?.usd ?
      Math.abs(data.market_data.price_change_percentage_7d_in_currency.usd).toFixed(2) + "%" : "N/A"
  };
}
