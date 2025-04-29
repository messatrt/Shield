<script>
  // Import any additional dependencies if needed

  function handleSignup() {
    // Handle the sign-up process
    alert("Sign up form will open!");
  }
</script>

<section class="hero-container">
  <div class="content">
    <h1>Crypto Insights</h1>
    <h2>Make Smarter Investment Decisions</h2>
    <p>
      Advanced analytics and real-time data to help you navigate the crypto
      market with confidence.
    </p>

    <div class="metrics">
      <div class="metric">
        <span class="number">25K+</span>
        <span class="label">Active Users</span>
      </div>
      <div class="metric">
        <span class="number">50+</span>
        <span class="label">Cryptocurrencies</span>
      </div>
      <div class="metric">
        <span class="number">99.9%</span>
        <span class="label">Uptime</span>
      </div>
    </div>
  </div>

  <div class="graphic">
    <!-- Three floating animated squares -->
    <div class="floating-square square1"></div>
    <div class="floating-square square2"></div>
    <div class="floating-square square3"></div>
  </div>
</section>

<style>
  .hero-container {
    height: 500px;
    display: flex;
    min-height: 50vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 0.6rem;
    position: relative;
    overflow: hidden;
  }

  .hero-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 30%,
        rgba(76, 29, 149, 0.3) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(14, 165, 233, 0.2) 0%,
        transparent 40%
      );
    z-index: 1;
  }

  .content {
    width: 60%;
    position: relative;
    z-index: 2;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #8b5cf6, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #e2e8f0;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #cbd5e1;
    max-width: 540px;
    line-height: 1.6;
  }

  .button-container {
    margin-bottom: 2rem;
  }

  button {
    background: linear-gradient(to right, #8b5cf6, #4f46e5);
    color: white;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.1rem;
  }

  button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .metrics {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
  }

  .number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .label {
    font-size: 0.9rem;
    color: #94a3b8;
  }

  .graphic {
    width: 40%;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Floating Squares */
  .floating-square {
    position: absolute;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
    opacity: 0.7;
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.4);
  }

  .square1 {
    width: 120px;
    height: 120px;
    top: 20%;
    right: 15%;
    animation: float1 8s ease-in-out infinite;
  }

  .square2 {
    width: 80px;
    height: 80px;
    top: 50%;
    right: 30%;
    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
    animation: float2 10s ease-in-out infinite;
  }

  .square3 {
    width: 150px;
    height: 150px;
    bottom: 20%;
    right: 20%;
    background: linear-gradient(135deg, #6d28d9 0%, #4338ca 100%);
    animation: float3 12s ease-in-out infinite;
  }

  @keyframes float1 {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-20px, -15px) rotate(10deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes float2 {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(15px, -25px) rotate(-5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes float3 {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-15px, 20px) rotate(8deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @media (max-width: 768px) {
    .hero-container {
      flex-direction: column;
    }

    .content,
    .graphic {
      width: 100%;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .graphic {
      height: 300px;
      margin-top: 2rem;
    }

    .square1 {
      right: auto;
      left: 15%;
    }

    .square2 {
      right: auto;
      left: 40%;
    }

    .square3 {
      right: auto;
      left: 60%;
    }
  }
</style>
