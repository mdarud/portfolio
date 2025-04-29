<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { gsap } from "gsap";
  import {
    elevator,
    floors,
    currentFloorContent,
  } from "../stores/navigationStore";
  import { browser } from "$app/environment";
  import { fade } from "svelte/transition";

  // Component mapping
  let floorComponents: Record<string, any> = {};

  // Load components dynamically
  async function loadFloorComponents() {
    try {
      const lobbyModule = await import("./floors/LobbyContent.svelte");
      const aboutModule = await import("./floors/AboutContent.svelte");
      const experienceModule = await import(
        "./floors/ExperienceContent.svelte"
      );
      const skillsModule = await import("./floors/SkillsContent.svelte");
      const educationModule = await import("./floors/EducationContent.svelte");
      const projectsModule = await import("./floors/ProjectsContent.svelte");
      const contactModule = await import("./floors/ContactContent.svelte");

      floorComponents = {
        lobby: lobbyModule.default,
        about: aboutModule.default,
        experience: experienceModule.default,
        skills: skillsModule.default,
        education: educationModule.default,
        projects: projectsModule.default,
        contact: contactModule.default,
      };
    } catch (error) {
      console.error("Error loading floor components:", error);
    }
  }

  // Elevator state
  let isMoving = false;
  let doorsOpen = false;
  let currentFloor = 0;
  let targetFloor = null;

  // DOM references
  let elevatorCabin: HTMLElement;
  let leftDoor: HTMLElement;
  let rightDoor: HTMLElement;
  let floorDisplay: HTMLElement;
  let directionIndicator: HTMLElement;

  // Scroll handling
  let lastScrollY = 0;
  let scrollTimeout: number | null = null;
  let scrollDirection: "up" | "down" | "idle" = "idle";
  let isScrolling = false;
  let scrollAccumulator = 0; // Track accumulated scroll distance
  let contentScrollTop = 0; // Track content scroll position
  let contentScrollHeight = 0; // Track content scroll height
  let contentClientHeight = 0; // Track content client height
  let isAtContentEdge = false; // Flag to indicate if we're at the edge of content

  // Constants
  const FLOOR_HEIGHT = 100; // vh units
  const DOOR_ANIMATION_DURATION = 1.5; // seconds
  const ELEVATOR_SPEED = 8; // vh per second
  const SCROLL_THRESHOLD = 50; // Minimum scroll distance to trigger floor change
  const SCROLL_DEBOUNCE_TIME = 400; // ms to wait before processing scroll
  const CONTENT_EDGE_OFFSET = 30; // Pixels from edge to trigger floor change

  // Subscribe to elevator store changes
  $: if ($elevator.isMoving && $elevator.targetFloor && !isMoving) {
    moveElevator($elevator.currentFloor.level, $elevator.targetFloor.level);
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if ($elevator.isMoving) return;

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      // Determine direction
      const direction = event.key === "ArrowDown" ? "down" : "up";

      // Show direction indicator immediately for better feedback
      updateDirectionIndicator(direction);

      // Special handling for lobby - check if it's scrollable first
      if ($elevator.doorsOpen && $elevator.currentFloor.id === "lobby") {
        const contentWrapper = document.querySelector(
          ".floor-content-wrapper"
        ) as HTMLElement;

        if (contentWrapper) {
          // Check for scrollable child elements in the lobby
          const floorContent = contentWrapper.firstElementChild as HTMLElement;
          const hasScrollableChild =
            floorContent &&
            window.getComputedStyle(floorContent).overflowY === "auto" &&
            floorContent.scrollHeight > floorContent.clientHeight;

          // If the lobby content is scrollable, check if we're at the edge
          if (hasScrollableChild) {
            // Get scroll information
            const scrollTop = floorContent.scrollTop;
            const scrollHeight = floorContent.scrollHeight;
            const clientHeight = floorContent.clientHeight;

            // Use a consistent offset for lobby (same as in checkContentEdge)
            const lobbyEdgeOffset = 20;

            // Check if we're at the top or bottom edge with the offset
            const isAtTop = scrollTop <= lobbyEdgeOffset;
            const isAtBottom =
              scrollTop + clientHeight >= scrollHeight - lobbyEdgeOffset;

            // If we're not at the edge in the direction of key press, allow normal scrolling
            if (
              (direction === "down" && !isAtBottom) ||
              (direction === "up" && !isAtTop)
            ) {
              // Reset direction indicator if we're not at the edge
              updateDirectionIndicator("idle");
              // Don't prevent default to allow normal content scrolling
              return;
            }
          }
        }

        // If we get here, either:
        // 1. Lobby content is not scrollable, or
        // 2. We're at the edge of scrollable content

        // Prevent default behavior (page scrolling)
        event.preventDefault();

        // Set scroll direction and scrolling flag
        scrollDirection = direction;
        isScrolling = true;

        // Debug log
        console.log("Key press detected in lobby", event.key);

        // Handle scroll end immediately with lower threshold for lobby
        handleScrollEnd();
        return; // Skip the rest of the function for lobby
      }

      // If doors are open and content is scrollable, check if we should allow content scrolling
      if ($elevator.doorsOpen) {
        const contentWrapper = document.querySelector(
          ".floor-content-wrapper"
        ) as HTMLElement;
        if (contentWrapper) {
          // Check for scrollable child elements (some floor components have their own scrollable areas)
          const floorContent = contentWrapper.firstElementChild as HTMLElement;
          const hasScrollableChild =
            floorContent &&
            window.getComputedStyle(floorContent).overflowY === "auto" &&
            floorContent.scrollHeight > floorContent.clientHeight;

          // Determine which element to check for scrolling
          const scrollElement = hasScrollableChild
            ? floorContent
            : contentWrapper;

          // Get scroll information
          contentScrollTop = scrollElement.scrollTop;
          contentScrollHeight = scrollElement.scrollHeight;
          contentClientHeight = scrollElement.clientHeight;

          // Check if content is scrollable
          const isScrollable = contentScrollHeight > contentClientHeight;

          // If content is scrollable and not at the edge in the direction of key press
          if (isScrollable) {
            const isAtTop = contentScrollTop <= CONTENT_EDGE_OFFSET;
            const isAtBottom =
              contentScrollTop + contentClientHeight >=
              contentScrollHeight - CONTENT_EDGE_OFFSET;

            // If we're not at the edge in the direction of key press, allow normal scrolling
            if (
              (direction === "down" && !isAtBottom) ||
              (direction === "up" && !isAtTop)
            ) {
              // Reset direction indicator if we're not at the edge
              updateDirectionIndicator("idle");
              // Don't prevent default to allow normal content scrolling
              return;
            }
          }
        }
      }

      // Prevent default behavior (page scrolling)
      event.preventDefault();

      // Set scroll direction based on key
      scrollDirection = direction;

      // Set flag to indicate scrolling
      isScrolling = true;

      // Debug log
      console.log("Key press detected", event.key);

      // Handle scroll end immediately
      handleScrollEnd();
    }
  }

  onMount(() => {
    if (!browser) return;

    // Load floor components
    loadFloorComponents();

    // Initialize with current floor position
    updateElevatorPosition($elevator.currentFloor.level);
    updateFloorDisplay($elevator.currentFloor.name);

    // Add event listeners
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    // Set initial door state
    if ($elevator.doorsOpen) {
      openDoors(false); // No animation on initial state
    } else {
      closeDoors(false); // No animation on initial state
    }
  });

  onDestroy(() => {
    if (!browser) return;

    // Remove event listeners
    window.removeEventListener("wheel", handleScroll);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("keydown", handleKeyDown);

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  });

  // Update elevator position
  function updateElevatorPosition(floor: number) {
    if (!elevatorCabin) return;

    const position = -floor * FLOOR_HEIGHT;
    elevatorCabin.style.transform = `translateY(${position}vh)`;
  }

  // Update floor display
  function updateFloorDisplay(floorName: string) {
    if (!floorDisplay) return;

    floorDisplay.textContent = floorName;
  }

  // Update direction indicator
  function updateDirectionIndicator(direction: "up" | "down" | "idle") {
    if (!directionIndicator) return;

    if (direction === "up") {
      directionIndicator.textContent = "▲";
      directionIndicator.style.display = "block";
      directionIndicator.style.opacity = "1";
    } else if (direction === "down") {
      directionIndicator.textContent = "▼";
      directionIndicator.style.display = "block";
      directionIndicator.style.opacity = "1";
    } else {
      // Instead of hiding completely, just reduce opacity
      // This ensures the element is still in the DOM and can be quickly shown
      directionIndicator.style.opacity = "0";
    }
  }

  // Move POV forward to see content with camera shake effect
  function moveViewForward() {
    const elevatorInterior = document.querySelector(
      ".elevator-interior"
    ) as HTMLElement;
    if (!elevatorInterior) return;

    // First move back slightly
    gsap.to(elevatorInterior, {
      z: "-20vmin",
      duration: 0.8,
      ease: "power1.inOut",
    });

    setTimeout(() => {
      // Create a timeline for the forward movement with camera shake
      const timeline = gsap.timeline();

      // Add camera shake effect to simulate walking
      const shakeIntensity = 3; // Increased shake intensity
      const stepFrequency = 0.12; // More frequent steps

      // Move forward with walking effect - increased duration
      timeline.to(elevatorInterior, {
        z: "150vmin", // Increased from 100vmin to provide a better view
        duration: 2.5, // Increased duration to make animation more noticeable
        ease: "power2.inOut",
        onUpdate: function () {
          // Only apply shake during the movement
          const progress = this.progress();
          if (progress > 0.05 && progress < 0.95) {
            // Calculate shake based on a sine wave for natural step pattern
            const stepPhase = Math.sin(
              (progress / stepFrequency) * Math.PI * 2
            );
            const verticalShake =
              Math.sin((progress / stepFrequency) * Math.PI * 10) *
              shakeIntensity;
            const horizontalShake =
              Math.cos((progress / stepFrequency) * Math.PI * 8) *
              (shakeIntensity * 0.7);

            // Apply the shake - using direct DOM manipulation for more reliable effect
            gsap.set(elevatorInterior, {
              y: verticalShake,
              x: horizontalShake,
              rotationX: stepPhase * 0.2,
              overwrite: "auto",
            });
          }
        },
        onComplete: () => {
          // Reset any residual shake
          gsap.set(elevatorInterior, {
            y: 0,
            x: 0,
            rotationX: 0,
          });

          // Ensure content is visible by adjusting the elevator doorway
          const doorway = document.querySelector(
            ".elevator-doorway"
          ) as HTMLElement;
          if (doorway) {
            gsap.to(doorway, {
              width: "80vmin", // Wider doorway for better content visibility
              height: "85vh", // Slightly taller doorway
              duration: 0.2,
              ease: "power1.out",
            });
          }
        },
      });
    }, 1000);
  }

  // Move POV back into elevator with camera shake effect
  function moveViewBack() {
    const elevatorInterior = document.querySelector(
      ".elevator-interior"
    ) as HTMLElement;
    if (!elevatorInterior) return;

    // Reset doorway to original size first
    const doorway = document.querySelector(".elevator-doorway") as HTMLElement;
    if (doorway) {
      gsap.to(doorway, {
        width: "90vmin",
        height: "80vh",
        duration: 0.3,
        ease: "power1.in",
      });
    }

    // Create a timeline for the backward movement with camera shake
    const timeline = gsap.timeline();

    // Add camera shake effect to simulate walking
    const shakeIntensity = 2.5; // Increased intensity for more noticeable effect
    const stepFrequency = 0.15; // Time between "steps"

    // Move back with walking effect - increased duration
    timeline.to(elevatorInterior, {
      z: "0vmin",
      duration: 2.0, // Increased duration to make animation more noticeable
      ease: "power1.inOut",
      onUpdate: function () {
        // Only apply shake during the movement
        const progress = this.progress();
        if (progress > 0.05 && progress < 0.95) {
          // Calculate shake based on a sine wave for natural step pattern
          const stepPhase = Math.sin((progress / stepFrequency) * Math.PI * 2);
          const verticalShake =
            Math.sin((progress / stepFrequency) * Math.PI * 10) *
            shakeIntensity;
          const horizontalShake =
            Math.cos((progress / stepFrequency) * Math.PI * 8) *
            (shakeIntensity * 0.7);

          // Apply the shake - using direct GSAP manipulation for more reliable effect
          gsap.set(elevatorInterior, {
            y: verticalShake,
            x: horizontalShake,
            rotationX: stepPhase * 0.8,
            overwrite: "auto",
          });
        }
      },
      onComplete: () => {
        // Reset any residual shake
        gsap.set(elevatorInterior, {
          y: 0,
          x: 0,
          rotationX: 0,
        });
      },
    });
  }

  // Open elevator doors
  function openDoors(animate = true) {
    if (!leftDoor || !rightDoor) return;

    if (animate) {
      // Dispatch doors opening event
      if (browser) {
        const doorsOpeningEvent = new CustomEvent("elevator-doors-opening");
        window.dispatchEvent(doorsOpeningEvent);
      }

      // Clear any existing animations
      gsap.killTweensOf(leftDoor);
      gsap.killTweensOf(rightDoor);

      // Animate doors opening
      gsap.to(leftDoor, {
        duration: DOOR_ANIMATION_DURATION,
        x: "-100%",
        ease: "power1.inOut",
        delay: 0.1,
        onComplete: () => {
          // Ensure door is fully open
          leftDoor.style.transform = "translateX(-100%)";
        },
      });

      gsap.to(rightDoor, {
        duration: DOOR_ANIMATION_DURATION,
        x: "100%",
        ease: "power1.inOut",
        onComplete: () => {
          // Ensure door is fully open
          rightDoor.style.transform = "translateX(100%)";

          // Dispatch custom event that content can listen for
          if (browser) {
            const doorsOpenedEvent = new CustomEvent("elevator-doors-opened");
            window.dispatchEvent(doorsOpenedEvent);

            // Update store
            elevator.openDoors();

            // Move POV forward to see content
            moveViewForward();
          }
        },
      });
    } else {
      // Set doors open without animation
      leftDoor.style.transform = "translateX(-100%)";
      rightDoor.style.transform = "translateX(100%)";
    }
  }

  // Close elevator doors
  function closeDoors(animate = true) {
    if (!leftDoor || !rightDoor) return;

    // Move POV back into elevator first
    moveViewBack();

    if (animate) {
      // Dispatch doors closing event
      if (browser) {
        const doorsClosingEvent = new CustomEvent("elevator-doors-closing");
        window.dispatchEvent(doorsClosingEvent);
      }

      // First, clear any existing GSAP animations
      gsap.killTweensOf(leftDoor);
      gsap.killTweensOf(rightDoor);

      // Force reset the door positions
      leftDoor.style.transform = "translateX(0px)";
      rightDoor.style.transform = "translateX(0px)";

      // Now animate with GSAP
      gsap.fromTo(
        leftDoor,
        { x: leftDoor._gsap ? leftDoor._gsap.x : 0 },
        {
          duration: DOOR_ANIMATION_DURATION,
          x: 0,
          ease: "power1.inOut",
          delay: 0.1,
          onComplete: () => {
            // Force reset again to ensure door is fully closed
            leftDoor.style.transform = "translateX(0px)";
          },
        }
      );

      gsap.fromTo(
        rightDoor,
        { x: rightDoor._gsap ? rightDoor._gsap.x : 0 },
        {
          duration: DOOR_ANIMATION_DURATION,
          x: 0,
          ease: "power1.inOut",
          onComplete: () => {
            // Force reset again to ensure door is fully closed
            rightDoor.style.transform = "translateX(0px)";

            // Dispatch custom event that content can listen for
            if (browser) {
              const doorsClosedEvent = new CustomEvent("elevator-doors-closed");
              window.dispatchEvent(doorsClosedEvent);

              // Update store
              elevator.closeDoors();
            }
          },
        }
      );
    } else {
      // Set doors closed without animation
      leftDoor.style.transform = "translateX(0px)";
      rightDoor.style.transform = "translateX(0px)";
    }
  }

  function moveElevator(fromFloor: number, toFloor: number) {
    if (isMoving || !elevatorCabin) return;

    isMoving = true;

    const direction = toFloor > fromFloor ? "down" : "up";
    updateDirectionIndicator(direction);

    const targetFloorInfo = floors.find((f) => f.level === toFloor);
    if (targetFloorInfo) {
      updateFloorDisplay(targetFloorInfo.name);
    }

    // Get references to elements we'll animate
    const elevatorInterior = document.querySelector(
      ".elevator-interior"
    ) as HTMLElement;
    const ceilingLight = document.querySelector(
      ".ceiling-light"
    ) as HTMLElement;
    const walls = document.querySelectorAll(".wall") as NodeListOf<HTMLElement>;

    closeDoors();

    setTimeout(
      () => {
        const distance = Math.abs(toFloor - fromFloor);

        // Adjust travel duration based on distance between floors
        // For longer distances, make the animation longer but not linearly
        // This creates a more realistic feel when skipping multiple floors
        let travelDuration;
        if (distance === 1) {
          // Standard duration for single floor
          travelDuration = 1.4 / ELEVATOR_SPEED;
        } else if (distance === 2) {
          // Slightly longer for two floors
          travelDuration = (distance / ELEVATOR_SPEED) * 1.3;
        } else if (distance === 3) {
          // Even longer for three floors
          travelDuration = (distance / ELEVATOR_SPEED) * 1.2;
        } else {
          // For 4+ floors, use a diminishing returns formula
          // This prevents extremely long animations when skipping many floors
          travelDuration = (Math.log(distance + 1) / ELEVATOR_SPEED) * 3.5;
        }

        const targetY = -toFloor * FLOOR_HEIGHT;

        // Create main movement timeline
        const timeline = gsap.timeline({
          onComplete: () => {
            updateDirectionIndicator("idle");
            elevator.arriveAtFloor();
            openDoors();
            isMoving = false;
          },
        });

        // Add subtle squash before moving
        timeline.to(elevatorCabin, {
          scaleY: 0.97,
          scaleX: 1.02,
          duration: 0.3,
          ease: "power2.inOut",
        });

        // Flicker lights to indicate movement start
        timeline.to(
          ceilingLight,
          {
            opacity: 0.7,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "none",
          },
          "<"
        );

        // Add subtle camera shake to enhance movement feeling
        if (elevatorInterior) {
          timeline.to(
            elevatorInterior,
            {
              rotateX: "-2deg",
              duration: 0.4,
              ease: "power1.out",
            },
            "<0.1"
          );
        }

        // Start enhanced shake effect
        const shakeTween = gsap.to(elevatorCabin, {
          x: () => (Math.random() - 0.5) * 6, // Increased shake amplitude
          y: () => targetY + (Math.random() - 0.5) * 3, // Add slight vertical jitter
          repeat: -1,
          yoyo: true,
          duration: 0.08, // Faster shake for more realism
          ease: "sine.inOut",
        });

        // Add subtle wall movement to enhance 3D effect
        walls.forEach((wall) => {
          timeline.to(
            wall,
            {
              backgroundPosition: `${Math.random() * 10}px ${direction === "down" ? "-50px" : "50px"}`,
              duration: travelDuration,
              ease: "none",
            },
            "<0.2"
          );
        });

        // Move vertically with improved easing
        timeline.to(
          elevatorCabin,
          {
            y: targetY,
            duration: travelDuration,
            ease: "power3.inOut", // Smoother acceleration/deceleration
          },
          "<0.1" // Slight delay after squash
        );

        // Reset camera angle during movement
        if (elevatorInterior) {
          timeline.to(
            elevatorInterior,
            {
              rotateX: "0deg",
              duration: travelDuration * 0.5,
              ease: "power1.inOut",
            },
            "<" + travelDuration * 0.25
          );
        }

        // Add arrival bump
        timeline.to(
          elevatorCabin,
          {
            scaleY: 0.96,
            scaleX: 1.03,
            duration: 0.2,
            ease: "power3.out",
          },
          "<" + (travelDuration - 0.2)
        );

        // Stop shake and reset transform after move
        timeline.add(() => {
          shakeTween.kill();
          gsap.to(elevatorCabin, {
            x: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)", // Bouncy finish
          });

          // Reset wall positions
          walls.forEach((wall) => {
            gsap.to(wall, {
              backgroundPosition: "0px 0px",
              duration: 0.5,
              ease: "power1.out",
            });
          });

          // Final light flicker on arrival
          const flickerTimeline = gsap.timeline();
          flickerTimeline
            .to(ceilingLight, { opacity: 1, duration: 0.1 })
            .to(ceilingLight, { opacity: 0.8, duration: 0.1 })
            .to(ceilingLight, { opacity: 1, duration: 0.1 })
            .to(ceilingLight, { opacity: 0.9, duration: 0.1 })
            .to(ceilingLight, { opacity: 1, duration: 0.1 });
        });
      },
      DOOR_ANIMATION_DURATION * 1000 + 800
    );
  }

  // Check if we're at the edge of content
  function checkContentEdge() {
    if (!$elevator.doorsOpen) return false;

    // Get the content wrapper element
    const contentWrapper = document.querySelector(
      ".floor-content-wrapper"
    ) as HTMLElement;
    if (!contentWrapper) {
      console.log("Content wrapper not found");
      return false;
    }

    // Get the current floor ID for debugging
    const currentFloorId = $elevator.currentFloor.id;

    // Handle lobby the same way as other floors, but with a smaller offset
    if (currentFloorId === "lobby") {
      // Check for scrollable child elements in the lobby
      const floorContent = contentWrapper.firstElementChild as HTMLElement;
      const hasScrollableChild =
        floorContent &&
        window.getComputedStyle(floorContent).overflowY === "auto" &&
        floorContent.scrollHeight > floorContent.clientHeight;

      // If the lobby content itself is scrollable, check its scroll position
      if (hasScrollableChild) {
        console.log("Lobby floor - scrollable content detected");

        // Get scroll information from the child element
        contentScrollTop = floorContent.scrollTop;
        contentScrollHeight = floorContent.scrollHeight;
        contentClientHeight = floorContent.clientHeight;

        // Use a consistent offset for lobby (same as other floors but smaller)
        const lobbyEdgeOffset = 20; // Slightly larger than before for better user experience

        // Check if we're at the top or bottom edge with the offset
        const isAtTop = contentScrollTop <= lobbyEdgeOffset;
        const isAtBottom =
          contentScrollTop + contentClientHeight >=
          contentScrollHeight - lobbyEdgeOffset;

        console.log("Lobby scroll position:", {
          scrollTop: contentScrollTop,
          scrollHeight: contentScrollHeight,
          clientHeight: contentClientHeight,
          isAtTop,
          isAtBottom,
        });

        return isAtTop || isAtBottom;
      } else {
        // If lobby content is not scrollable, we still want a small threshold
        // to prevent accidental elevator movement
        console.log("Lobby floor - not scrollable, using small threshold");
        return true; // Still return true but we'll handle the threshold in scroll handlers
      }
    }

    // Check for scrollable child elements (some floor components have their own scrollable areas)
    const floorContent = contentWrapper.firstElementChild as HTMLElement;
    const hasScrollableChild =
      floorContent &&
      window.getComputedStyle(floorContent).overflowY === "auto" &&
      floorContent.scrollHeight > floorContent.clientHeight;

    // If the floor content itself is scrollable, check its scroll position
    if (hasScrollableChild) {
      console.log(`Floor ${currentFloorId} - Using child element scroll info`);

      // Get scroll information from the child element
      contentScrollTop = floorContent.scrollTop;
      contentScrollHeight = floorContent.scrollHeight;
      contentClientHeight = floorContent.clientHeight;
    } else {
      // Otherwise use the wrapper's scroll info
      contentScrollTop = contentWrapper.scrollTop;
      contentScrollHeight = contentWrapper.scrollHeight;
      contentClientHeight = contentWrapper.clientHeight;
    }

    // Check if content is not scrollable (no scrollbar)
    const isNotScrollable = contentScrollHeight <= contentClientHeight;

    // Debug log for all floors
    console.log(`Floor ${currentFloorId} - Content scroll info:`, {
      scrollTop: contentScrollTop,
      scrollHeight: contentScrollHeight,
      clientHeight: contentClientHeight,
      isScrollable: !isNotScrollable,
      hasScrollableChild: hasScrollableChild,
    });

    // If content is not scrollable, always consider it at the edge
    if (isNotScrollable) {
      console.log(
        `Floor ${currentFloorId} - Content is not scrollable, always at edge`
      );
      return true;
    }

    // Use a smaller edge offset for better detection
    const edgeOffset = currentFloorId === "lobby" ? 10 : CONTENT_EDGE_OFFSET;

    // Check if we're at the top or bottom edge with offset
    const isAtTop = contentScrollTop <= edgeOffset;
    const isAtBottom =
      contentScrollTop + contentClientHeight >=
      contentScrollHeight - edgeOffset;

    // Debug log
    console.log(
      `Floor ${currentFloorId} - At top:`,
      isAtTop,
      "At bottom:",
      isAtBottom
    );

    return isAtTop || isAtBottom;
  }

  // Scroll handling for elevator navigation
  function handleScroll(event: WheelEvent) {
    // Disable scrolling during animations
    if ($elevator.isMoving || isScrolling) {
      event.preventDefault();
      return;
    }

    // Determine scroll direction
    const direction = event.deltaY > 0 ? "down" : "up";

    // Show direction indicator immediately for better feedback
    // This helps users see that their scroll is being detected
    updateDirectionIndicator(direction);

    // Special handling for lobby - check if it's scrollable first
    if ($elevator.doorsOpen && $elevator.currentFloor.id === "lobby") {
      const contentWrapper = document.querySelector(
        ".floor-content-wrapper"
      ) as HTMLElement;

      if (contentWrapper) {
        // Check for scrollable child elements in the lobby
        const floorContent = contentWrapper.firstElementChild as HTMLElement;
        const hasScrollableChild =
          floorContent &&
          window.getComputedStyle(floorContent).overflowY === "auto" &&
          floorContent.scrollHeight > floorContent.clientHeight;

        // If the lobby content is scrollable, check if we're at the edge
        if (hasScrollableChild) {
          // Get scroll information
          const scrollTop = floorContent.scrollTop;
          const scrollHeight = floorContent.scrollHeight;
          const clientHeight = floorContent.clientHeight;

          // Use a consistent offset for lobby (same as in checkContentEdge)
          const lobbyEdgeOffset = 20;

          // Check if we're at the top or bottom edge with the offset
          const isAtTop = scrollTop <= lobbyEdgeOffset;
          const isAtBottom =
            scrollTop + clientHeight >= scrollHeight - lobbyEdgeOffset;

          // If we're not at the edge, allow normal scrolling
          if (
            (direction === "down" && !isAtBottom) ||
            (direction === "up" && !isAtTop)
          ) {
            // Reset direction indicator if we're not at the edge
            updateDirectionIndicator("idle");
            // Don't prevent default to allow normal content scrolling
            return;
          }
        }
      }

      // If we get here, either:
      // 1. Lobby content is not scrollable, or
      // 2. We're at the edge of scrollable content

      // Prevent default scrolling behavior
      event.preventDefault();

      // Accumulate scroll distance
      scrollAccumulator += Math.abs(event.deltaY);

      // Set direction and scrolling flags
      if (scrollDirection === "idle") {
        scrollDirection = direction;
      }
      isScrolling = true;

      // Reset scroll timeout and handle debounce
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Use a shorter debounce time for lobby to make it more responsive
      scrollTimeout = window.setTimeout(() => {
        if (scrollAccumulator >= SCROLL_THRESHOLD * 0.7) {
          // Lower threshold for lobby
          handleScrollEnd();
        } else {
          isScrolling = false;
          scrollDirection = "idle";
          scrollAccumulator = 0;
          updateDirectionIndicator("idle");
        }
      }, SCROLL_DEBOUNCE_TIME * 0.8); // Shorter debounce time

      return; // Skip the rest of the function for lobby
    }

    // If doors are open, check if we should allow content scrolling
    if ($elevator.doorsOpen) {
      // Get the content wrapper element
      const contentWrapper = document.querySelector(
        ".floor-content-wrapper"
      ) as HTMLElement;
      if (contentWrapper) {
        // Check for scrollable child elements (some floor components have their own scrollable areas)
        const floorContent = contentWrapper.firstElementChild as HTMLElement;
        const hasScrollableChild =
          floorContent &&
          window.getComputedStyle(floorContent).overflowY === "auto" &&
          floorContent.scrollHeight > floorContent.clientHeight;

        // Determine which element to check for scrolling
        const scrollElement = hasScrollableChild
          ? floorContent
          : contentWrapper;

        // Get scroll information
        contentScrollTop = scrollElement.scrollTop;
        contentScrollHeight = scrollElement.scrollHeight;
        contentClientHeight = scrollElement.clientHeight;

        // Check if content is not scrollable (no scrollbar)
        const isNotScrollable = contentScrollHeight <= contentClientHeight;

        // If content is not scrollable, always handle elevator movement
        if (isNotScrollable) {
          console.log("Content is not scrollable, handling elevator movement");
          // Continue to elevator movement logic below
        } else {
          // Content is scrollable, check if we're at the edge
          isAtContentEdge = checkContentEdge();

          // If we're not at the edge, or we're at the bottom and scrolling up, or at the top and scrolling down
          // then allow normal content scrolling
          if (
            !isAtContentEdge ||
            (contentScrollTop + contentClientHeight >=
              contentScrollHeight - CONTENT_EDGE_OFFSET &&
              direction === "up") ||
            (contentScrollTop <= CONTENT_EDGE_OFFSET && direction === "down")
          ) {
            // Reset direction indicator if we're not at the edge
            updateDirectionIndicator("idle");
            // Don't prevent default to allow normal content scrolling
            return;
          }
        }
      }
    }

    // If we get here, we're either:
    // 1. Doors are closed, or
    // 2. At the edge of content and scrolling in the direction to change floors

    // Prevent default scrolling behavior
    event.preventDefault();

    // Accumulate scroll distance
    scrollAccumulator += Math.abs(event.deltaY);

    // Debug log
    console.log(
      "Elevator scroll detected",
      event.deltaY,
      "accumulated:",
      scrollAccumulator
    );

    // Set direction only if we're not already scrolling in a direction
    if (scrollDirection === "idle") {
      scrollDirection = direction;
    }

    // Reset scroll timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set flag to indicate scrolling
    isScrolling = true;

    // Set timeout to handle end of scrolling with debounce
    scrollTimeout = window.setTimeout(() => {
      // Only trigger floor change if we've scrolled enough
      if (scrollAccumulator >= SCROLL_THRESHOLD) {
        handleScrollEnd();
      } else {
        // Reset if we didn't scroll enough
        isScrolling = false;
        scrollDirection = "idle";
        scrollAccumulator = 0;
        updateDirectionIndicator("idle");
      }
    }, SCROLL_DEBOUNCE_TIME);
  }

  // Touch handling for mobile
  let touchStartY = 0;

  function handleTouchStart(event: TouchEvent) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    if ($elevator.isMoving) return;

    const touchY = event.touches[0].clientY;
    const diff = touchStartY - touchY;

    // Only process if the touch movement is significant
    if (Math.abs(diff) > 10) {
      // Determine direction
      const direction = diff > 0 ? "down" : "up";

      // Show direction indicator immediately for better feedback
      // This helps users see that their touch is being detected
      updateDirectionIndicator(direction);

      // Special handling for lobby - check if it's scrollable first
      if ($elevator.doorsOpen && $elevator.currentFloor.id === "lobby") {
        const contentWrapper = document.querySelector(
          ".floor-content-wrapper"
        ) as HTMLElement;

        if (contentWrapper) {
          // Check for scrollable child elements in the lobby
          const floorContent = contentWrapper.firstElementChild as HTMLElement;
          const hasScrollableChild =
            floorContent &&
            window.getComputedStyle(floorContent).overflowY === "auto" &&
            floorContent.scrollHeight > floorContent.clientHeight;

          // If the lobby content is scrollable, check if we're at the edge
          if (hasScrollableChild) {
            // Get scroll information
            const scrollTop = floorContent.scrollTop;
            const scrollHeight = floorContent.scrollHeight;
            const clientHeight = floorContent.clientHeight;

            // Use a consistent offset for lobby (same as in checkContentEdge)
            const lobbyEdgeOffset = 20;

            // Check if we're at the top or bottom edge with the offset
            const isAtTop = scrollTop <= lobbyEdgeOffset;
            const isAtBottom =
              scrollTop + clientHeight >= scrollHeight - lobbyEdgeOffset;

            // If we're not at the edge, allow normal scrolling
            if (
              (direction === "down" && !isAtBottom) ||
              (direction === "up" && !isAtTop)
            ) {
              // Reset direction indicator if we're not at the edge
              updateDirectionIndicator("idle");
              // Don't prevent default to allow normal content scrolling
              return;
            }
          }
        }

        // If we get here, either:
        // 1. Lobby content is not scrollable, or
        // 2. We're at the edge of scrollable content

        // Prevent default scrolling behavior
        event.preventDefault();

        // Accumulate scroll distance
        scrollAccumulator += Math.abs(diff);

        // Set direction and scrolling flags
        if (scrollDirection === "idle") {
          scrollDirection = direction;
        }
        isScrolling = true;

        // Reset scroll timeout and handle debounce
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Use a shorter debounce time for lobby to make it more responsive
        scrollTimeout = window.setTimeout(() => {
          if (scrollAccumulator >= SCROLL_THRESHOLD * 0.7) {
            // Lower threshold for lobby
            handleScrollEnd();
          } else {
            isScrolling = false;
            scrollDirection = "idle";
            scrollAccumulator = 0;
            updateDirectionIndicator("idle");
          }
        }, SCROLL_DEBOUNCE_TIME * 0.8); // Shorter debounce time

        return; // Skip the rest of the function for lobby
      }

      // If doors are open, check if we should allow content scrolling
      if ($elevator.doorsOpen) {
        // Get the content wrapper element
        const contentWrapper = document.querySelector(
          ".floor-content-wrapper"
        ) as HTMLElement;
        if (contentWrapper) {
          // Check for scrollable child elements (some floor components have their own scrollable areas)
          const floorContent = contentWrapper.firstElementChild as HTMLElement;
          const hasScrollableChild =
            floorContent &&
            window.getComputedStyle(floorContent).overflowY === "auto" &&
            floorContent.scrollHeight > floorContent.clientHeight;

          // Determine which element to check for scrolling
          const scrollElement = hasScrollableChild
            ? floorContent
            : contentWrapper;

          // Get scroll information
          contentScrollTop = scrollElement.scrollTop;
          contentScrollHeight = scrollElement.scrollHeight;
          contentClientHeight = scrollElement.clientHeight;

          // Check if content is not scrollable (no scrollbar)
          const isNotScrollable = contentScrollHeight <= contentClientHeight;

          // If content is not scrollable, always handle elevator movement
          if (isNotScrollable) {
            console.log(
              "Content is not scrollable (touch), handling elevator movement"
            );
            // Continue to elevator movement logic below
          } else {
            // Content is scrollable, check if we're at the edge
            isAtContentEdge = checkContentEdge();

            // If we're not at the edge, or we're at the bottom and scrolling up, or at the top and scrolling down
            // then allow normal content scrolling
            if (
              !isAtContentEdge ||
              (contentScrollTop + contentClientHeight >=
                contentScrollHeight - CONTENT_EDGE_OFFSET &&
                direction === "up") ||
              (contentScrollTop <= CONTENT_EDGE_OFFSET && direction === "down")
            ) {
              // Reset direction indicator if we're not at the edge
              updateDirectionIndicator("idle");
              // Don't prevent default to allow normal content scrolling
              return;
            }
          }
        }
      }

      // If we get here, we're either:
      // 1. Doors are closed, or
      // 2. At the edge of content and scrolling in the direction to change floors

      // Prevent default scrolling behavior
      event.preventDefault();

      // Accumulate scroll distance
      scrollAccumulator += Math.abs(diff);

      // Debug log
      console.log(
        "Elevator touch detected",
        diff,
        "accumulated:",
        scrollAccumulator
      );

      // Set direction only if we're not already scrolling in a direction
      if (scrollDirection === "idle") {
        scrollDirection = direction;
      }

      // Reset scroll timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set flag to indicate scrolling
      isScrolling = true;

      // Set timeout to handle end of scrolling with debounce
      scrollTimeout = window.setTimeout(() => {
        // Only process if we've scrolled enough
        if (scrollAccumulator >= SCROLL_THRESHOLD) {
          handleScrollEnd();
        } else {
          // Reset if we didn't scroll enough
          isScrolling = false;
          scrollDirection = "idle";
          scrollAccumulator = 0;
          updateDirectionIndicator("idle");
        }
      }, SCROLL_DEBOUNCE_TIME);
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    // If we're scrolling and have accumulated enough distance, process the scroll
    if (isScrolling) {
      // Special handling for lobby - use lower threshold
      if ($elevator.doorsOpen && $elevator.currentFloor.id === "lobby") {
        if (scrollAccumulator >= SCROLL_THRESHOLD * 0.6) {
          // Even lower threshold for touch end
          console.log(
            "Lobby floor - processing with lower threshold on touch end"
          );
          handleScrollEnd();
        } else {
          // Reset if we didn't scroll enough
          isScrolling = false;
          scrollDirection = "idle";
          scrollAccumulator = 0;
          updateDirectionIndicator("idle");
        }
        return;
      }

      // Check if content is not scrollable
      const contentWrapper = document.querySelector(
        ".floor-content-wrapper"
      ) as HTMLElement;
      if (contentWrapper && $elevator.doorsOpen) {
        // Check for scrollable child elements (some floor components have their own scrollable areas)
        const floorContent = contentWrapper.firstElementChild as HTMLElement;
        const hasScrollableChild =
          floorContent &&
          window.getComputedStyle(floorContent).overflowY === "auto" &&
          floorContent.scrollHeight > floorContent.clientHeight;

        // Determine which element to check for scrolling
        const scrollElement = hasScrollableChild
          ? floorContent
          : contentWrapper;

        // Get scroll information
        contentScrollHeight = scrollElement.scrollHeight;
        contentClientHeight = scrollElement.clientHeight;
        const isNotScrollable = contentScrollHeight <= contentClientHeight;

        // If content is not scrollable, always process the scroll with a lower threshold
        if (isNotScrollable && scrollAccumulator >= SCROLL_THRESHOLD * 0.5) {
          console.log(
            "Content is not scrollable (touch end), processing with lower threshold"
          );
          handleScrollEnd();
          return;
        }
      }

      // Normal threshold check for scrollable content
      if (scrollAccumulator >= SCROLL_THRESHOLD) {
        handleScrollEnd();
      } else {
        // Reset if we didn't scroll enough
        isScrolling = false;
        scrollDirection = "idle";
        scrollAccumulator = 0;
        updateDirectionIndicator("idle"); // Make sure to reset the indicator
      }
    } else {
      // Even if we weren't scrolling, ensure the direction indicator is reset
      updateDirectionIndicator("idle");
    }
  }

  // Handle end of scrolling
  function handleScrollEnd() {
    if (!isScrolling) return;

    // Reset scrolling state
    isScrolling = false;

    // Reset scroll accumulator
    scrollAccumulator = 0;

    // Get current floor and determine target floor
    const currentLevel = $elevator.currentFloor.level;
    let targetLevel;

    if (scrollDirection === "down") {
      // Move down (increase level)
      targetLevel = Math.min(currentLevel + 1, floors.length - 1);
    } else {
      // Move up (decrease level)
      targetLevel = Math.max(currentLevel - 1, 0);
    }

    // Find the floor with the target level
    const targetFloor = floors.find((f) => f.level === targetLevel);

    // Debug log
    console.log(
      "Scroll end, moving from floor",
      currentLevel,
      "to",
      targetLevel
    );

    // If we found a target floor and it's different from the current floor
    if (targetFloor && targetFloor.id !== $elevator.currentFloor.id) {
      console.log("Going to floor", targetFloor.id);
      elevator.goToFloor(targetFloor.id);
    }

    // Reset scroll direction
    scrollDirection = "idle";
  }

  // Handle button click
  function handleButtonClick(floorId: string) {
    elevator.goToFloor(floorId);
  }
</script>

<div class="elevator-scene severance-theme">
  <!-- Elevator interior (we're inside looking out) -->
  <div class="elevator-interior">
    <div class="elevator-ceiling">
      <div class="ceiling-light"></div>
    </div>

    <div class="elevator-walls">
      <div class="wall back-wall"></div>
      <div class="wall left-wall"></div>
      <div class="wall right-wall"></div>
    </div>

    <!-- Elevator shaft - this moves to simulate elevator movement -->
    <div class="elevator-shaft" bind:this={elevatorCabin}>
      {#each floors as floor}
        <div class="floor-marker" id={`floor-${floor.level}`}>
          <div class="floor-number"></div>
        </div>
      {/each}
    </div>

    <div class="elevator-floor"></div>

    <!-- Elevator doorway - this is what we look through -->
    <div class="elevator-doorway">
      <!-- Floor indicator above the door -->
      <div class="floor-indicator-above-door">
        <div class="indicator-display">
          <div class="floor-name" bind:this={floorDisplay}>Lobby</div>
          <div class="direction-arrow" bind:this={directionIndicator}></div>
        </div>
      </div>
      <!-- Door frame - this is the frame surrounding the doorway -->
      <div class="door-frame"></div>
      <!-- Elevator doors -->
      <div class="elevator-doors">
        <div class="door left-door" bind:this={leftDoor}></div>
        <div class="door right-door" bind:this={rightDoor}></div>
      </div>
    </div>
  </div>

  <!-- Floor content container - positioned outside the elevator -->
  <div class="floor-content-container">
    {#if $elevator.doorsOpen}
      <div
        class="floor-content-wrapper"
        in:fade={{ duration: 800, delay: 2000 }}
        out:fade={{ duration: 400 }}
      >
        <svelte:component this={floorComponents[$elevator.currentFloor.id]} />
      </div>
    {/if}
  </div>

  <!-- Navigation indicator -->
  <div class="scroll-indicator severance-style">
    <span>Scroll content normally, or scroll past edges to change floors</span>
  </div>
</div>

<style>
  /* Severance theme variables */
  @font-face {
    font-family: 'Digital7';
    src: url('fonts/digital-7.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  :root {
    --lumon-blue: #1c304a;
    --dark-blue: #0a192f;
    --terminal-blue: #4cc9f0;
    --off-white: #ecf0f1;
    --near-black: #121212;
    --door-color: #2c3e50;
    --wall-color: #34495e;
    --floor-color: #2c3c4c;
    --ceiling-color: #ecf0f1;
  }

  /* Main container */
  .elevator-scene {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    perspective: 1200px;
    overflow: hidden;
    touch-action: none;
    z-index: 100; /* Increased z-index to ensure visibility */
    pointer-events: all; /* Capture all pointer events to handle scroll */
  }

  /* Elevator shaft - this is outside the elevator */
  .elevator-shaft {
    position: absolute;
    width: 100%;
    z-index: 80; /* Higher than elevator interior but lower than doors */
    top: 0;
    left: 0;
    /* Dynamically tall enough for all floors */
    height: calc(100vh * 7); /* If you have 7 floors */
  }

  /* Elevator interior */
  .elevator-interior {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    perspective: 1000px;
    z-index: 105; /* Increased z-index to ensure visibility */
    background-color: var(--wall-color);
    pointer-events: none; /* Allow interaction with content beneath */
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.7);
  }

  /* Walls */
  .elevator-walls {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .wall {
    position: absolute;
    background-color: var(--wall-color);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
    /* Add Severance-style wall panels */
    background-image: url("textures/elevator_texture.jpg");
    background-size: 50% 100%;
  }

  .back-wall {
    width: 100%;
    height: 100%;
    transform: translateZ(-40vmin);
  }

  .left-wall {
    width: 140vmin;
    height: 100%;
    transform: rotateY(90deg) translateZ(-90vmin);
    left: 42%;
  }

  .right-wall {
    width: 140vmin;
    height: 100%;
    transform: rotateY(-90deg) translateZ(-90vmin);
    right: 42%;
  }

  /* Floor */
  .elevator-floor {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--floor-color);
    transform: rotateX(-90deg) translateZ(40vmin);
    background-image: url("textures/elevator_floor_texture.jpg");
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
  }

  /* Ceiling */
  .elevator-ceiling {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--ceiling-color);
    transform: rotateX(90deg) translateZ(40vmin);
    background-image: repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.05),
      rgba(0, 0, 0, 0.05) 20px,
      rgba(0, 0, 0, 0) 20px,
      rgba(0, 0, 0, 0) 40px
    );
    /* background-size removed or adjusted */
  }

  .ceiling-light {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 30%;
    background-color: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(200, 200, 200, 0.5);
    /* Add flickering animation for Severance feel */
    animation: light-flicker 8s infinite;
  }

  @keyframes light-flicker {
    0% {
      opacity: 1;
    }
    1% {
      opacity: 0.8;
    }
    2% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    86% {
      opacity: 0.9;
    }
    87% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    96% {
      opacity: 0.8;
    }
    97% {
      opacity: 1;
    }
  }

  /* Door frame - this is the frame surrounding the doorway (upside-down U shape) */
  .door-frame {
    position: fixed;
    top: 56%;
    left: 50%;
    width: 86vmin; /* Wider than the doorway to create the frame */
    height: 96vh; /* Taller than the doorway to create the frame */
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    z-index: 116; /* Just below the doorway */
    /* Custom background for the door frame */
    background-color: #243447; /* Darker blue */
    /* Create a distinct background that's clearly different from the elevator interior */
    background-image: url("textures/elevator_texture.jpg");
    background-size: auto 100%;
    /* Add some texture and depth */
    box-shadow:
      0 0 40px rgba(0, 0, 0, 0.8),
      inset 0 0 20px rgba(76, 201, 240, 0.15);
    /* Create the upside-down U shape by using a clip-path */
    clip-path: polygon(
      0% 0%,
      /* Top left */ 100% 0%,
      /* Top right */ 100% 100%,
      /* Bottom right */ 85% 100%,
      /* Bottom right inner corner */ 85% 15%,
      /* Right inner side */ 15% 15%,
      /* Bottom inner side */ 15% 100%,
      /* Bottom left inner corner */ 0% 100% /* Bottom left */
    );
    /* Add a subtle pattern */
    background-size: 100% 100%;
    /* Ensure content is properly framed */
    box-sizing: border-box;
  }

  /* Elevator doorway - this frames the view to the outside */
  .elevator-doorway {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80vmin;
    height: 80vh;
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    z-index: 110; /* Above the door frame */
    border: none; /* Remove border as the frame is now handled by door-frame */
    overflow: hidden;
    /* Background is now transparent to show the door frame behind */
    background: transparent;
    /* Ensure smooth transitions when resizing */
    transition:
      width 0.5s ease,
      height 0.5s ease;
    /* Ensure content is properly framed */
    box-sizing: border-box;
    max-width: 90vw;
    max-height: 90vh;
  }

  /* Doors */
  .elevator-doors {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    z-index: 115; /* Increased z-index to ensure visibility */
    overflow: hidden;
  }

  .door {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%; /* Increased width to ensure full coverage */
    background-color: var(--door-color);
    background-image: url("textures/elevator_texture.jpg");
    background-size: 200% 100%;
    background-repeat: no-repeat;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    will-change: transform; /* Optimize for animations */
  }

  .left-door {
    left: 0;
    transform-origin: left center;
    border-right: 2px solid rgba(76, 201, 240, 0.3);
  }

  .right-door {
    right: 0;
    transform-origin: right center;
    border-left: 2px solid rgba(76, 201, 240, 0.3);
  }

  /* Door handles */
  .left-door::before,
  .right-door::before {
    content: "";
    position: absolute;
    top: 50%;
    width: 4px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    transform: translateY(-50%);
    box-shadow: 0 0 10px rgba(99, 100, 100, 0.5);
  }

  .left-door::before {
    right: 20px;
  }

  .right-door::before {
    left: 20px;
  }

  /* Severance-style door details */
  .left-door::after,
  .right-door::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
        to bottom,
        rgba(76, 201, 240, 0.05) 0%,
        rgba(76, 201, 240, 0.02) 50%,
        rgba(76, 201, 240, 0.05) 100%
      ),
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0) 20%,
        rgba(0, 0, 0, 0) 80%,
        rgba(0, 0, 0, 0.2) 100%
      );
    pointer-events: none;
  }

  /* Door details */
  .door::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0) 80%,
      rgba(0, 0, 0, 0.2)
    );
    pointer-events: none;
  }

  .floor-content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: linear-gradient(#1c304a, #0a192f);
    color: white;
    position: relative;
    z-index: 90; /* Make sure content is visible through the doorway */
    padding: 2rem;
    overflow: hidden;
    /* Ensure content is centered in the view when zoomed in */
    width: 100%;
    box-sizing: border-box;
  }

  .floor-header {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .floor-header h1 {
    font-size: 2.2rem;
    color: var(--terminal-blue);
    margin: 0;
  }

  .floor-body {
    width: 100%;
    max-width: 800px;
    height: calc(100% - 5rem);
    overflow-y: auto;
    padding: 0 1rem;
    /* Ensure content is fully visible when zoomed in */
    display: flex;
    justify-content: center;
    box-sizing: border-box;
  }

  .floor-component {
    background-color: rgba(18, 28, 38, 0.7);
    border: 1px solid rgba(76, 201, 240, 0.3);
    border-radius: 4px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    height: 100%;
    overflow-y: auto;
    width: 100%;
    /* Ensure content is properly sized and scrollable */
    box-sizing: border-box;
    position: relative;
    z-index: 200; /* Ensure content is above the doors */
  }

  /* Severance-inspired scrollbar styling */
  .floor-body::-webkit-scrollbar,
  .floor-component::-webkit-scrollbar {
    width: 6px;
  }

  .floor-body::-webkit-scrollbar-track,
  .floor-component::-webkit-scrollbar-track {
    background: #1a1a2e;
    border-radius: 3px;
  }

  .floor-body::-webkit-scrollbar-thumb,
  .floor-component::-webkit-scrollbar-thumb {
    background: #4cc9f0;
    border-radius: 3px;
    border: 1px solid rgba(76, 201, 240, 0.3);
  }

  .floor-body::-webkit-scrollbar-thumb:hover,
  .floor-component::-webkit-scrollbar-thumb:hover {
    background: #7dd6f3;
  }

  /* Floor indicator above the door - elevator style with digital display */
  .floor-indicator-above-door {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000000; /* Black background */
    border: 2px solid #333333;
    border-radius: 3px;
    padding: 8px 12px;
    width: 70%;
    max-width: 200px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 120; /* Increased z-index to ensure visibility */
    box-shadow:
      0 0 10px rgba(0, 0, 0, 0.7),
      inset 0 0 5px rgba(255, 0, 0, 0.3);
  }

  .indicator-display {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #000000;
    padding: 4px 8px;
    border-radius: 2px;
    box-shadow: inset 0 0 8px rgba(255, 0, 0, 0.2);
  }

  .floor-name {
    font-size: 22px;
    font-weight: 700;
    color: #ff0000; /* Red color for digital display */
    font-family: "Share Tech Mon", "Digital7", "DS-Digital", "LCD", monospace; /* Digital clock fonts */
    text-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
    letter-spacing: 2px;
  }

  .direction-arrow {
    position: absolute;
    right: -20px;
    color: #ff0000; /* Red color for digital display */
    font-size: 18px; /* Increased font size for better visibility */
    text-shadow: 0 0 8px rgba(255, 0, 0, 0.9); /* Enhanced glow effect */
    z-index: 1000; /* Ensure it's always visible */
    display: block; /* Always display by default */
  }

  /* Severance style */
  .severance-style {
    font-family: "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.05em;
    color: var(--off-white);
  }

  /* Floor content container - positioned outside the elevator */
  .floor-content-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 150; /* Above the elevator doors */
    pointer-events: none; /* Allow interaction with content beneath */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .floor-content-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateZ(50px) perspective(1000px);
    transform-style: preserve-3d;
    pointer-events: auto;
    width: 80vw;
    height: 75vh;
    overflow-y: auto;
    /* Custom distinct background for the content area */
    background-color: transparent; /* Remove the previous background */
    background: linear-gradient(
      to bottom,
      rgba(10, 25, 47, 0.98) 0%,
      rgba(28, 48, 74, 0.98) 50%,
      rgba(10, 25, 47, 0.98) 100%
    );
    /* Add some texture and depth */
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.7),
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 10px rgba(76, 201, 240, 0.15);
    /* Add a subtle pattern */
    background-size: 100% 100%;
    padding: 2rem;
    color: #ecf0f1;
    border: 1px solid rgba(76, 201, 240, 0.3);
    border-radius: 5px;
    font-family: "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.05em;
    line-height: 1.6;
    /* Ensure content is scrollable */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    overscroll-behavior: contain; /* Prevent scroll chaining */
    max-width: 90vw; /* Ensure it doesn't overflow on small screens */
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .floor-content-wrapper {
      width: 85vw;
      height: 70vh;
      padding: 1.5rem;
      font-size: 0.95em;
    }
    .elevator-ceiling {
      height: 60%;
    }
    .floor-indicator-above-door {
      zoom: 0.8;
      top: 10%;
    }
  }

  @media (max-width: 480px) {
    .floor-content-wrapper {
      width: 90vw;
      height: 65vh;
      padding: 1rem;
      font-size: 0.9em;
    }

    .elevator-doorway {
      width: 90vw;
      height: 90vh !important;
    }

    .floor-indicator-above-door {
      zoom: 0.85;
      top: 10%;
    }
  }

  @media screen and (max-aspect-ratio: 1/1) and (min-width: 768px) {
    .floor-content-wrapper {
      width: 90vw;
      height: 80vh;
      padding: 1rem;
      font-size: 0.9em;
    }
    .elevator-doorway {
      width: 90vw;
      height: 90vh !important;
    }
    .elevator-ceiling {
      height: 80%;
    }
    .floor-indicator-above-door {
      top: 12%;
    }
  }

  /* Scroll indicator */
  .scroll-indicator {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(18, 28, 38, 0.7);
    border: 1px solid rgba(76, 201, 240, 0.3);
    border-radius: 4px;
    padding: 8px 15px;
    z-index: 1000;
    font-size: 12px;
    color: rgba(236, 240, 241, 0.7);
    text-align: center;
  }
</style>
