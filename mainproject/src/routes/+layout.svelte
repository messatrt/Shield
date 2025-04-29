<script>
  import logo from "$lib/logo.svg";
  import pro from "$lib/pro.svg";
  import { loggedIn } from "$lib/components/env.svelte";
  let { children } = $props();
</script>

<header class="navbar">
  <div class="container">
    <div class="logo-section">
      <a href="/">
        <img src={logo} alt="Site Logo" />
        <span>CryptoShield</span>
      </a>
    </div>

    <div class="nav-and-actions">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {#if loggedIn}
            <li>
              <a href="/portfolio">Portfolio</a>
            </li>
          {/if}
        </ul>
      </nav>

      <div class="user-actions">
        <div class="search-container">
          <input type="text" placeholder="Search..." aria-label="Search" />
          <button type="submit" class="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        {#if loggedIn}
          <img src={pro} alt="profile" class="pro" />
        {:else}
          <button class="signin-button"><a href="/login">Sign Up</a></button>
        {/if}
      </div>
    </div>
  </div>
</header>

{@render children()}

<style>
  :global(body) {
    margin: 0;
    background-color: #0f172a;
    color: #e2e8f0;
    font-family: -apple-systemi, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .navbar {
    background: linear-gradient(
      90deg,
      rgba(15, 23, 42, 0.95),
      rgba(23, 31, 54, 0.95)
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 0.75rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-section a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #f1f5f9;
    font-weight: 700;
    font-size: 1.4rem;
    letter-spacing: -0.5px;
  }

  .logo-section img {
    height: 36px;
    margin-right: 0.75rem;
  }
  .pro {
    height: 36px;
    margin-right: 0.75rem;
  }

  .nav-and-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2.5rem;
  }

  nav a {
    text-decoration: none;
    color: #cbd5e1;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.2s ease;
    position: relative;
  }

  nav a:hover {
    color: #60a5fa;
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-container input {
    background-color: rgba(51, 65, 85, 0.7);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 8px;
    padding: 0.6rem 1rem;
    padding-right: 2.5rem;
    width: 220px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    color: #e2e8f0;
  }

  .search-container input::placeholder {
    color: #94a3b8;
  }

  .search-container input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
    background-color: rgba(51, 65, 85, 0.9);
    width: 260px;
    border-color: rgba(96, 165, 250, 0.5);
  }

  .search-button {
    position: absolute;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .signin-button {
    background: linear-gradient(90deg, #3b82f6, #4f46e5);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
  }

  .signin-button:hover {
    background: linear-gradient(90deg, #2563eb, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }

  main {
    max-width: 1400px;
    margin: 0 auto;
    min-height: calc(100vh - 80px);
    position: relative;
  }

  @media (max-width: 1024px) {
    .container {
      padding: 0 1.5rem;
    }

    .search-container input {
      width: 180px;
    }

    .search-container input:focus {
      width: 220px;
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      gap: 1rem;
      padding: 0 1rem;
    }

    .logo-section {
      align-self: flex-start;
    }

    .nav-and-actions {
      flex-direction: column;
      width: 100%;
      gap: 1rem;
    }

    nav {
      width: 100%;
    }

    nav ul {
      justify-content: space-between;
      width: 100%;
    }

    .user-actions {
      width: 100%;
      justify-content: space-between;
    }

    .search-container {
      flex: 1;
      max-width: 60%;
    }

    .search-container input {
      width: 100%;
    }

    .search-container input:focus {
      width: 100%;
    }
  }
</style>
