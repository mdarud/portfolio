<script lang="ts">
  import { currentFloorContent, elevator } from '../stores/navigationStore';
  import { fade, fly } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import type { SvelteComponent } from 'svelte';
  import { browser } from '$app/environment';
  
  // Debug state
  let debugInfo = {
    currentFloor: '',
    loadingStatus: 'Not started',
    error: null as Error | null,
    doorStatus: 'Unknown'
  };
  
  // Component loader
  let currentComponent: any = null;
  
  // Content visibility state
  let showContent = false;
  let contentReady = false;
  
  // Watch for changes to the current floor
  $: if ($currentFloorContent) {
    debugInfo.currentFloor = $currentFloorContent;
    debugInfo.loadingStatus = 'Loading...';
    loadComponent($currentFloorContent);
    contentReady = true;
    // Don't show content immediately - wait for door events
  }
  
  // Handle elevator door events
  function handleDoorsOpening() {
    debugInfo.doorStatus = 'Opening';
    // Start showing content as doors begin to open
    setTimeout(() => {
      showContent = true;
    }, 300); // Small delay to sync with door animation
  }
  
  function handleDoorsOpened() {
    debugInfo.doorStatus = 'Open';
    // Content should be fully visible now
    showContent = true;
  }
  
  function handleDoorsClosing() {
    debugInfo.doorStatus = 'Closing';
    // Start hiding content as doors begin to close
    setTimeout(() => {
      showContent = false;
    }, 300); // Small delay to sync with door animation
  }
  
  function handleDoorsClosed() {
    debugInfo.doorStatus = 'Closed';
    // Content should be fully hidden now
    showContent = false;
  }
  
  // Dynamically load the component based on the floor ID
  async function loadComponent(floorId: string) {
    try {
      console.log(`Loading component for floor: ${floorId}`);
      let component;
      
      switch (floorId) {
        case 'lobby':
          component = await import('./floors/LobbyContent.svelte');
          break;
        case 'about':
          component = await import('./floors/AboutContent.svelte');
          break;
        case 'experience':
          component = await import('./floors/ExperienceContent.svelte');
          break;
        case 'skills':
          component = await import('./floors/SkillsContent.svelte');
          break;
        case 'education':
          component = await import('./floors/EducationContent.svelte');
          break;
        case 'projects':
          component = await import('./floors/ProjectsContent.svelte');
          break;
        case 'contact':
          component = await import('./floors/ContactContent.svelte');
          break;
        default:
          component = null;
      }
      
      console.log(`Component loaded for floor ${floorId}:`, component);
      currentComponent = component ? component.default : null;
      debugInfo.loadingStatus = component ? 'Loaded successfully' : 'No component found';
      debugInfo.error = null;
    } catch (error) {
      console.error(`Error loading component for floor ${floorId}:`, error);
      currentComponent = null;
      debugInfo.loadingStatus = 'Error loading component';
      debugInfo.error = error as Error;
    }
  }
  
  // Initialize with the current floor and add event listeners
  onMount(() => {
    console.log("FloorContent mounted, current floor:", $currentFloorContent);
    
    // Only add event listeners if we're in the browser
    if (browser) {
      // Add event listeners for door events
      window.addEventListener('elevator-doors-opening', handleDoorsOpening);
      window.addEventListener('elevator-doors-opened', handleDoorsOpened);
      window.addEventListener('elevator-doors-closing', handleDoorsClosing);
      window.addEventListener('elevator-doors-closed', handleDoorsClosed);
      
      // Check if doors are already open
      if ($elevator.doorsOpen) {
        debugInfo.doorStatus = 'Open';
        showContent = true;
      }
    } else {
      // If we're server-side, show content immediately
      showContent = true;
    }
    
    if ($currentFloorContent) {
      loadComponent($currentFloorContent);
      contentReady = true;
    }
  });
  
  // Clean up event listeners
  onDestroy(() => {
    // Only remove event listeners if we're in the browser
    if (browser) {
      window.removeEventListener('elevator-doors-opening', handleDoorsOpening);
      window.removeEventListener('elevator-doors-opened', handleDoorsOpened);
      window.removeEventListener('elevator-doors-closing', handleDoorsClosing);
      window.removeEventListener('elevator-doors-closed', handleDoorsClosed);
    }
  });
</script>

<div class="floor-content">
  {#if currentComponent && contentReady && showContent}
    <div 
      transition:fade={{ duration: 800, delay: 200 }}
      class="room-container severance-style"
    >
      <!-- 3D Room with walls -->
      <div class="room">
        <div class="wall wall-front">
          <!-- Front wall content -->
        </div>
        <div class="wall wall-back">
          <!-- Back wall content -->
        </div>
        <div class="wall wall-left">
          <!-- Left wall content -->
        </div>
        <div class="wall wall-right">
          <!-- Right wall content -->
        </div>
        <div class="wall wall-ceiling">
          <!-- Ceiling content -->
        </div>
        <div class="wall wall-floor">
          <!-- Floor content -->
        </div>
        
        <!-- Content component rendered inside the room -->
        <div class="room-content">
          <svelte:component this={currentComponent} />
        </div>
      </div>
    </div>
  {:else if contentReady && !showContent}
    <!-- Content is ready but waiting for doors to open -->
    <div class="content-hidden"></div>
  {:else}
    <div class="debug-info" transition:fade={{ duration: 300 }}>
      <h3>Floor Content Debug</h3>
      <p>Current Floor: {debugInfo.currentFloor || 'None'}</p>
      <p>Status: {debugInfo.loadingStatus}</p>
      <p>Door Status: {debugInfo.doorStatus}</p>
      {#if debugInfo.error}
        <p class="error">Error: {debugInfo.error.message}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .floor-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3; /* Below the elevator interior but above the shaft */
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* 3D Room Container */
  .room-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateZ(30px) perspective(1000px);
    transform-style: preserve-3d;
    pointer-events: auto;
    width: 80vmin; /* Slightly wider to accommodate the 3D room */
    height: 75vh; /* Slightly shorter than the doorway */
    /* Position the content to be visible through the elevator doorway */
    z-index: 15; /* Between the doorway and the doors */
  }
  
  /* 3D Room */
  .room {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  /* Walls */
  .wall {
    position: absolute;
    background-color: rgba(18, 28, 38, 0.95);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(76, 201, 240, 0.3);
    /* Text effect to make it look like writing on walls */
    background-image: 
      linear-gradient(rgba(76, 201, 240, 0.05), rgba(76, 201, 240, 0.02)),
      url('/textures/elevator_texture.jpg');
    background-blend-mode: overlay;
    background-size: cover;
  }
  
  /* Front wall (facing the viewer) */
  .wall-front {
    width: 100%;
    height: 100%;
    transform: translateZ(40vmin);
    /* Clip the front wall to create a doorway effect */
    clip-path: polygon(
      0 0, 15% 0, 15% 15%, 
      85% 15%, 85% 0, 
      100% 0, 100% 100%, 
      0 100%
    );
  }
  
  /* Back wall */
  .wall-back {
    width: 100%;
    height: 100%;
    transform: translateZ(-40vmin) rotateY(180deg);
  }
  
  /* Left wall */
  .wall-left {
    width: 80vmin; /* Same as room depth */
    height: 100%;
    transform: rotateY(90deg) translateZ(40vmin);
    left: -40vmin;
  }
  
  /* Right wall */
  .wall-right {
    width: 80vmin; /* Same as room depth */
    height: 100%;
    transform: rotateY(-90deg) translateZ(40vmin);
    right: -40vmin;
  }
  
  /* Ceiling */
  .wall-ceiling {
    width: 100%;
    height: 80vmin; /* Same as room depth */
    transform: rotateX(90deg) translateZ(40vmin);
    top: -40vmin;
    background-image: 
      linear-gradient(rgba(76, 201, 240, 0.05), rgba(76, 201, 240, 0.02)),
      url('/textures/elevator_ceiling_texture.jpg');
  }
  
  /* Floor */
  .wall-floor {
    width: 100%;
    height: 80vmin; /* Same as room depth */
    transform: rotateX(-90deg) translateZ(40vmin);
    bottom: -40vmin;
    background-image: 
      linear-gradient(rgba(76, 201, 240, 0.05), rgba(76, 201, 240, 0.02)),
      url('/textures/elevator_floor_texture.jpg');
  }
  
  /* Room content */
  .room-content {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    overflow-y: auto;
    color: #ECF0F1;
    padding: 2rem;
    box-sizing: border-box;
    /* Text effect to make it look like writing on walls */
    text-shadow: 0 0 5px rgba(76, 201, 240, 0.7);
  }
  
  /* Make content appear to be written on walls */
  .room-content :global(*) {
    transform-style: preserve-3d;
  }
  
  .room-content :global(section) {
    margin-bottom: 2rem;
    transform: translateZ(5px);
  }
  
  .severance-style {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: 0.05em;
    line-height: 1.6;
  }
  
  .severance-style :global(h1),
  .severance-style :global(h2),
  .severance-style :global(h3) {
    color: #4CC9F0;
    font-weight: 500;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
    /* Make headings appear to glow on the wall */
    text-shadow: 
      0 0 5px rgba(76, 201, 240, 0.7),
      0 0 10px rgba(76, 201, 240, 0.5);
  }
  
  .severance-style :global(h1) {
    font-size: 1.8rem;
    border-bottom: 1px solid rgba(76, 201, 240, 0.3);
    padding-bottom: 0.5rem;
    transform: translateZ(10px); /* Make it pop out from the wall */
  }
  
  .severance-style :global(h2) {
    font-size: 1.4rem;
    transform: translateZ(7px); /* Make it pop out from the wall */
  }
  
  .severance-style :global(h3) {
    font-size: 1.2rem;
    transform: translateZ(5px); /* Make it pop out from the wall */
  }
  
  .severance-style :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    /* Text effect to make it look like writing on walls */
    text-shadow: 0 0 3px rgba(236, 240, 241, 0.5);
    transform: translateZ(3px); /* Slight pop out from the wall */
  }
  
  .severance-style :global(a) {
    color: #4CC9F0;
    text-decoration: none;
    transition: color 0.2s, text-shadow 0.2s;
    /* Make links glow on the wall */
    text-shadow: 0 0 5px rgba(76, 201, 240, 0.7);
  }
  
  .severance-style :global(a:hover) {
    color: #7dd6f3;
    text-decoration: underline;
    /* Enhanced glow on hover */
    text-shadow: 
      0 0 8px rgba(76, 201, 240, 0.9),
      0 0 15px rgba(76, 201, 240, 0.5);
  }
  
  .severance-style :global(ul),
  .severance-style :global(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
    transform: translateZ(2px); /* Slight pop out from the wall */
  }
  
  .severance-style :global(li) {
    margin-bottom: 0.5rem;
    /* Text effect to make it look like writing on walls */
    text-shadow: 0 0 3px rgba(236, 240, 241, 0.5);
  }
  
  .severance-style :global(hr) {
    border: none;
    border-top: 1px solid rgba(76, 201, 240, 0.3);
    margin: 2rem 0;
    /* Glow effect for horizontal rules */
    box-shadow: 0 0 5px rgba(76, 201, 240, 0.5);
  }
  
  .severance-style :global(blockquote) {
    border-left: 3px solid #4CC9F0;
    padding-left: 1rem;
    margin-left: 0;
    color: rgba(236, 240, 241, 0.8);
    font-style: italic;
    /* Glow effect for blockquotes */
    box-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
    transform: translateZ(4px); /* Make it pop out from the wall */
  }
  
  .content-hidden {
    display: none;
  }
  
  /* Severance-inspired scrollbar styling */
  .room-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .room-content::-webkit-scrollbar-track {
    background: #1a1a2e;
    border-radius: 3px;
  }
  
  .room-content::-webkit-scrollbar-thumb {
    background: #4cc9f0;
    border-radius: 3px;
    border: 1px solid rgba(76, 201, 240, 0.3);
  }
  
  .room-content::-webkit-scrollbar-thumb:hover {
    background: #7dd6f3;
  }
  
  /* Severance-inspired selection styling */
  .severance-style :global(::selection) {
    background-color: rgba(76, 201, 240, 0.3);
    color: #ECF0F1;
  }
  
  .debug-info {
    background-color: rgba(30, 30, 30, 0.9);
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #444;
  }
  
  .debug-info h3 {
    margin-top: 0;
    color: #fff;
  }
  
  .debug-info .error {
    color: #ff6b6b;
  }
  
  @media (max-width: 768px) {
    .room-container {
      width: 90vmin;
    }
    
    .room-content {
      padding: 1.5rem;
    }
    
    /* Adjust wall dimensions for mobile */
    .wall-left, .wall-right {
      width: 60vmin; /* Smaller depth on mobile */
    }
    
    .wall-ceiling, .wall-floor {
      height: 60vmin; /* Smaller depth on mobile */
    }
    
    .wall-front, .wall-back {
      transform: translateZ(30vmin); /* Smaller depth on mobile */
    }
  }
</style>
