<script>
  import Footer from "$lib/components/Footer.svelte";
  import Historical from "$lib/components/Historical.svelte";
  import { DataProvider } from "$lib/utils/api.js";
  import { onMount } from "svelte";
  let { data } = $props();
  let coin = data.coin;
  let details = $state({});
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      loading = true;
      details = await DataProvider(coin);
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatPercent = (percent) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(percent / 100);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
</script>

<div class="container">
  <div class="left-panel">
    {#if loading}
      <div class="loading">Loading cryptocurrency data...</div>
    {:else if error}
      <div class="error">Error: {error}</div>
    {:else}
      <div class="coin-header">
        {#if details.image?.large}
          <img src={details.image.large} alt={details.name} class="coin-logo" />
        {/if}
        <div>
          <h1>
            {details.name}
            <span class="symbol">{details.symbol?.toUpperCase()}</span>
          </h1>
          <div class="rank">Rank #{details.market_cap_rank || "N/A"}</div>
        </div>
      </div>
      <div class="btns">
        <button class="buy">Buy</button>

        <button><a href={`/analysis/${coin}`}>Analyse</a></button>
      </div>

      <div class="data-section">
        <h2>Price Data</h2>
        <div class="data-row">
          <div class="label">Current Price:</div>
          <div class="value price">
            {details.market_data?.current_price?.usd
              ? formatPrice(details.market_data.current_price.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">24h Change:</div>
          <div
            class="value"
            class:positive={details.market_data?.price_change_percentage_24h >
              0}
            class:negative={details.market_data?.price_change_percentage_24h <
              0}
          >
            {details.market_data?.price_change_percentage_24h
              ? formatPercent(details.market_data.price_change_percentage_24h)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">7d Change:</div>
          <div
            class="value"
            class:positive={details.market_data?.price_change_percentage_7d > 0}
            class:negative={details.market_data?.price_change_percentage_7d < 0}
          >
            {details.market_data?.price_change_percentage_7d
              ? formatPercent(details.market_data.price_change_percentage_7d)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">30d Change:</div>
          <div
            class="value"
            class:positive={details.market_data?.price_change_percentage_30d >
              0}
            class:negative={details.market_data?.price_change_percentage_30d <
              0}
          >
            {details.market_data?.price_change_percentage_30d
              ? formatPercent(details.market_data.price_change_percentage_30d)
              : "N/A"}
          </div>
        </div>
      </div>

      <div class="data-section">
        <h2>Market Data</h2>
        <div class="data-row">
          <div class="label">Market Cap:</div>
          <div class="value">
            {details.market_data?.market_cap?.usd
              ? formatPrice(details.market_data.market_cap.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">24h Volume:</div>
          <div class="value">
            {details.market_data?.total_volume?.usd
              ? formatPrice(details.market_data.total_volume.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">Circulating Supply:</div>
          <div class="value">
            {details.market_data?.circulating_supply
              ? details.market_data.circulating_supply.toLocaleString()
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">Max Supply:</div>
          <div class="value">
            {details.market_data?.max_supply
              ? details.market_data.max_supply.toLocaleString()
              : "Unlimited"}
          </div>
        </div>
      </div>

      <div class="data-section">
        <h2>Additional Info</h2>
        <div class="data-row">
          <div class="label">Genesis Date:</div>
          <div class="value">
            {details.genesis_date ? formatDate(details.genesis_date) : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">Hashing Algorithm:</div>
          <div class="value">{details.hashing_algorithm || "N/A"}</div>
        </div>

        <div class="data-row">
          <div class="label">Block Time (min):</div>
          <div class="value">{details.block_time_in_minutes || "N/A"}</div>
        </div>
      </div>

      <div class="data-section">
        <h2>All-Time Data</h2>
        <div class="data-row">
          <div class="label">All-Time High:</div>
          <div class="value">
            {details.market_data?.ath?.usd
              ? formatPrice(details.market_data.ath.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">ATH Date:</div>
          <div class="value">
            {details.market_data?.ath_date?.usd
              ? formatDate(details.market_data.ath_date.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">All-Time Low:</div>
          <div class="value">
            {details.market_data?.atl?.usd
              ? formatPrice(details.market_data.atl.usd)
              : "N/A"}
          </div>
        </div>

        <div class="data-row">
          <div class="label">ATL Date:</div>
          <div class="value">
            {details.market_data?.atl_date?.usd
              ? formatDate(details.market_data.atl_date.usd)
              : "N/A"}
          </div>
        </div>
      </div>

      {#if details.links}
        <div class="data-section">
          <h2>Links</h2>
          {#if details.links.homepage && details.links.homepage[0]}
            <div class="data-row">
              <div class="label">Website:</div>
              <div class="value">
                <a
                  href={details.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer">{details.links.homepage[0]}</a
                >
              </div>
            </div>
          {/if}

          {#if details.links.blockchain_site && details.links.blockchain_site[0]}
            <div class="data-row">
              <div class="label">Explorer:</div>
              <div class="value">
                <a
                  href={details.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer">View Explorer</a
                >
              </div>
            </div>
          {/if}

          {#if details.links.repos_url?.github && details.links.repos_url.github[0]}
            <div class="data-row">
              <div class="label">Github:</div>
              <div class="value">
                <a
                  href={details.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer">View Github</a
                >
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
  <div class="right-panel">
    <Historical {coin} />
  </div>
</div>
<Footer />

<style>
  :global(body) {
    background-color: #0f172a;
    color: #e2e8f0;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-column-gap: 0;
    grid-row-gap: 0;
    min-height: 100vh;
  }

  .left-panel,
  .right-panel {
    overflow-y: auto;
    max-height: 100vh;
    padding: 1.5rem;
    border-right: 1px solid rgba(255, 255, 255, 0.07);
  }

  .left-panel {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(168, 85, 247, 0.15) 50%,
      rgba(236, 72, 153, 0.1) 100%
    );
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  .left-panel::-webkit-scrollbar {
    width: 8px;
  }

  .left-panel::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .left-panel::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  .left-panel::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .coin-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .coin-logo {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: contain;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 5px;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    color: #fff;
  }

  .symbol {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.25rem;
  }

  .rank {
    background: linear-gradient(
      90deg,
      rgba(99, 102, 241, 0.5) 0%,
      rgba(168, 85, 247, 0.5) 100%
    );
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: bold;
    display: inline-block;
  }

  .data-section {
    margin-bottom: 1.5rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(99, 102, 241, 0.9);
    border-bottom: 1px solid rgba(99, 102, 241, 0.3);
    padding-bottom: 0.5rem;
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .data-row:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
  }

  .value {
    font-weight: 600;
    text-align: right;
  }

  .price {
    color: #38bdf8;
    font-size: 1.1rem;
  }

  .positive {
    color: #4ade80;
  }

  .negative {
    color: #f87171;
  }

  .loading,
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
  }

  .error {
    color: #f87171;
  }

  a {
    text-decoration: none;
    color: #38bdf8;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #0ea5e9;
    text-decoration: underline;
  }

  .btns {
    margin: 16px;
  }
  .btns button {
    background: linear-gradient(90deg, #3b82f6, #4f46e5);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
  }
  .buy {
    margin-right: 20px;
  }
</style>
