import { writable, derived } from 'svelte/store';

// Define the floor structure
export interface Floor {
  id: string;
  name: string;
  level: number;
  description: string;
}

// Define all available floors
export const floors: Floor[] = [
  {
    id: 'lobby',
    name: 'Lobby',
    level: 0,
    description: 'Welcome to Muhammad Daru\'s Portfolio'
  },
  {
    id: 'about',
    name: 'About',
    level: 1,
    description: 'Personal information and background'
  },
  {
    id: 'experience',
    name: 'Experience',
    level: 2,
    description: 'Work history and professional experience'
  },
  {
    id: 'skills',
    name: 'Skills',
    level: 3,
    description: 'Technical skills and competencies'
  },
  {
    id: 'education',
    name: 'Education',
    level: 4,
    description: 'Academic background and qualifications'
  },
  {
    id: 'projects',
    name: 'Projects',
    level: 5,
    description: 'Portfolio of projects and work'
  },
  {
    id: 'contact',
    name: 'Contact',
    level: 6,
    description: 'Get in touch'
  }
];

// Elevator state
export interface ElevatorState {
  currentFloor: Floor;
  targetFloor: Floor | null;
  isMoving: boolean;
  doorsOpen: boolean;
  direction: 'up' | 'down' | 'idle';
}

// Create the elevator store with initial state
const createElevatorStore = () => {
  // Set initial state to the lobby floor
  const initialState: ElevatorState = {
    currentFloor: floors[0],
    targetFloor: null,
    isMoving: false,
    doorsOpen: false,
    direction: 'idle'
  };

  const { subscribe, set, update } = writable<ElevatorState>(initialState);

  return {
    subscribe,
    
    // Request to go to a specific floor
    goToFloor: (floorId: string) => {
      update(state => {
        const targetFloor = floors.find(f => f.id === floorId);
        
        if (!targetFloor || targetFloor.id === state.currentFloor.id) {
          return state;
        }
        
        const direction = targetFloor.level > state.currentFloor.level ? 'up' : 'down';
        
        return {
          ...state,
          targetFloor,
          isMoving: true,
          doorsOpen: false,
          direction
        };
      });
    },
    
    // Called when elevator arrives at the target floor
    arriveAtFloor: () => {
      update(state => {
        if (!state.targetFloor) return state;
        
        return {
          ...state,
          currentFloor: state.targetFloor,
          targetFloor: null,
          isMoving: false,
          direction: 'idle'
        };
      });
    },
    
    // Open the elevator doors
    openDoors: () => {
      update(state => ({ ...state, doorsOpen: true }));
    },
    
    // Close the elevator doors
    closeDoors: () => {
      update(state => ({ ...state, doorsOpen: false }));
    },
    
    // Reset to initial state
    reset: () => set(initialState)
  };
};

// Create and export the elevator store
export const elevator = createElevatorStore();

// Derived store for the current floor content
export const currentFloorContent = derived(
  elevator,
  $elevator => $elevator.currentFloor.id
);
