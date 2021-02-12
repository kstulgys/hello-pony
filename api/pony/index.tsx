import axios from 'axios'
import { MazeData, MazeProps, MovePonyProps } from '../../utils/types'

export const BASE_URL = `https://ponychallenge.trustpilot.com/pony-challenge`

export async function getMazeId({ mazeProps }: { mazeProps: MazeProps }): Promise<string> {
  const {
    data: { maze_id },
  }: { data: { maze_id: string } } = await axios.post(`${BASE_URL}/maze`, { ...mazeProps })
  return maze_id
}

export async function getMazeById({ mazeId }: { mazeId: string }): Promise<MazeData> {
  const { data }: { data: MazeData } = await axios.get(`${BASE_URL}/maze/${mazeId}`)
  return data
}

export async function getMaze({ mazeProps }: { mazeProps: MazeProps }): Promise<{ data: MazeData; mazeId: string }> {
  const mazeId = await getMazeId({ mazeProps })
  const { data }: { data: MazeData } = await axios.get(`${BASE_URL}/maze/${mazeId}`)

  return { data, mazeId }
}

export async function createPonyMove({ direction, mazeId }: MovePonyProps): Promise<unknown> {
  return axios.post(`${BASE_URL}/maze/${mazeId}`, { direction })
}
