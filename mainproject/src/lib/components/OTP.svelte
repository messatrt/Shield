<script>
  import { onMount } from 'svelte';
  
  let otpValues = ['', '', '', '', '', ''];
  let inputRefs = Array(6).fill(null);
  let isSubmitting = false;
  let timer = 60;
  let timerRunning = true;
  
  onMount(() => {
    // Focus the first input on mount
    if (inputRefs[0]) {
      inputRefs[0].focus();
    }
    
    // Start countdown timer
    const interval = setInterval(() => {
      if (timer > 0 && timerRunning) {
        timer -= 1;
      } else {
        timerRunning = false;
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  });
  
  function handleInput(index, event) {
    const value = event.target.value;
    
    // Only accept single digit
    if (/^\d$/.test(value)) {
      otpValues[index] = value;
      
      // Move focus to next input if available
      if (index < 5 && inputRefs[index + 1]) {
        inputRefs[index + 1].focus();
      }
    } else {
      otpValues[index] = '';
    }
    
    // Update OTP values array
    otpValues = [...otpValues];
  }
  
  function handleKeyDown(index, event) {
    // Navigate with arrow keys
    if (event.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].focus();
    }
    
    // Handle backspace
    if (event.key === 'Backspace' && index > 0 && otpValues[index] === '') {
      otpValues[index - 1] = '';
      inputRefs[index - 1].focus();
      otpValues = [...otpValues];
    }
  }
  
  function handlePaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text/plain').trim();
    
    // If pasted content contains 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      otpValues = pastedData.split('');
      // Focus the last input
      inputRefs[5].focus();
    }
  }
  
  async function verifyOtp() {
    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) return;
    
    isSubmitting = true;
    
    // Placeholder for OTP verification logic
    console.log('Verifying OTP:', otpCode);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    isSubmitting = false;
  }
  
  function resendOtp() {
    // Reset timer and start again
    timer = 60;
    timerRunning = true;
    
    // Placeholder for resend OTP logic
    console.log('Resending OTP');
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1 class="auth-title">Verification</h1>
    <p class="auth-subtitle">Enter the 6-digit code sent to your email</p>
    
    <div class="otp-container" on:paste={handlePaste}>
      {#each otpValues as value, i}
        <input
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="otp-input"
          bind:this={inputRefs[i]}
          value={value}
          on:input={(e) => handleInput(i, e)}
          on:keydown={(e) => handleKeyDown(i, e)}
        />
      {/each}
    </div>
    
    <button 
      class="auth-button" 
      on:click={verifyOtp} 
      disabled={otpValues.join('').length !== 6 || isSubmitting}
    >
      {#if isSubmitting}
        <div class="spinner"></div> Verifying...
      {:else}
        Verify & Continue
      {/if}
    </button>
    
    <div class="resend-container">
      {#if timerRunning}
        <p>Resend code in <span class="timer">{timer}s</span></p>
      {:else}
        <button on:click={resendOtp} class="resend-button">Resend Code</button>
      {/if}
    </div>
    
    <div class="auth-footer">
      <p>Didn't receive the code? <a href="/support">Contact Support</a></p>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
  }
  
  .auth-card {
    width: 100%;
    max-width: 450px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(168, 85, 247, 0.15) 50%,
      rgba(236, 72, 153, 0.1) 100%
    );
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.07);
  }
  
  .auth-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-align: center;
  }
  
  .auth-subtitle {
    color: #94a3b8;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .otp-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 2rem;
  }
  
  .otp-input {
    width: 50px;
    height: 60px;
    background-color: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 1.5rem;
    text-align: center;
    color: #e2e8f0;
    transition: all 0.2s ease;
  }
  
  .otp-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
  }
  
  .auth-button {
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
  
  .auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .auth-button:not(:disabled):hover {
    background: linear-gradient(90deg, #4f46e5, #9333ea);
    transform: translateY(-2px);
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .resend-container {
    margin-top: 1.5rem;
    text-align: center;
    color: #94a3b8;
  }
  
  .timer {
    color: #6366f1;
    font-weight: 600;
  }
  
  .resend-button {
    background: none;
    border: none;
    color: #6366f1;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
  }
  
  .resend-button:hover {
    color: #818cf8;
    text-decoration: underline;
  }
  
  .auth-footer {
    margin-top: 2rem;
    text-align: center;
    color: #94a3b8;
  }
  
  .auth-footer a {
    color: #6366f1;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  .auth-footer a:hover {
    color: #818cf8;
    text-decoration: underline;
  }
  
  @media (max-width: 640px) {
    .auth-card {
      padding: 1.5rem;
    }
    
    .otp-input {
      width: 40px;
      height: 50px;
      font-size: 1.25rem;
    }
  }
</style>
