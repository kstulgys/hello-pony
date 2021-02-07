type PonyNames = 'Spike' | 'Applejack' | 'Rainbow Dash' | 'Pinkie Pie' | 'Rarity' | 'Fluttershy'
export type Walls = 'south' | 'west' | 'east' | 'north'
export type GameEntities = '😈' | '🦄' | '🚪' | ''

export interface MovePonyProps {
  direction: Walls
  mazeId: string
}

export interface MazeProps {
  'maze-width': number
  'maze-height': number
  'maze-player-name': PonyNames
  difficulty: number
}

export interface MazeData {
  data: Walls[][]
  size: [number, number]
  domokun: [number]
  pony: [number]
  'end-point': [number]
  'game-state': {
    state: 'over' | 'won' | 'Active' | 'active'
    'state-result': string
    'hidden-url': string
  }
}

export enum DIRECTIONS {
  'SOUTH' = 'south',
  'WEST' = 'west',
  'EAST' = 'east',
  'NORTH' = 'north',
}
