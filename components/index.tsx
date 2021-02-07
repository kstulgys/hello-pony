import React from 'react'
import { MazeProps, DIRECTIONS, MazeData, Walls, GameEntities } from '../utils/types'
import { useWindowSize, useOnClickOutside } from '../utils/hooks'
import { FiSettings } from 'react-icons/fi'
import { movePony } from '../api/pony'
import Head from 'next/head'

interface MazeDataGridProps {
  mazeData: MazeData
  zoom: number
}

export function MazeGrid({ mazeData, zoom }: MazeDataGridProps): JSX.Element {
  const [windowWidth] = useWindowSize()
  const [tileSize, setTileSize] = React.useState('32px')

  const {
    size: [mazeWidth],
    domokun: [demokunIndex],
    pony: [ponyIndex],
    'end-point': [exitIndex],
    data,
  } = mazeData

  React.useEffect(() => {
    setTileSize(((windowWidth - 32) / mazeWidth) * zoom + 'px')
  }, [windowWidth, mazeWidth, zoom])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: `calc(${tileSize} * ${mazeWidth})` }}>
      {data.map((walls, cellIndex) => {
        const isDemokun = demokunIndex === cellIndex
        const isPony = ponyIndex === cellIndex
        const isExit = exitIndex === cellIndex
        const emoji: GameEntities = isDemokun ? '😈' : isPony ? '🦄' : isExit ? '🚪' : ''
        const tileProps = { cellIndex, walls, mazeWidth, tileSize, mazeLength: data.length, emoji }
        return <MazeTile key={cellIndex} {...tileProps} />
      })}
    </div>
  )
}

interface MazeTileProps {
  mazeWidth: number
  mazeLength: number
  cellIndex: number
  walls: Walls[]
  tileSize: string
  emoji: GameEntities
}

export const MazeTile = React.memo((props: MazeTileProps) => {
  const { mazeWidth, mazeLength, cellIndex, walls, tileSize, emoji } = props

  const isMazeRightTile = React.useMemo(() => (cellIndex + 1) % mazeWidth === 0, [cellIndex, mazeWidth])

  const isMazeBottomTile = React.useMemo(() => {
    return [...Array(mazeWidth).keys()]
      .map((i) => {
        return i + Math.round(mazeLength - mazeWidth)
      })
      .includes(cellIndex)
  }, [cellIndex, mazeWidth, mazeLength])

  const cellWallsStyle = {
    borderTop: walls.includes(DIRECTIONS.NORTH) ? '2px solid' : '',
    borderLeft: walls.includes(DIRECTIONS.WEST) ? '2px solid' : '',
    borderRight: walls.includes(DIRECTIONS.EAST) || isMazeRightTile ? '2px solid' : '',
    borderBottom: walls.includes(DIRECTIONS.SOUTH) || isMazeBottomTile ? '2px solid' : '',
  }

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        fontSize: `calc(${tileSize} * 0.7)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...cellWallsStyle,
      }}
    >
      <div>
        <span>{emoji}</span>
      </div>
    </div>
  )
})

MazeTile.displayName = 'MazeTile'

const initialOpacity = {
  north: 0.4,
  west: 0.4,
  east: 0.4,
  south: 0.4,
}

export interface MoveControlsProps {
  mazeId: string
  refetch: () => void
}

export function MoveControls({ mazeId, refetch }: MoveControlsProps): JSX.Element {
  const [{ north, west, east, south }, setArrowsOpacity] = React.useState(initialOpacity)

  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp') setArrowsOpacity((prev) => ({ ...prev, north: 0.8 }))
      if (e.key === 'ArrowDown') setArrowsOpacity((prev) => ({ ...prev, south: 0.8 }))
      if (e.key === 'ArrowLeft') setArrowsOpacity((prev) => ({ ...prev, west: 0.8 }))
      if (e.key === 'ArrowRight') setArrowsOpacity((prev) => ({ ...prev, east: 0.8 }))
      setTimeout(() => setArrowsOpacity(initialOpacity), 200)
    }
    document.addEventListener('keydown', handleOnKeyDown)
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [])

  const handleOnArrowClick = async (name: string): Promise<void> => {
    console.log({ name })
    if (name === DIRECTIONS.NORTH) await movePony({ direction: DIRECTIONS.NORTH, mazeId })
    if (name === DIRECTIONS.SOUTH) await movePony({ direction: DIRECTIONS.SOUTH, mazeId })
    if (name === DIRECTIONS.WEST) await movePony({ direction: DIRECTIONS.WEST, mazeId })
    if (name === DIRECTIONS.EAST) await movePony({ direction: DIRECTIONS.EAST, mazeId })
    refetch()
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '4rem', width: '13rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Arrow name={DIRECTIONS.NORTH} opacity={north} emoji="⬆️" handleOnArrowClick={handleOnArrowClick} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-0.8rem' }}>
          <Arrow name={DIRECTIONS.WEST} opacity={west} emoji="⬅️" handleOnArrowClick={handleOnArrowClick} />
          <Arrow name={DIRECTIONS.SOUTH} opacity={south} emoji="⬇️" handleOnArrowClick={handleOnArrowClick} />
          <Arrow name={DIRECTIONS.EAST} opacity={east} emoji="➡️" handleOnArrowClick={handleOnArrowClick} />
        </div>
      </div>
    </div>
  )
}

export function Arrow({
  name,
  opacity,
  emoji,
  handleOnArrowClick,
}: {
  name: string
  opacity: number
  emoji: string
  handleOnArrowClick: (name: string) => void
}): JSX.Element {
  console.log({ name })
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div onClick={() => handleOnArrowClick(name)} tabIndex={0} role="button" style={{ opacity }}>
      <span role="img" aria-label="arrow right">
        {emoji}
      </span>
    </div>
  )
}

interface GameSettingsProps {
  handleMazePropsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleZoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  mazeProps: MazeProps
  zoom: number
}

export function GameSettings({ handleMazePropsChange, handleZoomChange, mazeProps, zoom }: GameSettingsProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const onToggle = (): void => setIsOpen((prev) => !prev)
  const dropdownRef = React.useRef<HTMLDivElement | null>(null)
  useOnClickOutside({ ref: dropdownRef, handler: () => setIsOpen(false) })

  return (
    <div style={{ position: 'relative' }}>
      <div tabIndex={0} role="button" onKeyPress={onToggle} onClick={onToggle}>
        <FiSettings style={{ fontSize: '2rem' }} />
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            marginTop: '3rem',
            background: 'white',
            border: '1px solid',
            borderRadius: '0.5rem',
          }}
        >
          <Slider handleMazePropsChange={handleMazePropsChange} name="maze-width" value={mazeProps['maze-width']} min={15} max={25} />

          <Slider handleMazePropsChange={handleMazePropsChange} name="maze-height" value={mazeProps['maze-height']} min={15} max={25} />

          <Slider handleMazePropsChange={handleMazePropsChange} name="difficulty" value={mazeProps.difficulty} min={1} max={10} />

          <Slider handleMazePropsChange={handleZoomChange} name="zoom" value={zoom} min={0.1} max={1} step={0.1} />
        </div>
      )}
    </div>
  )
}

export function Slider({
  handleMazePropsChange,
  value,
  name,
  min,
  max,
  step = 1,
}: {
  handleMazePropsChange: (e: any) => void
  value: number
  name: string
  min: number
  max: number
  step?: number
}): JSX.Element {
  return (
    <div style={{ padding: '1rem', width: '12rem' }}>
      <div>
        <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{name}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input onChange={handleMazePropsChange} type="range" id={name} name={name} min={min} max={max} value={value} step={step} />
        <label style={{ marginLeft: 'auto' }} htmlFor="difficulty">
          {value}
        </label>
      </div>
    </div>
  )
}

export function GameOver({ mazeData, restart }: { mazeData: MazeData; restart: () => void }): JSX.Element {
  const gameOverUrl = `https://ponychallenge.trustpilot.com${mazeData?.['game-state']['hidden-url']}`
  const gameOverMessage = mazeData?.['game-state']?.['state-result']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '2rem 0 0 0' }}>
        <button onClick={restart} style={{ fontSize: '1.5rem' }}>
          Restart The Game
        </button>
      </div>
      <p style={{ fontSize: '1.5rem' }}>{gameOverMessage}</p>
      <img style={{ height: '50vh', objectFit: 'contain', width: '100%' }} src={gameOverUrl} alt="game state url" />
    </div>
  )
}

export function GameLoader(): JSX.Element {
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ margin: 'auto auto' }}>
        <p style={{ fontSize: '2rem' }}>Loading...</p>
      </div>
    </div>
  )
}

export function Layout({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem 0 2rem 0',
      }}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  )
}

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>
    }

    return this.props.children
  }
}
