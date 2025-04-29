<script lang="ts">
  // ProjectsContent.svelte
</script>

<div class="projects-content">
  <h1>Projects</h1>

  <div class="projects-grid">
    <div class="project-card">
      <h2>
        <a
          href="https://plates-ai.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          PlatesAI
        </a>
      </h2>
      <div class="project-tags">
        <span class="tag">Svelte</span>
        <span class="tag">FastAPI</span>
        <span class="tag">Gemini AI</span>
        <span class="tag">PostgreSQL</span>
      </div>
      <p class="project-description">
        An AI-powered web application for home cooks to create and manage
        recipes, ingredient stocks, and grocery lists. The app uses AI to
        suggest recipes based on available ingredients and dietary preferences.
      </p>
      <div class="project-features">
        <h3>Key Features:</h3>
        <ul>
          <li>AI-powered recipe suggestions</li>
          <li>Ingredient inventory management</li>
          <li>Smart grocery list generation</li>
          <li>Meal planning calendar</li>
          <li>Nutritional analysis</li>
        </ul>
      </div>
    </div>

    <div class="project-card">
      <h2>
        <a
          href="https://pseudoku.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pseudoku
        </a>
      </h2>

      <div class="project-tags">
        <span class="tag">Svelte</span>
        <span class="tag">DLX</span>
        <span class="tag">Backtracking</span>
        <span class="tag">Bit Manipulation</span>
      </div>

      <p class="project-description">
        A Sudoku solver built with Svelte that supports multiple solving
        algorithms, including Dancing Links (DLX), bitwise backtracking, and
        classic backtracking. Pseudoku lets users visualize the solving process
        step-by-step.
      </p>

      <div class="project-features">
        <h3>Key Features:</h3>
        <ul>
          <li>
            Three solving algorithms: DLX, bit-based backtracking, and simple
            backtracking
          </li>
          <li>Interactive Sudoku grid with input validation</li>
          <li>Step-by-step solving animation</li>
          <li>Instant switch between solving strategies</li>
          <li>Lightweight UI powered by Svelte</li>
        </ul>
      </div>
    </div>

    <div class="project-card">
      <h2>Social Network Analysis Platform</h2>
      <div class="project-tags">
        <span class="tag">Vue.js</span>
        <span class="tag">FastAPI</span>
        <span class="tag">NLTK</span>
        <span class="tag">Figma</span>
      </div>
      <p class="project-description">
        A Twitter-based Social Network Analysis platform analyzing 1000+ tweets,
        featuring a Vue.js dashboard with interactive visualizations and
        real-time data processing.
      </p>
      <div class="project-features">
        <h3>Key Features:</h3>
        <ul>
          <li>Real-time tweet analysis</li>
          <li>Sentiment analysis visualization</li>
          <li>Network graph relationships</li>
          <li>Trend identification</li>
          <li>User influence metrics</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  a {
    color: inherit; /* keeps the current text color */
    text-decoration: underline;
  }
  .projects-content {
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

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    transform: translateZ(10px);
  }

  .project-card {
    background: rgba(18, 28, 38, 0.7);
    padding: 1.5rem;
    border-radius: 5px;
    border: 1px solid rgba(76, 201, 240, 0.3);
    transform: rotateX(1deg);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .project-card:hover {
    transform: rotateX(0deg) translateZ(5px);
    box-shadow: 0 0 15px rgba(76, 201, 240, 0.3);
  }

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    color: #7dd6f3;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    background: rgba(76, 201, 240, 0.2);
    color: #4cc9f0;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    font-size: 0.8rem;
    border: 1px solid rgba(76, 201, 240, 0.3);
  }

  .project-description {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #7dd6f3;
  }

  .project-features ul {
    margin-left: 1.2rem;
  }

  .project-features li {
    margin-bottom: 0.4rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .project-card {
      padding: 1rem;
    }
  }
</style>
