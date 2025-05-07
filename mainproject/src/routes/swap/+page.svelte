<script>
  import { onMount } from 'svelte';
  import { address, coins } from '$lib/components/env.svelte.js';

  // State variables
  let fromCoin = coins[0];
  let toCoin = coins[1];
  let fromAmount = 1;
  let toAmount = 0;
  let loading = true;
  let exchangeRate = 0;
  let allCoins = [];
  let fromCoinData = null;
  let toCoinData = null;
  let slippage = 0.5; // Default slippage tolerance (%)
  let gasFee = 0.0012; // ETH (simulated gas fee)
  let transactionSpeed = 'normal'; // slow, normal, fast
  
  // Error handling
  let error = null;
  let fetchingRate = false;

  onMount(async () => {
    try {
      // Fetch supported coins from CoinGecko
      const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
      if (!response.ok) throw new Error('Failed to fetch coin list');
      
      const data = await response.json();
      allCoins = data.filter(coin => 
        coins.includes(coin.id) || 
        ['bitcoin', 'binancecoin', 'ripple', 'cardano', 'solana'].includes(coin.id)
      );
      
      // Initialize with data for the default coins
      await fetchCoinData();
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });

  // Fetch data for the selected coins
  async function fetchCoinData() {
    try {
      fetchingRate = true;
      error = null;
      
      const fromResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${fromCoin}`);
      const toResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${toCoin}`);
      
      if (!fromResponse.ok || !toResponse.ok) {
        throw new Error('Failed to fetch coin data');
      }
      
      fromCoinData = await fromResponse.json();
      toCoinData = await toResponse.json();
      
      // Calculate exchange rate
      exchangeRate = fromCoinData.market_data.current_price.usd / 
                     toCoinData.market_data.current_price.usd;
      
      // Update the to amount based on from amount and exchange rate
      updateToAmount();
      fetchingRate = false;
    } catch (err) {
      error = err.message;
      fetchingRate = false;
    }
  }

  // Swap the from and to coins
  function swapCoins() {
    [fromCoin, toCoin] = [toCoin, fromCoin];
    fetchCoinData();
  }

  // Update to amount when from amount changes
  function updateToAmount() {
    if (exchangeRate && fromAmount) {
      toAmount = (fromAmount * exchangeRate).toFixed(6);
    }
  }

  // Update from amount when to amount changes
  function updateFromAmount() {
    if (exchangeRate && toAmount) {
      fromAmount = (toAmount / exchangeRate).toFixed(6);
    }
  }

  // Format number with commas
  function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }

  // Handle from coin change
  function handleFromCoinChange(e) {
    fromCoin = e.target.value;
    if (fromCoin === toCoin) {
      // If same coin selected, switch to a different one
      const availableCoins = coins.filter(c => c !== fromCoin);
      toCoin = availableCoins[0] || coins[0];
    }
    fetchCoinData();
  }

  // Handle to coin change
  function handleToCoinChange(e) {
    toCoin = e.target.value;
    if (fromCoin === toCoin) {
      // If same coin selected, switch to a different one
      const availableCoins = coins.filter(c => c !== toCoin);
      fromCoin = availableCoins[0] || coins[0];
    }
    fetchCoinData();
  }

  // Simulate transaction
  function executeSwap() {
    alert(`Swap executed: ${fromAmount} ${fromCoin} to ${toAmount} ${toCoin}`);
    // In a real app, this would call a blockchain transaction
  }

  // Format a coin name to be more readable
  function formatCoinName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Calculate estimated time based on transaction speed
  function getEstimatedTime() {
    switch(transactionSpeed) {
      case 'slow': return '5-10 minutes';
      case 'normal': return '1-3 minutes';
      case 'fast': return '< 1 minute';
      default: return '1-3 minutes';
    }
  }
</script>

<div class="swap-container">
  <div class="swap-card">
    <div class="swap-header">
      <h2>Swap</h2>
      <div class="wallet-info">
        <span class="wallet-icon">👛</span>
        <span class="wallet-address">{address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
      </div>
    </div>

    {#if loading}
      <div class="loading">Loading swap data...</div>
    {:else if error}
      <div class="error">
        <p>Error: {error}</p>
        <button on:click={fetchCoinData}>Try Again</button>
      </div>
    {:else}
      <div class="swap-form">
        <!-- FROM section -->
        <div class="input-group">
          <label>From</label>
          <div class="coin-input">
            <select bind:value={fromCoin} on:change={handleFromCoinChange}>
              {#each coins as coin}
                <option value={coin}>{formatCoinName(coin)}</option>
              {/each}
            </select>
            <input 
              type="number" 
              bind:value={fromAmount} 
              on:input={updateToAmount} 
              min="0.000001" 
              step="0.000001" 
            />
          </div>
          {#if fromCoinData}
            <div class="coin-info">
              <img 
                src={fromCoinData.image?.thumb || 'https://via.placeholder.com/30'} 
                alt={fromCoinData.name} 
                class="coin-icon" 
              />
              <span class="coin-price">${fromCoinData.market_data?.current_price?.usd?.toFixed(2)}</span>
            </div>
          {/if}
        </div>

        <!-- Swap button -->
        <button class="swap-button" on:click={swapCoins}>
          ⇅
        </button>

        <!-- TO section -->
        <div class="input-group">
          <label>To</label>
          <div class="coin-input">
            <select bind:value={toCoin} on:change={handleToCoinChange}>
              {#each coins as coin}
                <option value={coin}>{formatCoinName(coin)}</option>
              {/each}
            </select>
            <input 
              type="number" 
              bind:value={toAmount} 
              on:input={updateFromAmount} 
              min="0.000001" 
              step="0.000001" 
            />
          </div>
          {#if toCoinData}
            <div class="coin-info">
              <img 
                src={toCoinData.image?.thumb || 'https://via.placeholder.com/30'} 
                alt={toCoinData.name} 
                class="coin-icon" 
              />
              <span class="coin-price">${toCoinData.market_data?.current_price?.usd?.toFixed(2)}</span>
            </div>
          {/if}
        </div>

        <!-- Exchange rate info -->
        <div class="exchange-info">
          <div class="rate">
            {#if fetchingRate}
              <span>Fetching best rate...</span>
            {:else}
              <span>Rate: 1 {formatCoinName(fromCoin)} = {exchangeRate.toFixed(6)} {formatCoinName(toCoin)}</span>
            {/if}
          </div>
        </div>

        <!-- Transaction settings -->
        <div class="transaction-settings">
          <div class="setting">
            <label>Slippage Tolerance</label>
            <div class="setting-options">
              <button class={slippage === 0.5 ? 'active' : ''} on:click={() => slippage = 0.5}>0.5%</button>
              <button class={slippage === 1.0 ? 'active' : ''} on:click={() => slippage = 1.0}>1.0%</button>
              <button class={slippage === 3.0 ? 'active' : ''} on:click={() => slippage = 3.0}>3.0%</button>
            </div>
          </div>
          
          <div class="setting">
            <label>Transaction Speed</label>
            <div class="setting-options">
              <button class={transactionSpeed === 'slow' ? 'active' : ''} on:click={() => transactionSpeed = 'slow'}>Slow</button>
              <button class={transactionSpeed === 'normal' ? 'active' : ''} on:click={() => transactionSpeed = 'normal'}>Normal</button>
              <button class={transactionSpeed === 'fast' ? 'active' : ''} on:click={() => transactionSpeed = 'fast'}>Fast</button>
            </div>
          </div>
        </div>

        <!-- Transaction summary -->
        <div class="transaction-summary">
          <div class="summary-item">
            <span>Estimated Gas Fee</span>
            <span>{gasFee} ETH</span>
          </div>
          <div class="summary-item">
            <span>Estimated Time</span>
            <span>{getEstimatedTime()}</span>
          </div>
          <div class="summary-item">
            <span>Slippage Tolerance</span>
            <span>{slippage}%</span>
          </div>
        </div>

        <!-- Swap button -->
        <button 
          class="execute-swap-button" 
          on:click={executeSwap}
          disabled={fetchingRate || !fromAmount || !toAmount || fromAmount <= 0}
        >
          {#if fetchingRate}
            Finding Best Rate...
          {:else}
            Swap Now
          {/if}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Using your global color scheme */
  .swap-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    min-height: calc(100vh - 80px);
  }

  .swap-card {
    background: linear-gradient(145deg, rgba(23, 31, 54, 0.95), rgba(15, 23, 42, 0.95));
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 480px;
    padding: 2rem;
    border: 1px solid rgba(100, 116, 139, 0.2);
    backdrop-filter: blur(10px);
  }

  .swap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  }

  .swap-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .wallet-info {
    display: flex;
    align-items: center;
    background-color: rgba(30, 41, 59, 0.6);
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
  }

  .wallet-icon {
    margin-right: 0.5rem;
  }

  .wallet-address {
    color: #94a3b8;
    font-family: monospace;
  }

  .loading, .error {
    text-align: center;
    padding: 2rem 0;
    color: #94a3b8;
  }

  .error button {
    margin-top: 1rem;
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .error button:hover {
    background-color: #1d4ed8;
  }

  .swap-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    position: relative;
    background-color: rgba(30, 41, 59, 0.6);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(100, 116, 139, 0.2);
  }

  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .coin-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .coin-input select {
    flex: 0 0 40%;
    background-color: rgba(15, 23, 42, 0.8);
    color: #e2e8f0;
    border: 1px solid rgba(100, 116, 139, 0.3);
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 500;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23e2e8f0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem top 50%;
    background-size: 0.65rem auto;
    cursor: pointer;
  }

  .coin-input input {
    flex: 1;
    background-color: transparent;
    color: #e2e8f0;
    border: none;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: right;
    width: 100%;
    padding: 0.5rem;
  }

  .coin-input input:focus {
    outline: none;
  }

  .coin-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .coin-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .coin-price {
    color: #94a3b8;
    font-size: 0.85rem;
  }

  .swap-button {
    align-self: center;
    background-color: rgba(30, 41, 59, 0.6);
    color: #e2e8f0;
    border: 1px solid rgba(100, 116, 139, 0.3);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1.2rem;
    margin: 0.5rem 0;
    transition: all 0.2s;
  }

  .swap-button:hover {
    background-color: rgba(37, 99, 235, 0.7);
    transform: rotate(180deg);
  }

  .exchange-info {
    background-color: rgba(30, 41, 59, 0.4);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #94a3b8;
  }

  .transaction-settings {
    background-color: rgba(30, 41, 59, 0.4);
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .setting {
    margin-bottom: 1rem;
  }

  .setting:last-child {
    margin-bottom: 0;
  }

  .setting label {
    display: block;
    margin-bottom: 0.5rem;
    color: #94a3b8;
    font-size: 0.85rem;
  }

  .setting-options {
    display: flex;
    gap: 0.5rem;
  }

  .setting-options button {
    flex: 1;
    background-color: rgba(15, 23, 42, 0.6);
    color: #94a3b8;
    border: 1px solid rgba(100, 116, 139, 0.2);
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .setting-options button.active {
    background-color: rgba(37, 99, 235, 0.7);
    color: #e2e8f0;
    border-color: rgba(37, 99, 235, 0.8);
  }

  .transaction-summary {
    background-color: rgba(30, 41, 59, 0.4);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: #94a3b8;
  }

  .summary-item:last-child {
    margin-bottom: 0;
  }

  .execute-swap-button {
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .execute-swap-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  .execute-swap-button:disabled {
    background-color: rgba(37, 99, 235, 0.4);
    cursor: not-allowed;
  }

  /* Additional responsive styles */
  @media (max-width: 480px) {
    .swap-card {
      padding: 1.5rem;
    }
    
    .coin-input {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .coin-input select,
    .coin-input input {
      width: 100%;
    }
  }
</style>
