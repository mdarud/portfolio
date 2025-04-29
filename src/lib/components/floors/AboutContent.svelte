<script lang="ts">
  // AboutContent.svelte
</script>

<div class="about-content">
  <h1>About Me</h1>
  
  <div class="about-section">
    <p>
      I'm a passionate Software Engineer with expertise in full-stack development, 
      specializing in building robust applications across various domains including finance, 
      banking, and education.
    </p>
    
    <p>
      With a strong foundation in Computer Science and a focus on interaction design, 
      I bring a user-centered approach to software development, creating solutions 
      that are not only technically sound but also intuitive and accessible.
    </p>
    
    <p>
      My experience spans from developing enterprise-level systems handling millions 
      of transactions to creating educational platforms serving thousands of students.
      I'm particularly interested in the intersection of technology and user experience, 
      always striving to build software that makes a positive impact.
    </p>
  </div>
  
  <div class="personal-section">
    <h2>Personal Projects</h2>
    <div class="project-item">
      <h3>PlatesAI</h3>
      <p>
        An AI-powered web application for home cooks to create and manage recipes, 
        ingredient stocks, and grocery lists. Built with Svelte, FastAPI, Gemini AI, 
        and PostgreSQL.
      </p>
    </div>
  </div>
</div>

<style>
  .about-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    transform-style: preserve-3d;
  }
  
  h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    transform: translateZ(20px);
    text-shadow: 0 0 10px rgba(76, 201, 240, 0.6);
  }
  
  h2 {
    font-size: 1.6rem;
    margin: 1.5rem 0 1rem;
    transform: translateZ(15px);
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #7dd6f3;
  }
  
  .about-section {
    margin-bottom: 2rem;
    transform: translateZ(10px) rotateX(2deg);
  }
  
  .about-section p {
    margin-bottom: 1rem;
    line-height: 1.7;
    text-align: justify;
  }
  
  .personal-section {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: translateZ(5px) rotateX(-2deg);
  }
  
  .project-item {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.4rem;
    }
    
    .personal-section {
      padding: 1rem;
    }
  }
</style>
