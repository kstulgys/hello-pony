import React from 'react'
import { useWindowSize, useGameAPI, usePonyMove } from '../utils/hooks'
import { GameSettings, MazeGrid, MoveControls, GameOver, GameLoader, Layout, ErrorBoundary } from '../components'

export type UseGameApiResponse = Pick<
  ReturnType<typeof useGameAPI>,
  'mazeData' | 'mazeProps' | 'setMazeProps' | 'refetch' | 'mazeId' | 'restart'
>

interface HomeProps {
  useGameApiHook?: () => UseGameApiResponse
}

export default function Home({ useGameApiHook = useGameAPI }: HomeProps): JSX.Element {
  const { mazeData, mazeProps, setMazeProps, refetch, mazeId, restart } = useGameApiHook()
  usePonyMove({ refetch, mazeId })

  const [zoom, setZoom] = React.useState(0.4)
  const [windowWidth] = useWindowSize()

  React.useLayoutEffect(() => {
    if (!!windowWidth && windowWidth < 600) setZoom(1)
  }, [windowWidth])

  const handleMazePropsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setMazeProps((prev) => ({ ...prev, [e.target.name]: e.target.valueAsNumber }))
    },
    [setMazeProps]
  )

  const handleZoomChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setZoom(e.target.valueAsNumber)
  }, [])

  const isGameOver = React.useMemo(() => mazeData?.['game-state']?.state === 'won' || mazeData?.['game-state']?.state === 'over', [
    mazeData,
  ])

  if (!mazeData) return <GameLoader />

  return (
    <Layout title="Save The Pony">
      <ErrorBoundary>
        <header>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <h1 style={{ textAlign: 'center' }}>Save The Pony</h1>
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <GameSettings
                handleMazePropsChange={handleMazePropsChange}
                handleZoomChange={handleZoomChange}
                mazeProps={mazeProps}
                zoom={zoom}
              />
            </div>
          </div>
        </header>
        <main>{isGameOver ? <GameOver mazeData={mazeData} restart={restart} /> : <MazeGrid mazeData={mazeData} zoom={zoom} />}</main>
        <MoveControls mazeId={mazeId} refetch={refetch} />
      </ErrorBoundary>
    </Layout>
  )
}
