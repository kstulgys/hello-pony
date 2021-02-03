import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import React from 'react'

const DIRECTIONS = {
  SOUTH: 'south',
  WEST: 'west',
  EAST: 'east',
  NORTH: 'north'
}

const mazeInitialProps = {
  "maze-width": 15,
  "maze-height": 20,
  "maze-player-name": "Fluttershy",
  "difficulty": 1
}

const BASE_URL = `https://ponychallenge.trustpilot.com/pony-challenge`

async function getMazeId({ mazeProps }) {
  const { data: { maze_id } } = await axios.post(`${BASE_URL}/maze`, {
    ...mazeProps
  })
  return maze_id
}

async function getMazeData({ mazeId }) {
  const { data } = await axios.get(`${BASE_URL}/maze/${mazeId}`)
  return data
}

async function moveTo({ direction, mazeId }) {
  return axios.post(`${BASE_URL}/maze/${mazeId}`, {
    direction
  })
}


const initialState = {
  isLoading: true,
  // endPoint: [],
  // gameState: {},
  // mazeId: "",
  // data: [],
  // demokun: [],
  // pony: [],
  size: [15, 20],
  playerName: 'Fluttershy',
  difficulty: 1,
  isFastNetwork: true
};

// const ACTIONS = {
//   SET_MAZE_ID: 'SET_MAZE_ID',
//   SET_MAZE_DATA: 'SET_MAZE_DATA',
//   SET_LOADING: 'SET_LOADING'
// }

// function reducer(state, [type, { }]) {
//   switch (type) {
//     case ACTIONS.SET_LOADING:
//       return { ...state, loading: payload };
//     case ACTIONS.SET_MAZE_ID:
//       return { ...state, mazeId: payload };
//     case ACTIONS.SET_MAZE_DATA:
//       return { ...state, mazeData: payload };
//     default:
//       throw new Error();
//   }
// }


export default function Index() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setLoading] = React.useState(true)
  const [mazeData, setMazeData] = React.useState({})
  const [mazeId, setMazeId] = React.useState("")
  const [count, setCount] = React.useState(0)
  const [mazeProps, setMazeProps] = React.useState({ ...mazeInitialProps })

  const rerender = () => setCount(prev => prev + 1)

  React.useEffect(() => {
    const handleOnKeyDown = async (e) => {
      if (e.key === 'ArrowUp') moveTo({ direction: DIRECTIONS.NORTH, mazeId }).then(rerender)
      if (e.key === 'ArrowDown') moveTo({ direction: DIRECTIONS.SOUTH, mazeId }).then(rerender)
      if (e.key === 'ArrowLeft') moveTo({ direction: DIRECTIONS.WEST, mazeId }).then(rerender)
      if (e.key === 'ArrowRight') moveTo({ direction: DIRECTIONS.EAST, mazeId }).then(rerender)
    }
    document.addEventListener('keydown', handleOnKeyDown)
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown);
    };
  }, [mazeId, setMazeData])

  // Get mazeId
  React.useEffect(() => {
    const effectiveType = navigator.connection.effectiveType
    console.log({ effectiveType })
    setLoading(true)
    getMazeId({ mazeProps }).then(setMazeId)
  }, [mazeProps])

  // Get mazeData
  React.useEffect(() => {
    if (!mazeId) return
    getMazeData({ mazeId }).then(setMazeData).then(() => setLoading(false))
  }, [mazeId, count])

  return (
    <div className={styles.container} >
      <Head>
        <title>Pony Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>{mazeId}</h1>
        {isLoading ? <h1>Loading...</h1> : <Maze mazeData={mazeData} />}
      </main>
      {/* <footer className={styles.footer}>
      </footer> */}
    </div>
  )
}

const CELL_SIZE = "2rem";

const WALLS = {
  SOUTH: 'south',
  WEST: 'west',
  EAST: 'east',
  NORTH: 'north'
}

const BG_COLOR = {
  PONY: 'purple',
  DEMOKUN: 'red',
  EMPTY: 'white',
  EXIT: 'brown',
}

function getBgColor({ isDemokun, isPony, isExit, isEmpty }) {
  if (isEmpty) return BG_COLOR.EMPTY
  if (isDemokun) return BG_COLOR.DEMOKUN
  if (isPony) return BG_COLOR.PONY
  if (isExit) return BG_COLOR.EXIT
  throw new Error('The tile is not a thing')
}

const MazeTile = React.memo(({ mazeWidth, cellIndex, walls, demokunIndex, ponyIndex, exitIndex, tileSize }) => {
  const isDemokun = demokunIndex === cellIndex;
  const isPony = ponyIndex === cellIndex;
  const isExit = exitIndex === cellIndex;
  const isEmpty = !isDemokun && !isPony && !isExit

  const isMazeRightTile = React.useMemo(() => (cellIndex + 1) % mazeWidth === 0, [cellIndex, mazeWidth])
  const isMazeBottomTile = React.useMemo(() => [...Array(mazeWidth).keys()].map(i => i + 285).includes(cellIndex), [cellIndex, mazeWidth])

  const cellStyle = {
    background: getBgColor({ isDemokun, isPony, isExit, isEmpty }),
    borderTop: walls.includes(WALLS.NORTH) ? '2px solid' : '',
    borderLeft: walls.includes(WALLS.WEST) ? '2px solid' : '',
    borderRight: walls.includes(WALLS.EAST) || isMazeRightTile ? '2px solid' : '',
    borderBottom: walls.includes(WALLS.SOUTH) || isMazeBottomTile ? '2px solid' : '',
  }

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        background: "purple",
        ...cellStyle
      }}
    />
  );
})


function Maze({ mazeData }) {
  const [tileSize, setTileSize] = React.useState('2rem')
  const {
    data,
    size: [mazeWidth, mazeHeight],
    domokun: [demokunIndex],
    pony: [ponyIndex],
    'end-point': [exitIndex],
  } = mazeData;

  const maxWidth = `calc(${CELL_SIZE} * ${mazeWidth})`;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", maxWidth }}>
      {data.map((walls, cellIndex) => {
        const cellProps = { cellIndex, walls, demokunIndex, ponyIndex, exitIndex, mazeWidth, tileSize };
        return <MazeTile key={cellIndex} {...cellProps} />;
      })}
    </div>
  );
}