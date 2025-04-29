<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  let chart = $state(); // reference to the chart instance
  let canvasEl; // ref to canvas element
  let { coin = "bitcoin" } = $props();
  let selectedPeriod = $state("7"); // Default to 7 days
  let coinDescription = $state("");
  let isLoading = $state(true);
  const timeOptions = [
    { label: "24h", value: "1" },
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "Max", value: "365" },
  ];

  const fetchCoinInfo = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`,
      );
      const data = await response.json();
      coinDescription = data.description.en;
    } catch (error) {
      console.error("Error fetching coin description:", error);
      coinDescription = "Description unavailable at this time.";
    }
  };

  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fetchDataAndRenderChart = async () => {
    isLoading = true;
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart?vs_currency=inr&days=${selectedPeriod}`,
      );
      const data = await response.json();
      const prices = data.prices;
      // Format labels based on selected period
      const labels = prices.map((item) => {
        const date = new Date(item[0]);
        if (selectedPeriod === "1") {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (selectedPeriod === "max" || selectedPeriod === "30") {
          return date.toLocaleDateString();
        } else {
          return date.toLocaleDateString();
        }
      });
      const priceData = prices.map((item) => item[1]);
      if (chart) chart.destroy(); // destroy old chart if re-rendering
      // Calculate price change percentage
      const firstPrice = priceData[0];
      const lastPrice = priceData[priceData.length - 1];
      const priceChange = lastPrice - firstPrice;
      const priceChangePercent = (priceChange / firstPrice) * 100;
      const isPositive = priceChange >= 0;
      chart = new Chart(canvasEl, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `${coin.toUpperCase()} Price (INR)`,
              data: priceData,
              borderColor: isPositive
                ? "rgba(16, 158, 65, 1)" // Darker green
                : "rgba(179, 30, 30, 1)", // Darker red
              backgroundColor: isPositive
                ? "rgba(16, 158, 65, 0.15)" // Darker green with transparency
                : "rgba(179, 30, 30, 0.15)", // Darker red with transparency
              fill: true,
              tension: 0.3,
              pointRadius: 0.5,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                boxWidth: 10,
                font: {
                  size: 12,
                },
                color: "#ffffff", // Changed to white for dark background
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              titleColor: "#f9fafb",
              bodyColor: "#f3f4f6",
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${formatINR(context.parsed.y)}`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 8,
                font: {
                  size: 10,
                },
                color: "#e5e7eb", // Changed to light color for dark background
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value) {
                  return formatINR(value);
                },
                font: {
                  size: 10,
                },
                color: "#e5e7eb", // Changed to light color for dark background
              },
              grid: {
                color: "rgba(229, 231, 235, 0.2)", // Lighter grid lines for dark background
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "nearest",
          },
        },
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      isLoading = false;
    }
  };

  const changePeriod = (period) => {
    selectedPeriod = period;
    fetchDataAndRenderChart();
  };

  onMount(() => {
    fetchDataAndRenderChart();
    fetchCoinInfo();
  });
</script>

<div class="chart-container">
  <div class="chart-header">
    <h2 class="chart-title">{coin.toUpperCase()} Price Chart (INR)</h2>
    <div class="period-buttons">
      {#each timeOptions as option}
        <button
          class="period-button {selectedPeriod === option.value
            ? 'active'
            : ''}"
          onclick={() => changePeriod(option.value)}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
  <div class="chart-body">
    {#if isLoading}
      <div class="loading-overlay">
        <div class="loading-text">Loading chart data...</div>
      </div>
    {/if}
    <canvas bind:this={canvasEl}></canvas>
  </div>
  {#if coinDescription}
    <div class="coin-description">
      <h3 class="description-title">About {coin.toUpperCase()}</h3>
      <div class="description-content">
        {@html coinDescription.substring(0, 300) +
          (coinDescription.length > 300 ? "..." : "")}
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 80%;
    background-color: #0f172a; /* Dark blue background */
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    padding: 16px;
  }
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .chart-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    margin: 0;
  }
  .period-buttons {
    display: flex;
    gap: 4px;
  }
  .period-button {
    padding: 4px 12px;
    font-size: 0.875rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background-color: #334155; /* Darker button that fits the theme */
    color: #e5e7eb; /* Light text for contrast */
  }
  .period-button:hover {
    background-color: #475569; /* Slightly lighter on hover */
  }
  .period-button.active {
    background-color: #3b82f6; /* Blue for active state */
    color: white;
  }
  .chart-body {
    position: relative;
    flex-grow: 1;
    min-height: 300px;
  }
  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(15, 23, 42, 0.8); /* Dark overlay matching theme */
  }
  .loading-text {
    color: #e5e7eb; /* Light text for dark background */
  }
  .coin-description {
    margin-top: 16px;
    border-top: 1px solid #334155; /* Darker border that fits theme */
    padding-top: 12px;
  }
  .description-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
  }
  .description-content {
    font-size: 0.875rem;
    color: #d1d5db; /* Light gray for better readability */
    max-height: 128px;
    overflow-y: auto;
    line-height: 1.5;
  }
</style>
