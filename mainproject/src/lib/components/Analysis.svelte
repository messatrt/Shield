<!-- Popup.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  // Props
  export let isOpen = false;
  export let title = "Popup Title";

  // Event dispatcher to communicate with parent
  const dispatch = createEventDispatcher();

  // Close function
  function closePopup() {
    dispatch("close");
  }
</script>

{#if isOpen}
  <div class="popup-overlay">
    <div class="popup-content">
      <div class="popup-header">
        <h2>{title}</h2>
        <button class="close-button" onclick={closePopup}>×</button>
      </div>
      <div class="popup-body">
        <slot />
      </div>
      <div class="popup-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }

  .popup-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .close-button:hover {
    background-color: #f0f0f0;
  }

  .popup-body {
    padding: 20px;
  }

  .popup-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
  }
</style>
