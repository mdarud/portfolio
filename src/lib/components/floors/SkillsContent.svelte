<script lang="ts">
  // SkillsContent.svelte
</script>

<div class="skills-content">
  <h1>Technical Skills</h1>
  
  <div class="skills-grid">
    <div class="skill-category">
      <h2>Programming Languages</h2>
      <ul class="skill-list">
        <li>JavaScript</li>
        <li>TypeScript</li>
        <li>Python</li>
        <li>C#</li>
        <li>Java</li>
        <li>Go</li>
        <li>Rust</li>
        <li>C/C++</li>
        <li>Kotlin</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Front-End</h2>
      <ul class="skill-list">
        <li>React</li>
        <li>Angular</li>
        <li>Vue</li>
        <li>Svelte</li>
        <li>Solid.JS</li>
      </ul>
      
      <h3>Frameworks</h3>
      <ul class="skill-list">
        <li>Next.js</li>
        <li>Astro</li>
        <li>Remix.js</li>
        <li>Gatsby</li>
        <li>Nuxt</li>
        <li>Hugo</li>
      </ul>
      
      <h3>Styling</h3>
      <ul class="skill-list">
        <li>SASS</li>
        <li>LESS</li>
        <li>Bootstrap</li>
        <li>CSS</li>
        <li>Tailwind CSS</li>
        <li>Uno CSS</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Back-End</h2>
      <ul class="skill-list">
        <li>Express</li>
        <li>.NET</li>
        <li>Django</li>
        <li>Flask</li>
        <li>Spring Boot</li>
        <li>Nest.JS</li>
        <li>Hug</li>
      </ul>
      
      <h3>APIs</h3>
      <ul class="skill-list">
        <li>REST</li>
        <li>GraphQL</li>
        <li>SignalR</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>AI</h2>
      <ul class="skill-list">
        <li>NLTK</li>
        <li>spaCy</li>
        <li>PyTorch</li>
        <li>TensorFlow</li>
        <li>Hugging Face</li>
        <li>Gemini</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Software Development</h2>
      <ul class="skill-list">
        <li>Desktop: WPF, NeutralnoJS, PyQt, Tkinter, WPython</li>
        <li>Reporting: SSRS, JasperReports, SharePoint</li>
        <li>Mobile Development: Ionic, Flutter, React Native</li>
        <li>Native Apps: Android Studio, Kotlin</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>DevOps</h2>
      <ul class="skill-list">
        <li>Servers: Apache, NGINX, XAMPP</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Cloud & Distributed Systems</h2>
      <ul class="skill-list">
        <li>Containers: Docker, Kubernetes, Portainer</li>
        <li>Services: Google Cloud, Microsoft Azure, SSH</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Content Management (CMS)</h2>
      <ul class="skill-list">
        <li>Strapi</li>
        <li>Directus</li>
        <li>Keystone</li>
        <li>Ghost</li>
        <li>SharePoint</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Database Management</h2>
      <ul class="skill-list">
        <li>DBMS: MySQL, PostgreSQL, Microsoft SQL Server, Oracle, MongoDB, Neo4J</li>
        <li>ORMs: Sequelize, Prisma, Entity Framework</li>
        <li>Caching: Redis</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Testing</h2>
      <ul class="skill-list">
        <li>Automation: Selenium, Katalon</li>
        <li>Unit: Jest</li>
      </ul>
    </div>
    
    <div class="skill-category">
      <h2>Game Development</h2>
      <ul class="skill-list">
        <li>Engines: Unity, Unreal Engine, Godot Engine, Game Maker</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .skills-content {
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
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    transform: translateZ(10px);
  }
  
  .skill-category {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.2rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: rotateX(1deg);
    transition: transform 0.3s ease;
  }
  
  .skill-category:hover {
    transform: rotateX(0deg) translateZ(5px);
  }
  
  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #7dd6f3;
    border-bottom: 1px solid rgba(76, 201, 240, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.1rem;
    margin: 1rem 0 0.5rem;
    color: #7dd6f3;
  }
  
  .skill-list {
    margin-left: 1.2rem;
  }
  
  .skill-list li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.2rem;
    }
    
    .skills-grid {
      grid-template-columns: 1fr;
    }
    
    .skill-category {
      padding: 1rem;
    }
  }
</style>
