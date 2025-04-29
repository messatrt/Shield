<script>
  import { onMount } from "svelte";

  // Accept coin as a prop
  let { coin } = $props();

  // Define state variables
  let symbol = $state(coin || "BINANCE:BTCUSDT");
  let tvScriptLoadingPromise;
  let widgetContainer;

  function createWidget() {
    if (typeof TradingView === "undefined" || !widgetContainer) return;

    // Clear previous widget
    widgetContainer.innerHTML = "";

    // Create new widget with proper symbol handling
    new TradingView.widget({
      autosize: true,
      symbol: symbol, // Use the symbol state variable
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview_chart",
      studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"],
    });
  }

  // Load TradingView script and initialize widget
  onMount(() => {
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => {
      createWidget();
    });

    // Cleanup on component destruction
    return () => {
      if (widgetContainer) {
        widgetContainer.innerHTML = "";
      }
    };
  });

  // Effect to handle symbol changes
  $effect(() => {
    if (symbol && tvScriptLoadingPromise) {
      tvScriptLoadingPromise.then(() => {
        createWidget();
      });
    }
  });
</script>

<div class="container">
  <div
    bind:this={widgetContainer}
    id="tradingview_chart"
    style="height: 100%;"
  ></div>
</div>

<style>
  .container {
    width: 100%;
    height: 600px;
  }
</style>
