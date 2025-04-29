<script>
  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let agreeTerms = false;

  const handleSignup = () => {
    // Placeholder for signup logic
    console.log("Signup attempt:", { name, email, password, agreeTerms });
  };
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1 class="auth-title">Create Account</h1>
    <p class="auth-subtitle">Join us to start trading crypto</p>

    <form on:submit|preventDefault={handleSignup} class="auth-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          bind:value={name}
          required
        />
      </div>

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

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          bind:value={confirmPassword}
          required
        />
      </div>

      <button type="submit" class="auth-button">Create Account</button>
    </form>

    <div class="auth-footer">
      <p>Already have an account? <a href="/login">Sign in</a></p>
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
  }

  .auth-button:hover {
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

  @media (max-width: 640px) {
    .auth-card {
      padding: 1.5rem;
    }
  }
</style>
