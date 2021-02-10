type PonyNames = 'Spike' | 'Applejack' | 'Rainbow Dash' | 'Pinkie Pie' | 'Rarity' | 'Fluttershy'
export type Wall = DIRECTIONS.SOUTH | DIRECTIONS.WEST | DIRECTIONS.EAST | DIRECTIONS.NORTH
export type GameEntities = '😈' | '🦄' | '🚪' | ''
export enum DIRECTIONS {
  'SOUTH' = 'south',
  'WEST' = 'west',
  'EAST' = 'east',
  'NORTH' = 'north',
}
export interface MovePonyProps {
  direction: Wall
  mazeId: string
}

export interface MazeProps {
  'maze-width': number
  'maze-height': number
  'maze-player-name': PonyNames
  difficulty: number
}

export interface MazeData {
  data: Wall[][]
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
