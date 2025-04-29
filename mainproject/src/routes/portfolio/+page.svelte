<script>
  import { address, coins } from "$lib/components/env.svelte";
  import Right from "./Right.svelte";
  import Wallet from "./Wallet.svelte";
</script>

<div class="container">
  <div class="left"><Wallet {address} /></div>
  <div class="right"><Right {coins} /></div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  .left,
  .right {
    overflow-y: auto;
    max-height: 100vh;
    padding: 1.5rem;
  }
</style>
