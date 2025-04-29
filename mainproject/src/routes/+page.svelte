<script>
  import Hero from "../lib/components/Hero.svelte";
  import Footer from "../lib/components/Footer.svelte";
  import { onMount } from "svelte";
  import { CoinProvider } from "./context.svelte";
  let coins = $state([]);
  let displayCoin = $derived(coins);
  onMount(async () => {
    coins = await CoinProvider(); // Await the result and assign to state
  });
</script>

<Hero />
<div class="home">
  <div class="crypto-table">
    <div class="table-layout header">
      <p>#</p>
      <p>Coin</p>
      <p>Price</p>
      <p>24h Change</p>
      <p class="mkt">Market Cap</p>
    </div>
    {#each displayCoin.slice(0, 100) as coin (coin.id)}
      <a class="table-layout" href={"/coins/" + coin.name}>
        <p>{coin.market_cap_rank}</p>
        <div class="coin-info">
          <img src={coin.image} alt="coin" />
          <p>{coin.name + " - " + coin.symbol}</p>
        </div>
        <p class="price">{"$ " + coin.current_price}</p>
        <p class="change" class:positive={coin.price_change_percentage_24h > 0}>
          {coin.price_change_percentage_24h.toFixed(2) + "%"}
        </p>
        <p class="market-cap">${coin.market_cap.toLocaleString()}</p>
      </a>
    {/each}
  </div>
</div>
<Footer />

<style>
  :global(body) {
    background-color: #0f172a;
    color: #e2e8f0;
  }
  a {
    text-decoration: none;
    color: white;
  }
  .home {
    padding: 0 10px 100px;
    margin: 40px;
  }

  .crypto-table {
    max-width: 200vh;
    margin: auto;
    border-radius: 15px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(168, 85, 247, 0.15) 50%,
      rgba(236, 72, 153, 0.1) 100%
    );
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  .table-layout {
    display: grid;
    grid-template-columns: 0.5fr 2fr 1fr 1fr 1.5fr;
    padding: 15px 20px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: background-color 0.2s ease;
  }

  .table-layout:hover:not(.header) {
    background-color: rgba(255, 255, 255, 0.03);
  }

  .header {
    font-weight: bold;
    background: linear-gradient(
      90deg,
      rgba(99, 102, 241, 0.25) 0%,
      rgba(168, 85, 247, 0.25) 100%
    );
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mkt {
    text-align: right;
  }

  .coin-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .coin-info img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .price {
    font-weight: 500;
    color: #f8fafc;
  }

  .change {
    color: #f87171;
    font-weight: 500;
  }

  .change.positive {
    color: #4ade80;
  }

  .market-cap {
    text-align: right;
    color: #cbd5e1;
  }
</style>
