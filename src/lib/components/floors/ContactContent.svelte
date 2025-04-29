<script lang="ts">
  // ContactContent.svelte
</script>

<div class="contact-content">
  <h1>Contact Me</h1>
  
  <div class="contact-container">
    <div class="contact-info">
      <div class="contact-item">
        <div class="icon">📱</div>
        <div class="details">
          <h2>Phone</h2>
          <p>+62 877 2202 4169</p>
        </div>
      </div>
      
      <div class="contact-item">
        <div class="icon">✉️</div>
        <div class="details">
          <h2>Email</h2>
          <p><a href="mailto:darudarmakusuma@gmail.com">darudarmakusuma@gmail.com</a></p>
        </div>
      </div>
      
      <div class="contact-item">
        <div class="icon">🔗</div>
        <div class="details">
          <h2>LinkedIn</h2>
          <p><a href="https://linkedin.com/in/drmksm" target="_blank" rel="noopener noreferrer">linkedin.com/in/drmksm</a></p>
        </div>
      </div>
      
      <div class="contact-item">
        <div class="icon">💻</div>
        <div class="details">
          <h2>GitHub</h2>
          <p><a href="https://github.com/mdaru" target="_blank" rel="noopener noreferrer">github.com/mdaru</a></p>
        </div>
      </div>
    </div>
    
    <div class="contact-form">
      <h2>Send Me a Message</h2>
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" placeholder="Your name" />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Your email" />
        </div>
        
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" placeholder="Subject" />
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" rows="5" placeholder="Your message"></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>
  </div>
  
  <div class="availability">
    <h2>Current Availability</h2>
    <p>I'm currently open to:</p>
    <ul>
      <li>Full-time software engineering positions</li>
      <li>Freelance development projects</li>
      <li>Technical consulting opportunities</li>
      <li>Open source collaboration</li>
    </ul>
  </div>
</div>

<style>
  .contact-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    transform-style: preserve-3d;
    overflow-y: auto;
  }
  
  h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    transform: translateZ(20px);
    text-shadow: 0 0 10px rgba(76, 201, 240, 0.6);
  }
  
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    transform: translateZ(10px);
  }
  
  .contact-info {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: rotateX(1deg);
  }
  
  .contact-item {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: center;
  }
  
  .icon {
    font-size: 1.8rem;
    margin-right: 1rem;
    color: #4CC9F0;
  }
  
  .details h2 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
    color: #7dd6f3;
  }
  
  .details p {
    margin: 0;
  }
  
  .contact-form {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: rotateX(-1deg);
  }
  
  .contact-form h2 {
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
    color: #7dd6f3;
    border-bottom: 1px solid rgba(76, 201, 240, 0.3);
    padding-bottom: 0.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ECF0F1;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.8rem;
    background: rgba(30, 40, 50, 0.8);
    border: 1px solid rgba(76, 201, 240, 0.3);
    border-radius: 4px;
    color: #ECF0F1;
    font-family: inherit;
    transition: border-color 0.3s;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: #4CC9F0;
    box-shadow: 0 0 5px rgba(76, 201, 240, 0.5);
  }
  
  .submit-btn {
    background: rgba(76, 201, 240, 0.2);
    color: #4CC9F0;
    border: 1px solid rgba(76, 201, 240, 0.5);
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s;
    margin-top: 0.5rem;
  }
  
  .submit-btn:hover {
    background: rgba(76, 201, 240, 0.3);
    transform: translateY(-2px);
  }
  
  .availability {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: translateZ(5px) rotateX(1deg);
  }
  
  .availability h2 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #7dd6f3;
  }
  
  .availability ul {
    margin-left: 1.5rem;
  }
  
  .availability li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  a {
    color: #4CC9F0;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  a:hover {
    color: #7dd6f3;
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    .contact-container {
      grid-template-columns: 1fr;
    }
    
    .contact-info, .contact-form, .availability {
      padding: 1rem;
    }
  }
</style>
