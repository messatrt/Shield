<script>
  import Footer from "$lib/components/Footer.svelte";
  import Analysis from "./Analysis.svelte";
  import Trading from "./Trading.svelte";

  let { data } = $props();
  let coin = data.coin;

  let openGraph = $state(true);
  let openTraiding = $state(true);
  let openAnalysis = $state(false);

  function toggleView() {
    openGraph = false;
    openTraiding = true;
    openAnalysis = false;
  }

  function toggleAnalysis() {
    openGraph = false;
    openTraiding = false;
    openAnalysis = true;
  }
</script>

<div class="container">
  <div class="tab-buttons"></div>

  <div class="tab-content">
    <Trading />
    <Analysis />
  </div>
</div>

<Footer />

<style>
  .container {
    padding: 40px 20px;
    max-width: 1000px;
    min-height: 100vh;
    margin: 0 auto;
    color: #e2e8f0;
  }

  .tab-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .tab-buttons button {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab-buttons button:hover {
    background: rgba(168, 85, 247, 0.25);
  }

  .tab-buttons button.selected {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.3),
      rgba(168, 85, 247, 0.3),
      rgba(236, 72, 153, 0.3)
    );
    border-color: rgba(255, 255, 255, 0.15);
    font-weight: bold;
  }

  .tab-content {
    background: rgba(255, 255, 255, 0.02);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .tab-box {
    font-size: 1.1rem;
  }
</style>
