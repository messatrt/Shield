<script>
import { DataProvider } from "$lib/utils/analysis.js"
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  
  // Props
  let { data } = $props();
  
  // Local state
  let coinData = $state();
  let loading = $state(true);
  let error = $state();
  
  // Animation values
  const scoreAnimation = tweened(0, {
    duration: 2000,
    easing: cubicOut
  });
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A";
    
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    if (!value && value !== 0) return "N/A";
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };
  
  // Get color based on value (for percentages)
  const getValueColor = (value) => {
    if (!value && value !== 0) return "#e2e8f0";
    return value > 0 ? "#10b981" : value < 0 ? "#ef4444" : "#e2e8f0";
  };
  
  // Get investment score color
  const getScoreColor = (score) => {
    if (score >= 7.5) return "#10b981";
    if (score >= 5) return "#f59e0b";
    return "#ef4444";
  };
  
  // Simple SVG progress bar component
  const ProgressBar = (value, max, width, height, color) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" rx="${height/2}" fill="rgba(255,255,255,0.1)" />
        <rect width="${(percentage/100) * width}" height="${height}" rx="${height/2}" fill="${color}" />
      </svg>
    `;
  };
  
  // Create SVG sparkline chart
  const createSparkline = (data, width, height, color) => {
    if (!data || data.length === 0) return "";
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    let points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
    
    // Add gradient
    const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(2, 9)}`;
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.5" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </linearGradient>
        </defs>
        
        <polyline
          fill="none"
          stroke="${color}"
          stroke-width="2"
          points="${points}"
        />
        
        <polygon
          fill="url(#${gradientId})"
          points="0,${height} ${points} ${width},${height}"
          opacity="0.3"
        />
      </svg>
    `;
  };
  
  // Create donut chart
  const createDonutChart = (value, max, radius, strokeWidth, color) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return `
      <svg width="${(radius + strokeWidth) * 2}" height="${(radius + strokeWidth) * 2}" viewBox="0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}">
        <circle
          cx="${radius + strokeWidth}"
          cy="${radius + strokeWidth}"
          r="${radius}"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="${strokeWidth}"
        />
        <circle
          cx="${radius + strokeWidth}"
          cy="${radius + strokeWidth}"
          r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})"
          stroke-linecap="round"
        />
        <text
          x="${radius + strokeWidth}"
          y="${radius + strokeWidth}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#e2e8f0"
          font-size="${radius / 2}"
          font-weight="bold"
        >${percentage.toFixed(0)}%</text>
      </svg>
    `;
  };
  
  // Load data
  onMount(async () => {
    try {
      coinData = await DataProvider(data.coin);
      scoreAnimation.set(parseFloat(coinData.investmentScore));
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });
</script>
{#if loading}
  <div class="crypto-loading">
    <div class="pulse"></div>
    <p>Loading {data.coin} data...</p>
  </div>
{:else if error}
  <div class="crypto-error">
    <h2>Error loading data</h2>
    <p>{error}</p>
  </div>
{:else}
  <div class="crypto-dashboard">
    <!-- Header Section -->
    <div class="crypto-header">
      <div class="crypto-basic-info">
        <div class="crypto-image">
          {#if coinData.image?.large}
            <img src={coinData.image.large} alt={coinData.name} />
          {:else}
            <div class="crypto-image-placeholder">{coinData.symbol?.toUpperCase().slice(0, 2)}</div>
          {/if}
        </div>
        <div class="crypto-name-container">
          <h1 class="crypto-name">{coinData.name} <span class="crypto-symbol">({coinData.symbol?.toUpperCase()})</span></h1>
          <div class="crypto-rank">Rank #{coinData.market_cap_rank || 'N/A'}</div>
        </div>
      </div>
      
      <div class="crypto-price-container">
        <div class="crypto-price">
          <div class="current-price">{coinData.market_data?.current_price?.usd ? `$${coinData.market_data.current_price.usd.toLocaleString()}` : 'N/A'}</div>
          <div class="price-change" style="color: {getValueColor(coinData.market_data?.price_change_percentage_24h)}">
            {formatPercentage(coinData.market_data?.price_change_percentage_24h || 0)} (24h)
          </div>
        </div>
      </div>
    </div>
    
    <!-- Investment Score Section -->
    <div class="investment-score-section">
      <div class="score-card">
        <h2>Investment Score</h2>
        <div class="score-container">
          <div class="score-gauge">
            {@html createDonutChart($scoreAnimation, 10, 60, 12, getScoreColor($scoreAnimation))}
          </div>
          <div class="score-details">
            <div class="score-value" style="color: {getScoreColor($scoreAnimation)}">
              {$scoreAnimation.toFixed(1)}<span class="score-max">/10</span>
            </div>
            <div class="score-label">
              {#if $scoreAnimation >= 7.5}
                Strong Buy
              {:else if $scoreAnimation >= 6}
                Buy
              {:else if $scoreAnimation >= 5}
                Hold
              {:else if $scoreAnimation >= 3.5}
                Sell
              {:else}
                Strong Sell
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      <div class="sentiment-card">
        <h2>Market Sentiment</h2>
        <div class="sentiment-details">
          <div class="sentiment-gauge">
            {@html createDonutChart(coinData.sentiment_votes_up_percentage || 50, 100, 50, 10, 
              coinData.sentiment_votes_up_percentage > 60 ? "#10b981" : 
              coinData.sentiment_votes_up_percentage < 40 ? "#ef4444" : "#f59e0b")}
          </div>
          <div class="sentiment-breakdown">
            <div class="sentiment-item">
              <span class="sentiment-label">Positive</span>
              <div class="sentiment-bar-container">
                {@html ProgressBar(coinData.sentiment_votes_up_percentage || 0, 100, 120, 8, "#10b981")}
              </div>
              <span class="sentiment-value">{coinData.sentiment_votes_up_percentage?.toFixed(1) || 0}%</span>
            </div>
            <div class="sentiment-item">
              <span class="sentiment-label">Negative</span>
              <div class="sentiment-bar-container">
                {@html ProgressBar(coinData.sentiment_votes_down_percentage || 0, 100, 120, 8, "#ef4444")}
              </div>
              <span class="sentiment-value">{coinData.sentiment_votes_down_percentage?.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>
        <div class="sentiment-analysis">
          <div class="sentiment-overall" 
            style="color: {coinData.sentimentAnalysis.overall === 'positive' ? '#10b981' : 
                         coinData.sentimentAnalysis.overall === 'negative' ? '#ef4444' : '#e2e8f0'}">
            {coinData.sentimentAnalysis.overall.toUpperCase()} 
            ({coinData.sentimentAnalysis.score > 0 ? "+" : ""}{coinData.sentimentAnalysis.score})
          </div>
        </div>
      </div>
      
      
    </div>
    
    <!-- Detailed Stats Section -->
    <div class="detailed-stats-section">
      <h2 class="section-title">Detailed Analysis</h2>
      
      <div class="stats-grid">
        <!-- Market Data Card -->
        <div class="stats-card">
          <h3>Market Data</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">Market Cap</span>
              <span class="stat-value">{formatCurrency(coinData.marketMetrics.marketCap)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">24h Volume</span>
              <span class="stat-value">{formatCurrency(coinData.market_data?.total_volume?.usd)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Fully Diluted Val.</span>
              <span class="stat-value">{formatCurrency(coinData.marketMetrics.fullyDilutedValuation)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Circ. Supply</span>
              <span class="stat-value">{coinData.marketMetrics.circulatingSupply?.toLocaleString()} {coinData.symbol?.toUpperCase()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Total Supply</span>
              <span class="stat-value">{coinData.marketMetrics.totalSupply?.toLocaleString() || 'Unlimited'} {coinData.symbol?.toUpperCase()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Max Supply</span>
              <span class="stat-value">{coinData.marketMetrics.maxSupply?.toLocaleString() || 'Unlimited'} {coinData.symbol?.toUpperCase()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Supply Ratio</span>
              <div class="stat-bar">
                {@html ProgressBar(coinData.marketMetrics.supplyRatio, 100, 150, 6, "#6366f1")}
                <span class="stat-bar-value">{coinData.marketMetrics.supplyRatio}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Price History Card -->
        <div class="stats-card">
          <h3>Price History</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">All-Time High</span>
              <span class="stat-value">{formatCurrency(coinData.marketMetrics.ath.price)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">ATH Change</span>
              <span class="stat-value" style="color: {getValueColor(coinData.marketMetrics.ath.changePercentage)}">
                {formatPercentage(coinData.marketMetrics.ath.changePercentage)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">ATH Date</span>
              <span class="stat-value">{new Date(coinData.marketMetrics.ath.date).toLocaleDateString() || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">All-Time Low</span>
              <span class="stat-value">{formatCurrency(coinData.marketMetrics.atl.price)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">ATL Change</span>
              <span class="stat-value" style="color: {getValueColor(coinData.marketMetrics.atl.changePercentage)}">
                {formatPercentage(coinData.marketMetrics.atl.changePercentage)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">ATL Date</span>
              <span class="stat-value">{new Date(coinData.marketMetrics.atl.date).toLocaleDateString() || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <!-- Technical Indicators Card -->
        <div class="stats-card">
          <h3>Technical Indicators</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">RSI (14)</span>
              <div class="stat-bar">
                {@html ProgressBar(coinData.technicalIndicators.rsi, 100, 150, 6, 
                    coinData.technicalIndicators.rsi > 70 ? "#ef4444" : 
                    coinData.technicalIndicators.rsi < 30 ? "#10b981" : "#f59e0b")}
                <span class="stat-bar-value">{coinData.technicalIndicators.rsi}</span>
              </div>
            </div>
            <div class="stat-row">
              <span class="stat-name">MACD Signal</span>
              <span class="stat-value" style="color: {
                coinData.technicalIndicators.macd === 'positive' ? '#10b981' : '#ef4444'
              }">
                {coinData.technicalIndicators.macd.toUpperCase()}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Bollinger Bands</span>
              <span class="stat-value">{coinData.technicalIndicators.bollingerPosition}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">7d Volatility</span>
              <span class="stat-value">{coinData.technicalIndicators.priceVolatility}</span>
            </div>
          </div>
        </div>
        
        <!-- Developer Data Card -->
        <div class="stats-card">
          <h3>Developer Activity</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">Github Stars</span>
              <span class="stat-value">{coinData.developer_data?.stars || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Subscribers</span>
              <span class="stat-value">{coinData.developer_data?.subscribers || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Total Issues</span>
              <span class="stat-value">{coinData.developer_data?.total_issues || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Closed Issues</span>
              <span class="stat-value">{coinData.developer_data?.closed_issues || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Pull Requests Merged</span>
              <span class="stat-value">{coinData.developer_data?.pull_requests_merged || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Contributors</span>
              <span class="stat-value">{coinData.developer_data?.contributors || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Commit Count (4w)</span>
              <span class="stat-value">{coinData.developer_data?.commit_count_4_weeks || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <!-- Community Data Card -->
        <div class="stats-card">
          <h3>Community Data</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">Twitter Followers</span>
              <span class="stat-value">{coinData.community_data?.twitter_followers?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Reddit Subscribers</span>
              <span class="stat-value">{coinData.community_data?.reddit_subscribers?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Reddit Active Accounts</span>
              <span class="stat-value">{coinData.community_data?.reddit_accounts_active_48h?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Telegram Channel Size</span>
              <span class="stat-value">{coinData.community_data?.telegram_channel_user_count?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <!-- Exchange Data Card -->
        <div class="stats-card">
          <h3>Exchange Data</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name">Trading Volume (24h)</span>
              <span class="stat-value">{formatCurrency(coinData.market_data?.total_volume?.usd)}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Volume/Market Cap</span>
              <span class="stat-value">
                {((coinData.market_data?.total_volume?.usd || 0) / (coinData.market_data?.market_cap?.usd || 1)).toFixed(4)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Price Change (1h)</span>
              <span class="stat-value" style="color: {getValueColor(coinData.market_data?.price_change_percentage_1h_in_currency?.usd)}">
                {formatPercentage(coinData.market_data?.price_change_percentage_1h_in_currency?.usd || 0)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Price Change (24h)</span>
              <span class="stat-value" style="color: {getValueColor(coinData.market_data?.price_change_percentage_24h)}">
                {formatPercentage(coinData.market_data?.price_change_percentage_24h || 0)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Price Change (7d)</span>
              <span class="stat-value" style="color: {getValueColor(coinData.market_data?.price_change_percentage_7d)}">
                {formatPercentage(coinData.market_data?.price_change_percentage_7d || 0)}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Price Change (30d)</span>
              <span class="stat-value" style="color: {getValueColor(coinData.market_data?.price_change_percentage_30d)}">
                {formatPercentage(coinData.market_data?.price_change_percentage_30d || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Additional Metrics Section -->
    <div class="additional-metrics-section">
      <h2 class="section-title">Sentiment Analysis Components</h2>
      
      <div class="metrics-grid">
        {#each Object.entries(coinData.sentimentAnalysis.components) as [name, data]}
          <div class="metric-card">
            <h3>{name.charAt(0).toUpperCase() + name.slice(1)} Sentiment</h3>
            <div class="metric-gauge">
              {@html createDonutChart((data.score + 1) * 50, 100, 40, 8, 
                data.rating === 'positive' ? '#10b981' : 
                data.rating === 'negative' ? '#ef4444' : '#f59e0b')}
            </div>
            <div class="metric-rating" style="color: {
              data.rating === 'positive' ? '#10b981' : 
              data.rating === 'negative' ? '#ef4444' : '#f59e0b'
            }">
              {data.rating.toUpperCase()}
            </div>
            <div class="metric-score">Score: {data.score > 0 ? "+" : ""}{data.score}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Main container styles */
  .crypto-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  
  /* Loading animation */
  .crypto-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }
  
  .pulse {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    animation: pulse 1.5s ease-in-out infinite;
    margin-bottom: 20px;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.7; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.7; }
  }
  
  /* Error display */
  .crypto-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
  }
  
  /* Header section */
  .crypto-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .crypto-basic-info {
    display: flex;
    align-items: center;
  }
  
  .crypto-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .crypto-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .crypto-image-placeholder {
    font-size: 24px;
    font-weight: bold;
    color: #e2e8f0;
  }
  
  .crypto-name-container {
    display: flex;
    flex-direction: column;
  }
  
  .crypto-name {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
  }
  
  .crypto-symbol {
    font-size: 16px;
    opacity: 0.7;
  }
  
  .crypto-rank {
    font-size: 14px;
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
    margin-top: 5px;
  }
  
  .crypto-price-container {
    text-align: right;
  }
  
  .current-price {
    font-size: 28px;
    font-weight: bold;
  }
  
  .price-change {
    font-size: 16px;
  }
  
  /* Investment score section */
  .investment-score-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .score-card, .sentiment-card, .price-chart-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.15) 100%);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.07);
  }
  
  .score-card h2, .sentiment-card h2, .price-chart-card h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    opacity: 0.9;
  }
  
  .score-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  
  .score-value {
    font-size: 42px;
    font-weight: bold;
  }
  
  .score-max {
    font-size: 18px;
    opacity: 0.7;
  }
  
  .score-label {
    font-size: 18px;
    margin-top: 5px;
    opacity: 0.8;
  }
  
  .sentiment-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .sentiment-breakdown {
    flex-grow: 1;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .sentiment-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .sentiment-label {
    width: 70px;
    font-size: 14px;
    opacity: 0.8;
  }
  
  .sentiment-bar-container {
    margin: 0 10px;
  }
  
  .sentiment-value {
    font-size: 14px;
    font-weight: 500;
  }
  
  .sentiment-analysis {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .sentiment-overall {
    font-size: 18px;
    font-weight: 600;
  }
  
  .price-chart {
    height: 100px;
    margin-bottom: 15px;
  }
  
  .price-stats {
    display: flex;
    justify-content: space-around;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.7;
  }
  
  .stat-value {
    font-size: 16px;
    font-weight: 500;
  }
  
  /* Detailed stats section */
  .section-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    opacity: 0.9;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stats-card {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .stats-card h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
    opacity: 0.9;
    color: #e2e8f0;
  }
  
  .stats-list {
    display: flex;
    flex-direction: column;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .stat-row:last-child {
    border-bottom: none;
  }
  
  .stat-name {
    font-size: 14px;
    opacity: 0.7;
  }
  
  .stat-bar {
    display: flex;
    align-items: center;
  }
  
  .stat-bar-value {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 500;
  }
  
  /* Additional metrics section */
  .additional-metrics-section {
    margin-bottom: 30px;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .metric-card {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .metric-card h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
    opacity: 0.9;
    color: #e2e8f0;
  }
  
  .metric-gauge {
    margin: 15px auto;
  }
  
  .metric-rating {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .metric-score {
    font-size: 14px;
    opacity: 0.8;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .crypto-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .crypto-price-container {
      margin-top: 15px;
      text-align: left;
    }
    
    .investment-score-section {
      grid-template-columns: 1fr;
    }
    
    .sentiment-details {
      flex-direction: column;
    }
    
    .sentiment-gauge {
      margin: 0 auto 20px;
    }
    
    .sentiment-breakdown {
      padding-left: 0;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style>
