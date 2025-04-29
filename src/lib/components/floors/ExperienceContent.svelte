<script lang="ts">
  // ExperienceContent.svelte
</script>

<div class="experience-content">
  <h1>Professional Experience</h1>
  
  <div class="experience-item">
    <div class="experience-header">
      <h2>Software Engineer @ eComindo</h2>
      <div class="date">March 2022 - Present</div>
    </div>
    <ul class="experience-details">
      <li>
        Trained for a year before becoming a full-time Software Engineer for the past two years
      </li>
      <li>
        Worked on full-stack development across finance, banking, and education projects, building backend 
        services with Spring Boot and .NET, integrating JasperReports and SSRS for reporting, and developing 
        frontends with Angular, React, and Vue
      </li>
      <li>
        Automated testing for mobile and web apps using Katalon and Selenium
      </li>
    </ul>
    <div class="key-projects">
      <h3>Key Projects:</h3>
      <ul>
        <li>
          <strong>DPLK E-Statement (Astra Life):</strong> Developed report generation and emailing system for 100+ 
          companies' worker pension
        </li>
        <li>
          <strong>Aqunan Offline (BPEI):</strong> Enhanced functionality with .NET and SharePoint in handling precise 
          cashflow of up to Rp 100,000,000,000 per day
        </li>
        <li>
          <strong>Nahtuh:</strong> Developed payment portal and real-time messaging features for up to 1000 participants
        </li>
      </ul>
    </div>
  </div>
  
  <div class="experience-item">
    <div class="experience-header">
      <h2>Frontend Engineer & UI/UX Designer @ AI Center ITB</h2>
      <div class="date">Aug 2021 - Sep 2022</div>
    </div>
    <ul class="experience-details">
      <li>
        Designed UI/UX prototypes in Figma and developed a Vue.js dashboard for a Twitter-based Social 
        Network Analysis platform analyzing 1000+ tweets, integrating it with a FastAPI backend for seamless 
        functionality
      </li>
    </ul>
  </div>
  
  <div class="experience-item">
    <div class="experience-header">
      <h2>Software Engineer @ Universitas Kristen Maranatha Bandung</h2>
      <div class="date">Aug 2020 - Jul 2021</div>
    </div>
    <ul class="experience-details">
      <li>
        Developed a learning platform for 2000+ students and a student fund accounting app using React, 
        Express.js, and MongoDB
      </li>
      <li>
        Automated email workflows for voting and billing using Python, improving communication efficiency
      </li>
    </ul>
  </div>
</div>

<style>
  .experience-content {
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
  
  .experience-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(18, 28, 38, 0.7);
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: translateZ(10px) rotateX(1deg);
  }
  
  .experience-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(76, 201, 240, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 1.4rem;
    margin: 0;
    color: #7dd6f3;
  }
  
  .date {
    font-size: 0.9rem;
    color: #aaa;
  }
  
  .experience-details {
    margin-left: 1.2rem;
    margin-bottom: 1.2rem;
  }
  
  .experience-details li {
    margin-bottom: 0.8rem;
    line-height: 1.6;
  }
  
  .key-projects {
    margin-top: 1rem;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: #7dd6f3;
  }
  
  .key-projects ul {
    margin-left: 1.2rem;
  }
  
  .key-projects li {
    margin-bottom: 0.8rem;
    line-height: 1.6;
  }
  
  strong {
    color: #4CC9F0;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.2rem;
    }
    
    .experience-header {
      flex-direction: column;
    }
    
    .date {
      margin-top: 0.3rem;
    }
    
    .experience-item {
      padding: 1rem;
    }
  }
</style>
