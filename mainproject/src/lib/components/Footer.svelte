<!-- Footer.svelte -->
<script>
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="footer-container">
    <div class="footer-section logo-section">
      <h2>CryptoTracker</h2>
      <p>Your trusted source for real-time cryptocurrency information and market analysis.</p>
      <div class="social-icons">
        <a href="/" aria-label="Twitter"><i class="icon twitter"></i></a>
        <a href="/" aria-label="Discord"><i class="icon discord"></i></a>
        <a href="/" aria-label="Telegram"><i class="icon telegram"></i></a>
        <a href="/" aria-label="Github"><i class="icon github"></i></a>
      </div>
    </div>
    
    <div class="footer-section">
      <h3>Resources</h3>
      <ul>
        <li><a href="/">Market Analysis</a></li>
        <li><a href="/">Trading Guides</a></li>
        <li><a href="/">Developer API</a></li>
        <li><a href="/">Learning Hub</a></li>
      </ul>
    </div>
    
    <div class="footer-section">
      <h3>Company</h3>
      <ul>
        <li><a href="/">About Us</a></li>
        <li><a href="/">Careers</a></li>
        <li><a href="/">Blog</a></li>
        <li><a href="/">Press Kit</a></li>
      </ul>
    </div>
    
    <div class="footer-section">
      <h3>Support</h3>
      <ul>
        <li><a href="/">Help Center</a></li>
        <li><a href="/">Contact Us</a></li>
        <li><a href="/">Bug Reports</a></li>
        <li><a href="/">Feature Requests</a></li>
      </ul>
    </div>
  </div>
  
  <div class="footer-bottom">
    <div class="footer-container">
      <p>&copy; {currentYear} CryptoTracker. All rights reserved.</p>
      <div class="legal-links">
        <a href="/">Privacy Policy</a>
        <a href="/">Terms of Service</a>
        <a href="/">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    background: linear-gradient(to bottom, #0a0a10, #080820);
    color: #b8a8ff;
    padding: 60px 0 20px;
    position: relative;
    border-top: 1px solid rgba(100, 50, 200, 0.3);
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .footer-section {
    flex: 1;
    min-width: 200px;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  
  .logo-section {
    flex: 2;
    min-width: 300px;
  }
  
  .logo-section h2 {
    font-size: 24px;
    margin: 0 0 15px;
    background: linear-gradient(to right, #b8a8ff, #6e3bdf);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
  
  .logo-section p {
    color: #a19ac1;
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 400px;
  }
  
  h3 {
    color: #ffffff;
    font-size: 18px;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
  }
  
  h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #6e3bdf, #4a1e9e);
    border-radius: 3px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  ul li {
    margin-bottom: 12px;
  }
  
  ul li a {
    color: #a19ac1;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
    position: relative;
  }
  
  ul li a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: #6e3bdf;
    transition: width 0.3s ease;
  }
  
  ul li a:hover {
    color: #d8ceff;
    transform: translateX(3px);
  }
  
  ul li a:hover::after {
    width: 100%;
  }
  
  .social-icons {
    display: flex;
    gap: 12px;
    margin-top: 15px;
  }
  
  .icon {
    display: inline-block;
    width: 36px;
    height: 36px;
    background-color: rgba(100, 50, 200, 0.2);
    border-radius: 50%;
    position: relative;
    transition: all 0.3s;
  }
  
  .social-icons a {
    display: inline-block;
    color: #b8a8ff;
    transition: all 0.3s;
  }
  
  .social-icons a:hover {
    transform: translateY(-3px);
  }
  
  .social-icons a:hover .icon {
    background-color: rgba(130, 80, 255, 0.3);
    box-shadow: 0 5px 15px rgba(110, 59, 223, 0.3);
  }
  
  /* Simplified icons using pseudo-elements */
  .icon::before, 
  .icon::after {
    content: '';
    position: absolute;
    background-color: #b8a8ff;
  }
  
  .twitter::before {
    width: 18px;
    height: 14px;
    border-radius: 3px;
    top: 11px;
    left: 9px;
    clip-path: polygon(0 35%, 35% 35%, 45% 0, 55% 0, 65% 35%, 100% 35%, 100% 50%, 85% 100%, 15% 100%, 0 50%);
  }
  
  .discord::before {
    width: 20px;
    height: 15px;
    border-radius: 5px;
    top: 10px;
    left: 8px;
    clip-path: polygon(10% 25%, 90% 25%, 100% 100%, 80% 100%, 75% 80%, 25% 80%, 20% 100%, 0 100%);
  }
  
  .telegram::before {
    width: 18px;
    height: 18px;
    top: 9px;
    left: 9px;
    clip-path: polygon(0 45%, 20% 45%, 40% 65%, 75% 30%, 100% 30%, 50% 80%, 20% 50%, 0 50%);
  }
  
  .github::before {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    top: 8px;
    left: 8px;
    background-color: transparent;
    border: 2px solid #b8a8ff;
    box-sizing: border-box;
  }
  
  .github::after {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 11px;
    left: 13px;
  }
  
  .footer-bottom {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(100, 50, 200, 0.2);
  }
  
  .footer-bottom .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .footer-bottom p {
    color: #a19ac1;
    margin: 10px 0;
  }
  
  .legal-links {
    display: flex;
    gap: 20px;
  }
  
  .legal-links a {
    color: #a19ac1;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
  }
  
  .legal-links a:hover {
    color: #d8ceff;
  }
  
  @media (max-width: 768px) {
    .footer-section {
      flex: 100%;
      margin-bottom: 40px;
    }
    
    .footer-bottom .footer-container {
      flex-direction: column;
      text-align: center;
    }
    
    .legal-links {
      margin-top: 15px;
      justify-content: center;
    }
  }
</style>
