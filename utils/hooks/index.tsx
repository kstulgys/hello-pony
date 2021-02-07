import React from 'react'
import { MazeProps, MazeData, DIRECTIONS } from '../types'
import { getMazeId, getMaze, movePony } from '../../api/pony'

export function usePonyMove({ refetch, mazeId }: { refetch: () => void; mazeId: string }): void {
  React.useEffect(() => {
    const handleOnKeyDown = async (e: KeyboardEvent): Promise<void> => {
      if (e.key === 'ArrowUp') await movePony({ direction: DIRECTIONS.NORTH, mazeId })
      if (e.key === 'ArrowDown') await movePony({ direction: DIRECTIONS.SOUTH, mazeId })
      if (e.key === 'ArrowLeft') await movePony({ direction: DIRECTIONS.WEST, mazeId })
      if (e.key === 'ArrowRight') await movePony({ direction: DIRECTIONS.EAST, mazeId })
      refetch()
    }
    document.addEventListener('keydown', handleOnKeyDown)
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [mazeId, refetch])
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
  refetch: () => void
  mazeId: string
  restart: () => void
}

export function useGameAPI(): UseGameAPIResponse {
  const [mazeProps, setMazeProps] = React.useState<MazeProps>(MAZE_INITIAL_PROPS)
  const [mazeId, setMazeId] = React.useState<string>('')
  const [mazeData, setMazeData] = React.useState<MazeData | undefined>(undefined)
  const [count, setCount] = React.useState(0)

  const refetch = React.useCallback((): void => setCount((prev) => prev + 1), [])
  const restart = React.useCallback((): void => setMazeId(''), [])

  usePonyMove({ refetch, mazeId })

  React.useEffect(() => {
    if (mazeId) return
    getMazeId({ mazeProps }).then(setMazeId)
  }, [mazeProps, mazeId])

  React.useEffect(() => {
    if (!mazeId) return
    getMaze({ mazeId }).then(setMazeData)
  }, [mazeId, count])

  return { mazeData, mazeProps, setMazeProps, refetch, mazeId, restart }
}
