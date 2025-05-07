<script>
  import { goto } from "$app/navigation";
  import { count } from "$lib/utils/store";
  import Otp from "$lib/components/OTP.svelte";
  let email = "";
  let password = ""; // Keep password field for UI
  let rememberMe = false;
  let showOtpScreen = false;
  let isLoading = false;
  let errorMessage = "";
  
  // API base URL - point to your Express backend
  const API_URL = "http://localhost:1323";
  
  // Request OTP function
  const requestOtp = async () => {
    if (!email) {
      errorMessage = "Please enter your email address";
      return;
    }
    
    isLoading = true;
    errorMessage = "";
    
    try {
      const response = await fetch(`${API_URL}/login/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      // Show OTP screen on success
      showOtpScreen = true;
    } catch (error) {
      errorMessage = error.message || "An error occurred. Please try again.";
    } finally {
      isLoading = false;
    }
  };
  
  // Handle OTP verification
  const handleVerifyOtp = async (otpCode) => {
    isLoading = true;
    errorMessage = "";
    
    try {
      const response = await fetch(`${API_URL}/login/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          otp: otpCode 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      
      // Set logged in state and redirect to home page
      count.set(true);
      goto("/");
    } catch (error) {
      errorMessage = error.message || "Invalid OTP. Please try again.";
      isLoading = false;
    }
  };
</script>

{#if !showOtpScreen}
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Enter your credentials to access your account</p>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
      <form on:submit|preventDefault={requestOtp} class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            bind:value={email}
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            bind:value={password}
            required
          />
        </div>
        <button type="submit" class="auth-button" disabled={isLoading}>
          {#if isLoading}
            <div class="spinner"></div> Sending OTP...
          {:else}
            Continue
          {/if}
        </button>
      </form>
      <div class="auth-footer">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  </div>
{:else}
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Verification</h1>
      <p class="auth-subtitle">Enter the 6-digit code sent to {email}</p>
      
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
      
      <Otp onVerify={handleVerifyOtp} isSubmitting={isLoading} />
      
      <div class="back-link">
        <button on:click={() => (showOtpScreen = false)} class="back-button">
          &larr; Back to Login
        </button>
      </div>
    </div>
  </div>
{/if}

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
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #cbd5e1;
  }
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    background-color: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  input[type="email"]:focus,
  input[type="password"]:focus,
  input[type="text"]:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
  }
  .auth-button {
    margin-top: 1rem;
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
  }
  .auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .auth-button:not(:disabled):hover {
    background: linear-gradient(90deg, #4f46e5, #9333ea);
    transform: translateY(-2px);
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
  .error-message {
    background-color: rgba(239, 68, 68, 0.1);
    border-left: 3px solid #ef4444;
    color: #fca5a5;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  .back-link {
    margin-top: 1.5rem;
    text-align: center;
  }
  .back-button {
    background: none;
    border: none;
    color: #6366f1;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  .back-button:hover {
    color: #818cf8;
    text-decoration: underline;
  }
  @media (max-width: 640px) {
    .auth-card {
      padding: 1.5rem;
    }
  }
</style>
