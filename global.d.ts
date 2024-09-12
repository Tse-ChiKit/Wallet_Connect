import { W3mAccountButton } from '@web3modal/scaffold-ui'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-account-button': Partial<W3mAccountButton>
    }
  }
}
