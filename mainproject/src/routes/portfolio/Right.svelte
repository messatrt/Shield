<script>
  import { onMount } from "svelte";
  import { DataProvider } from "$lib/utils/api";

  export let coins = [];

  let coinDetails = [];

  onMount(async () => {
    coinDetails = await Promise.all(coins.map((coin) => DataProvider(coin)));
  });

  function formatNumber(n) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  }
</script>

<div class="cards-container">
  {#each coinDetails as coin (coin.id)}
    {#if coin?.id}
      <a href="/portfolio/overview/{coin.name}">
        <div class="coin-card">
          <div class="coin-rank">#{coin.market_cap_rank}</div>
          <div class="coin-header">
            <img class="coin-logo" src={coin.image.small} alt={coin.name} />
            <div class="coin-name-symbol">
              <h2>{coin.name}</h2>
              <span class="coin-symbol">{coin.symbol.toUpperCase()}</span>
            </div>
          </div>

          <div class="coin-data">
            <div>
              <span class="label">Price:</span>
              <span>${coin.market_data.current_price.usd.toFixed(2)}</span>
            </div>
            <div>
              <span class="label">24h Volume:</span>
              <span>${formatNumber(coin.market_data.total_volume.usd)}</span>
            </div>
            <div>
              <span class="label">Market Cap:</span>
              <span>${formatNumber(coin.market_data.market_cap.usd)}</span>
            </div>
          </div>
        </div>
      </a>
    {/if}
  {/each}
</div>

<style>
  a {
    text-decoration: none;
  }
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    padding: 30px;
    background: #0f172a;
  }

  .coin-card {
    background: linear-gradient(
      145deg,
      rgba(99, 102, 241, 0.12),
      rgba(168, 85, 247, 0.15),
      rgba(236, 72, 153, 0.1)
    );
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    padding: 20px;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: transform 0.2s ease;
  }

  .coin-card:hover {
    transform: translateY(-5px);
  }

  .coin-rank {
    font-size: 0.9rem;
    font-weight: bold;
    opacity: 0.7;
  }

  .coin-header {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .coin-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: contain;
  }

  .coin-name-symbol h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .coin-symbol {
    font-size: 0.85rem;
    opacity: 0.75;
  }

  .coin-data {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .coin-data .label {
    font-weight: 600;
    margin-right: 5px;
    color: #cbd5e1;
  }
</style>
