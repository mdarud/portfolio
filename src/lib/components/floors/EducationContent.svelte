<script lang="ts">
  // EducationContent.svelte
</script>

<div class="education-content">
  <h1>Education</h1>
  
  <div class="education-item">
    <div class="education-header">
      <h2>Institut Teknologi Bandung (ITB)</h2>
      <div class="date">Aug 2018 - July 2023</div>
    </div>
    <div class="education-details">
      <p><strong>Bachelor of Science in Informatics / Computer Science</strong></p>
      <p>GPA: 3.25</p>
      
      <div class="thesis-section">
        <h3>Thesis</h3>
        <p>Interaction Design of Social Network Analysis Application Using User-Centered Design</p>
      </div>
      
      <div class="activities-section">
        <h3>Activities</h3>
        <p>Project Manager at Inkubator IT, Ganesha</p>
      </div>
    </div>
  </div>
  
  <!-- <div class="education-extra">
    <h2>Certifications & Additional Education</h2>
    <div class="cert-grid">
      <div class="cert-item">
        <h3>Web Development</h3>
        <ul>
          <li>Full-Stack JavaScript Development</li>
          <li>React & Redux Mastery</li>
          <li>Modern Frontend Frameworks</li>
        </ul>
      </div>
      
      <div class="cert-item">
        <h3>Cloud Computing</h3>
        <ul>
          <li>Google Cloud Platform Fundamentals</li>
          <li>Azure Developer Associate</li>
          <li>Docker & Kubernetes Essentials</li>
        </ul>
      </div>
      
      <div class="cert-item">
        <h3>AI & Machine Learning</h3>
        <ul>
          <li>Natural Language Processing with Python</li>
          <li>Deep Learning Specialization</li>
          <li>TensorFlow Developer Certificate</li>
        </ul>
      </div>
    </div>
  </div> -->
</div>

<style>
  .education-content {
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
  
  .education-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(18, 28, 38, 0.7);
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: translateZ(10px) rotateX(1deg);
  }
  
  .education-header {
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
  
  .education-details {
    margin-bottom: 1rem;
  }
  
  .education-details p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .thesis-section, .activities-section {
    margin-top: 1.2rem;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #7dd6f3;
  }
  
  strong {
    color: #4CC9F0;
    font-weight: 500;
  }
  
  .education-extra {
    padding: 1.5rem;
    background: rgba(18, 28, 38, 0.7);
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: translateZ(5px) rotateX(-1deg);
  }
  
  .cert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .cert-item {
    padding: 1rem;
    background: rgba(30, 40, 50, 0.5);
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.2);
  }
  
  .cert-item ul {
    margin-left: 1.2rem;
  }
  
  .cert-item li {
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
    
    .education-header {
      flex-direction: column;
    }
    
    .date {
      margin-top: 0.3rem;
    }
    
    .education-item, .education-extra {
      padding: 1rem;
    }
    
    .cert-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
