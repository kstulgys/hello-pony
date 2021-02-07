/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { render } from '@testing-library/react'
import Home, { UseGameApiResponse } from '../pages'
import { MazeData } from '../utils/types'
import { MAZE_INITIAL_PROPS } from '../utils/hooks'
import { ErrorBoundary } from '../components'

const sampleMazeData: MazeData = {
  data: [['south'], [], []],
  size: [15, 15],
  domokun: [0],
  pony: [1],
  'end-point': [2],
  'game-state': {
    state: 'active',
    'state-result': '',
    'hidden-url': '',
  },
}

describe('Home', () => {
  describe('while loading', () => {
    it('renders loader', () => {
      const useMockGameApiHook = (): Partial<UseGameApiResponse> => mockUseGameApiResponse()
      //    @ts-ignore
      const { container } = render(<Home useGameApiHook={useMockGameApiHook} />)
      expect(container.innerHTML).toMatch(/Loading.../i)
    })
  })

  describe('with data', () => {
    it('renders Maze with 🦄, 😈, 🚪', () => {
      const useMockGameApiHook = (): Partial<UseGameApiResponse> => mockUseGameApiResponse({ mazeData: sampleMazeData })
      //    @ts-ignore
      const { container } = render(<Home useGameApiHook={useMockGameApiHook} />)
      expect(container.innerHTML).toMatch('🦄')
      expect(container.innerHTML).toMatch('😈')
      expect(container.innerHTML).toMatch('🚪')
    })
  })

  describe('with error', () => {
    function ProblemChild(): JSX.Element {
      throw new Error('Error thrown from problem child')
      return <></>
    }

    it('renders error message', () => {
      const { container } = render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      )
      expect(container.innerHTML).toMatch(/Sorry.. there was an error/i)
    })
  })
})

function mockUseGameApiResponse(props: Partial<UseGameApiResponse> = {}): Partial<UseGameApiResponse> {
  return {
    mazeData: undefined,
    mazeProps: MAZE_INITIAL_PROPS,
    // mazeId: '',
    // setMazeProps: () => {},
    // refetch: () => {},
    // restart: () => {},
    ...props,
  }
}
