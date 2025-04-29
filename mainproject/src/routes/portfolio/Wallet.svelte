<script>
  let { address } = $props();
  let newWallte = $state();
  function handleNewWallet() {
    console.log(newWallte);
  }
</script>

<div class="wallet-container">
  <div class="input-group">
    <input
      type="text"
      bind:value={newWallte}
      placeholder="Enter wallet address"
    />
    <button on:click={handleNewWallet}>+ Add</button>
  </div>
  <p class="current-address">{address}</p>
</div>

<style>
  .wallet-container {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  .input-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  input {
    flex-grow: 1;
    padding: 0.75rem;
    background-color: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #e2e8f0;
    font-size: 0.9rem;
    transition: border-color 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  input::placeholder {
    color: rgba(226, 232, 240, 0.4);
  }

  button {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.9) 0%,
      rgba(168, 85, 247, 0.9) 100%
    );
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
  }

  button:hover {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 1) 0%,
      rgba(168, 85, 247, 1) 100%
    );
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.5);
  }

  button:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(99, 102, 241, 0.4);
  }

  .current-address {
    font-family: monospace;
    background-color: rgba(15, 23, 42, 0.5);
    padding: 0.75rem 1rem;
    border-radius: 6px;
    overflow-wrap: break-word;
    margin-top: 1rem;
    font-size: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.07);
    color: rgba(226, 232, 240, 0.8);
    word-break: break-all;
  }
</style>
