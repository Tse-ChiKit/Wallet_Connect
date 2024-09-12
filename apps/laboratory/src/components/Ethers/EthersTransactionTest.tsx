import { Button, Stack, Link, Text, Spacer } from '@chakra-ui/react'
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers'
import { useState } from 'react'
import { mainnet } from '../../utils/ChainsUtil'
import { vitalikEthAddress } from '../../utils/DataUtil'
import { useChakraToast } from '../Toast'

export function EthersTransactionTest() {
  const toast = useChakraToast()
  const { address, chainId } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const [loading, setLoading] = useState(false)

  async function onSendTransaction() {
    try {
      setLoading(true)
      console.log('on send tx ')

      if (!walletProvider || !address) {
        throw Error('user is disconnected')
      }
      const provider = new BrowserProvider(walletProvider, chainId)
      const signer = new JsonRpcSigner(provider, address)
      const tx = await signer.sendTransaction({
        to: vitalikEthAddress,
        gasLimit: 210000,
        gasPrice: ethers.parseUnits('29.1', 'gwei'),
        value: ethers.parseUnits('500000', 'gwei')
      })

      console.log('Starting sendUncheckedTransaction with tx:', tx)

      toast({
        title: 'Success',
        description: tx.hash,
        type: 'success'
      })
    } catch (e) {
      console.log('send tx error:', e)

      toast({
        title: 'Error',
        description: 'Failed to sign transaction',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return Number(chainId) !== mainnet.chainId && address ? (
    <Stack direction={['column', 'column', 'row']}>
      <Button
        data-testid="sign-transaction-button"
        onClick={onSendTransaction}
        isDisabled={loading}
      >
        Send Transaction to Vitalik
      </Button>

      <Spacer />

      <Link isExternal href="https://sepoliafaucet.com">
        <Button variant="outline" colorScheme="blue" isDisabled={loading}>
          Sepolia Faucet 1
        </Button>
      </Link>

      <Link isExternal href="https://www.infura.io/faucet/sepolia">
        <Button variant="outline" colorScheme="orange" isDisabled={loading}>
          Sepolia Faucet 2
        </Button>
      </Link>
    </Stack>
  ) : (
    <Text fontSize="md" color="yellow">
      Feature not enabled on Ethereum Mainnet
    </Text>
  )
}
