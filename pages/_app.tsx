import { AppProps } from 'next/app'
import '../styles/globals.css'

export default function AppRoot({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />
}
