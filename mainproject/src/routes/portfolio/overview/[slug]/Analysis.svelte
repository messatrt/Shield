<script>
import { onMount } from 'svelte';

let { coin } = $props();
let analysisData = $state(null);
let loading = $state(true);
let error = $state(false);

// Consolidated mock data
const mockData = {
  sentimentAnalysis: {
    overall: "bullish",
    score: 0.67,
    components: {
      community: { score: 0.8, rating: "bullish" },
      priceMomentum: { score: 0.6, rating: "bullish" },
      volumeTrend: { score: 0.4, rating: "neutral" },
      devActivity: { score: 0.9, rating: "bullish" }
    }
  },
  investmentScore: 7.8,
  technicalIndicators: {
    rsi: 62,
    macd: "bullish",
    bollingerPosition: "middle band",
    priceVolatility: "8.3%"
  },
  marketMetrics: {
    marketCapRank: 4,
    marketCap: 78500000000,
    fullyDilutedValuation: 92300000000,
    ath: { price: 69420, changePercentage: -18.7 },
    circulatingSupply: 19100000,
    supplyRatio: 91,
    maxSupply: 21000000
  },
  suspiciousActivity: {
    percentage: 3.7,
    trend: -0.8,
    breakdown: { wash: 2.1, largeUnknown: 0.9, unusual: 0.7 }
  }
};

// Helper functions
const getColor = (value, type) => {
  if (type === 'sentiment') {
    return value === "bearish" ? "#ef4444" : value === "neutral" ? "#eab308" : "#22c55e";
  } else if (type === 'score') {
    const num = parseFloat(value);
    return num < 3.5 ? "#ef4444" : num < 7 ? "#eab308" : "#22c55e";
  }
  return "#22c55e";
};

onMount(() => {
  try {
    analysisData = mockData;
    console.log("Analysis data loaded");
  } catch (err) {
    console.error("Error loading data:", err);
    error = true;
  } finally {
    loading = false;
  }
});
</script>

<div class="analysis-container">
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Analyzing {coin} data...</p>
    </div>
  {:else if error}
    <div class="error-message">Failed to load analysis data for {coin}. Please try again later.</div>
  {:else if analysisData}
    <!-- Top Cards -->
    <div class="top-cards">
      <!-- Sentiment Analysis Card -->
      <div class="analysis-card">
        <div class="card-header">
          <h3>Sentiment Analysis</h3>
          <div class="badge" style="background-color: {getColor(analysisData.sentimentAnalysis.overall, 'sentiment')}">
            {analysisData.sentimentAnalysis.overall.toUpperCase()}
          </div>
        </div>
        
        <div class="sentiment-score">
          <div class="score-gauge">
            <div class="gauge-value" style="transform: rotate({(analysisData.sentimentAnalysis.score * 90) + 90}deg)"></div>
          </div>
          <div class="score-value">{(analysisData.sentimentAnalysis.score * 100).toFixed(0)}%</div>
        </div>
        
        <div class="sentiment-components">
          {#each Object.entries(analysisData.sentimentAnalysis.components) as [name, data]}
            <div class="component">
              <div class="component-label">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
              <div class="progress-bar">
                <div class="progress" style="width: {data.score * 100}%; background-color: {getColor(data.rating, 'sentiment')}"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Suspicious Activity Card -->
      <div class="analysis-card">
        <div class="card-header">
          <h3>Suspicious Activity</h3>
          <div class="badge" style="background-color: {analysisData.suspiciousActivity.percentage > 5 ? '#ef4444' : '#22c55e'}">
            {analysisData.suspiciousActivity.percentage > 5 ? 'HIGH' : 'LOW'}
          </div>
        </div>
        
        <div class="suspicious-metrics">
          <div class="metric-circle">
            <svg viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                stroke="#ef4444" stroke-dasharray="{analysisData.suspiciousActivity.percentage}, 100" />
              <text x="18" y="20.35" class="percentage">{analysisData.suspiciousActivity.percentage}%</text>
            </svg>
            <div class="trend {analysisData.suspiciousActivity.trend < 0 ? 'positive' : 'negative'}">
              {Math.abs(analysisData.suspiciousActivity.trend)}% {analysisData.suspiciousActivity.trend < 0 ? '↓' : '↑'} from last week
            </div>
          </div>
          
          <div class="breakdown">
            <h4>Activity Breakdown</h4>
            {#each Object.entries(analysisData.suspiciousActivity.breakdown) as [type, value]}
              <div class="breakdown-item">
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <div class="mini-bar">
                  <div class="mini-progress" style="width: {value * 10}%"></div>
                </div>
                <span>{value}%</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Investment Score -->
    <div class="investment-section">
      <div class="investment-score-card">
        <h3>Investment Score</h3>
        <div class="score-display">
          <div class="score-ring">
            <svg viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                stroke={getColor(analysisData.investmentScore, 'score')} stroke-dasharray="{analysisData.investmentScore * 10}, 100" />
              <text x="18" y="20.35" class="score-text">{analysisData.investmentScore}</text>
            </svg>
          </div>
          <div class="score-label">
            <span>out of 10</span>
            <div class="score-rating">
              {analysisData.investmentScore >= 7 ? 'Strong Buy' : analysisData.investmentScore >= 5 ? 'Buy' : analysisData.investmentScore >= 3.5 ? 'Hold' : 'Sell'}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Technical Indicators -->
    <div class="technical-section">
      <h3>Technical Indicators</h3>
      <div class="indicators-grid">
        <!-- RSI Indicator -->
        <div class="indicator-card">
          <div class="indicator-title">RSI (14)</div>
          <div class="indicator-value">{analysisData.technicalIndicators.rsi}</div>
          <div class="indicator-gauge">
            <div class="gauge-bar">
              <div class="gauge-fill" style="width: {analysisData.technicalIndicators.rsi}%;
                background-color: {
                  analysisData.technicalIndicators.rsi > 70 ? '#ef4444' : 
                  analysisData.technicalIndicators.rsi < 30 ? '#ef4444' : '#22c55e'
                }">
              </div>
            </div>
            <div class="gauge-markers">
              <div class="marker" style="left: 30%">30</div>
              <div class="marker" style="left: 50%">50</div>
              <div class="marker" style="left: 70%">70</div>
            </div>
          </div>
          <div class="indicator-status">
            {analysisData.technicalIndicators.rsi > 70 ? 'Overbought' : analysisData.technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'}
          </div>
        </div>
        
        <!-- MACD Indicator -->
        <div class="indicator-card">
          <div class="indicator-title">MACD Signal</div>
          <div class="indicator-value" style="color: {analysisData.technicalIndicators.macd === 'bullish' ? '#22c55e' : '#ef4444'}">
            {analysisData.technicalIndicators.macd.toUpperCase()}
          </div>
          <div class="indicator-visual macd-visual">
            <div class="macd-line" style="transform: translateY({analysisData.technicalIndicators.macd === 'bullish' ? '-5px' : '5px'})"></div>
            <div class="signal-line"></div>
            <div class="histogram-bars">
              {#each Array(8) as _, i}
                {@const isPositive = analysisData.technicalIndicators.macd === 'bullish' ? (i > 3) : (i < 4)}
                <div class="histogram-bar" style="
                  height: {5 + Math.random() * 15}px;
                  background-color: {isPositive ? '#22c55e' : '#ef4444'};
                  transform: translateY({isPositive ? '-100%' : '0'});
                "></div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Market Metrics - Compact Display -->
        <div class="indicator-card">
          <div class="indicator-title">Market Metrics</div>
          <div class="market-quick-stats">
            <div class="quick-stat">
              <span>Market Cap:</span>
              <span class="stat-value">${(analysisData.marketMetrics.marketCap / 1e9).toFixed(2)}B</span>
            </div>
            <div class="quick-stat">
              <span>Rank:</span>
              <span class="stat-value">#{analysisData.marketMetrics.marketCapRank}</span>
            </div>
            <div class="quick-stat">
              <span>Circulating:</span>
              <span class="stat-value">{(analysisData.marketMetrics.circulatingSupply / 1e6).toFixed(2)}M</span>
            </div>
            <div class="quick-stat">
              <span>From ATH:</span>
              <span class="stat-value" style="color: {analysisData.marketMetrics.ath.changePercentage >= 0 ? '#22c55e' : '#ef4444'}">
                {analysisData.marketMetrics.ath.changePercentage}%
              </span>
            </div>
          </div>
          <div class="supply-progress">
            <div class="progress-bar">
              <div class="progress" style="width: {analysisData.marketMetrics.supplyRatio}%; background-color: #8b5cf6;"></div>
            </div>
            <div class="supply-text">{analysisData.marketMetrics.supplyRatio}% of Max Supply</div>
          </div>
        </div>
        
        <!-- Volatility Indicator -->
        <div class="indicator-card">
          <div class="indicator-title">Volatility (7d)</div>
          <div class="indicator-value">{analysisData.technicalIndicators.priceVolatility}</div>
          <div class="indicator-visual volatility-visual">
            {#each Array(20) as _}
              {@const height = 5 + Math.random() * 20}
              <div class="volatility-bar" style="height: {height}px"></div>
            {/each}
          </div>
          <div class="indicator-status">
            {parseFloat(analysisData.technicalIndicators.priceVolatility) > 10 ? 'High' : parseFloat(analysisData.technicalIndicators.priceVolatility) > 5 ? 'Moderate' : 'Low'} Volatility
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="error-message">Failed to load analysis data for {coin}. Please try again later.</div>
  {/if}
</div>

<style>
  .analysis-container {
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Loading & Error States */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
  }
  
  .loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top: 4px solid #8b5cf6;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    text-align: center;
    padding: 40px;
    background-color: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    border-left: 4px solid #ef4444;
    margin: 20px 0;
  }
  
  /* Layout Components */
  .top-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .analysis-card, .investment-score-card, .indicator-card {
    background-color: rgba(30, 41, 59, 0.7);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
  }
  
  /* Sentiment Analysis */
  .sentiment-score {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
  }
  
  .score-gauge {
    width: 80px;
    height: 40px;
    border-radius: 40px 40px 0 0;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    margin-right: 20px;
  }
  
  .gauge-value {
    position: absolute;
    width: 40px;
    height: 80px;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    transform-origin: right center;
    top: 0;
    right: 50%;
  }
  
  .score-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .component {
    margin-bottom: 10px;
  }
  
  .component-label {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
  
  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    border-radius: 4px;
  }
  
  /* Suspicious Activity */
  .suspicious-metrics {
    display: flex;
    justify-content: space-between;
  }
  
  .metric-circle {
    width: 120px;
    text-align: center;
  }
  
  .circle-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 3;
  }
  
  .circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }
  
  .percentage {
    fill: #e2e8f0;
    font-size: 0.4rem;
    text-anchor: middle;
    font-weight: bold;
  }
  
  .trend {
    font-size: 0.75rem;
    margin-top: 10px;
  }
  
  .trend.positive { color: #22c55e; }
  .trend.negative { color: #ef4444; }
  
  .breakdown {
    flex: 1;
    padding-left: 20px;
  }
  
  .breakdown h4 {
    font-size: 0.9rem;
    margin-top: 0;
    margin-bottom: 12px;
  }
  
  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.8rem;
  }
  
  .mini-bar {
    width: 80px;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    margin: 0 10px;
    overflow: hidden;
  }
  
  .mini-progress {
    height: 100%;
    background-color: #ef4444;
    border-radius: 3px;
  }
  
  /* Investment Score */
  .investment-section {
    margin-bottom: 20px;
  }
  
  .score-display {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
  
  .score-ring {
    width: 100px;
    margin-right: 20px;
  }
  
  .score-text {
    fill: #e2e8f0;
    font-size: 0.6rem;
    text-anchor: middle;
    font-weight: bold;
  }
  
  .score-label {
    text-align: center;
  }
  
  .score-label span {
    font-size: 0.85rem;
    opacity: 0.7;
  }
  
  .score-rating {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 5px;
  }
  
  /* Technical Indicators */
  .technical-section {
    margin-bottom: 20px;
  }
  
  .technical-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .indicators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .indicator-title {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 8px;
  }
  
  .indicator-value {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .indicator-gauge {
    margin: 16px 0;
  }
  
  .gauge-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;
  }
  
  .gauge-fill {
    height: 100%;
    border-radius: 4px;
  }
  
  .gauge-markers {
    position: relative;
    height: 16px;
  }
  
  .marker {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .indicator-status {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 12px;
  }
  
  /* MACD Visual */
  .macd-visual {
    height: 60px;
    position: relative;
    margin: 16px 0;
  }
  
  .macd-line, .signal-line {
    position: absolute;
    width: 100%;
    height: 2px;
    top: 50%;
  }
  
  .macd-line {
    background-color: #ec4899;
    transition: transform 0.3s ease;
  }
  
  .signal-line {
    background-color: #8b5cf6;
  }
  
  .histogram-bars {
    position: absolute;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .histogram-bar {
    width: 8px;
    display: inline-block;
  }
  
  /* Volatility Visual */
  .volatility-visual {
    height: 40px;
    display: flex;
    align-items: flex-end;
    margin: 16px 0;
    gap: 2px;
  }
  
  .volatility-bar {
    flex: 1;
    background-color: rgba(236, 72, 153, 0.7);
    border-radius: 2px 2px 0 0;
  }
  
  /* Market Metrics */
  .market-quick-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .quick-stat {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
  }
  
  .stat-value {
    font-weight: 600;
  }
  
  .supply-progress {
    margin-top: 12px;
  }
  
  .supply-text {
    font-size: 0.8rem;
    margin-top: 4px;
    opacity: 0.8;
    text-align: right;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .top-cards {
      grid-template-columns: 1fr;
    }
    
    .suspicious-metrics {
      flex-direction: column;
      align-items: center;
    }
    
    .breakdown {
      padding-left: 0;
      margin-top: 20px;
      width: 100%;
    }
  }
</style>
