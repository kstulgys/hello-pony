import React from 'react'
import { MazeProps, MazeData, DIRECTIONS, Wall } from '../types'
import { getMaze, createPonyMove, getMazeById } from '../../api/pony'

export function usePonyMove({ movePonyTo }: { movePonyTo: ({ direction }: { direction: Wall }) => Promise<void> }): void {
  React.useEffect(() => {
    const handleOnKeyDown = async (e: KeyboardEvent): Promise<void> => {
      if (e.key === 'ArrowUp') await movePonyTo({ direction: DIRECTIONS.NORTH })
      if (e.key === 'ArrowDown') await movePonyTo({ direction: DIRECTIONS.SOUTH })
      if (e.key === 'ArrowLeft') await movePonyTo({ direction: DIRECTIONS.WEST })
      if (e.key === 'ArrowRight') await movePonyTo({ direction: DIRECTIONS.EAST })
    }
    document.addEventListener('keydown', handleOnKeyDown)
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [movePonyTo])
}

export function useWindowSize(): number[] {
  const [size, setSize] = React.useState([0, 0])
  React.useLayoutEffect(() => {
    function updateSize(): void {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size as [number, number]
}

export function useOnClickOutside({ ref, handler }: { ref: React.MutableRefObject<HTMLDivElement | null>; handler: () => void }): void {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export const MAZE_INITIAL_PROPS: MazeProps = {
  'maze-width': 15,
  'maze-height': 15,
  'maze-player-name': 'Fluttershy',
  difficulty: 1,
}

export interface UseGameAPIResponse {
  mazeData: MazeData | undefined
  mazeProps: MazeProps
  setMazeProps: React.Dispatch<React.SetStateAction<MazeProps>>
  restart: () => Promise<void>
  movePonyTo: ({ direction }: { direction: Wall }) => Promise<void>
}

export function useGameAPI(): UseGameAPIResponse {
  const [mazeProps, setMazeProps] = React.useState<MazeProps>(MAZE_INITIAL_PROPS)
  const [mazeId, setMazeId] = React.useState<string>('')
  const [mazeData, setMazeData] = React.useState<MazeData | undefined>(undefined)
  const [count, setCount] = React.useState(0)

  const refetch = React.useCallback((): void => setCount((prev) => prev + 1), [])

  const movePonyTo = async ({ direction }: { direction: Wall }): Promise<void> => {
    createPonyMove({ direction, mazeId }).then(refetch)
  }

  usePonyMove({ movePonyTo })

  const restart = React.useCallback(async (): Promise<void> => {
    const { data, mazeId } = await getMaze({ mazeProps })
    setMazeData(data)
    setMazeId(mazeId)
  }, [mazeProps])

  React.useEffect(() => {
    restart()
  }, [restart])

  React.useEffect(() => {
    if (!mazeId) return
    getMazeById({ mazeId }).then(setMazeData)
  }, [mazeId, count])

  return { mazeData, mazeProps, setMazeProps, restart, movePonyTo }
}
