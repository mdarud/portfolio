<script lang="ts">
  import CssElevatorScene from '$lib/components/CssElevatorScene.svelte';
</script>

<main>
  <!-- CSS 3D Elevator Scene -->
  <CssElevatorScene />
</main>

<style>
  /* Import Helvetica Neue-like fonts for Severance theme */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Arial, 'Inter', sans-serif;
    background-color: #0A192F; /* Darker blue for Severance feel */
    color: #ECF0F1;
    overflow: hidden;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  main {
    width: 100%;
    height: 100vh;
    position: relative;
  }
</style>
