import '../styles/globals.css'
import MetaMaskAccountProvider from '../components/metamask-account-provider'
import { Toaster } from "react-hot-toast"

function MyApp({ Component, pageProps }) {
  return (
    <MetaMaskAccountProvider>
      <Toaster />
      <Component {...pageProps} />
    </MetaMaskAccountProvider>
  )
}

export default MyApp
