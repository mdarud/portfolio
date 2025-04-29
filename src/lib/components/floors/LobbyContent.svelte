<script lang="ts">
  // LobbyContent.svelte
</script>

<div class="lobby-content">
  <div class="welcome-section">
    <h1>Muhammad Daru Darmakusuma</h1>
    <h2>Software Engineer</h2>
    <div class="contact-brief">
      <p>+62 877 2202 4169 | <a href="mailto:darudarmakusuma@gmail.com">darudarmakusuma@gmail.com</a></p>
      <p>
        <a href="https://linkedin.com/in/drmksm" target="_blank" rel="noopener noreferrer">linkedin.com/in/drmksm</a> | 
        <a href="https://github.com/mdaru" target="_blank" rel="noopener noreferrer">github.com/mdaru</a>
      </p>
    </div>
  </div>
  
  <div class="elevator-instructions">
    <p>Welcome to my interactive portfolio!</p>
    <p>Use the elevator buttons to navigate between floors and explore different sections of my professional profile.</p>
    <p>Each floor contains information about a specific aspect of my background and skills.</p>
  </div>
</div>

<style>
  a {
    color: inherit; /* keeps the current text color */
    text-decoration: underline;
  }
  
  .lobby-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    transform: translateZ(10px);
    perspective: 1000px;
  }
  
  .welcome-section {
    margin-bottom: 2rem;
    transform: rotateX(5deg);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(76, 201, 240, 0.6);
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #7dd6f3;
  }
  
  .contact-brief {
    margin-bottom: 2rem;
    transform: translateZ(5px);
  }
  
  .contact-brief p {
    margin-bottom: 0.5rem;
  }
  
  .elevator-instructions {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    max-width: 80%;
    transform: rotateX(-5deg) translateZ(15px);
  }
  
  .elevator-instructions p {
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .elevator-instructions {
      padding: 1rem;
    }
  }
</style>
