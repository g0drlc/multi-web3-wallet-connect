import { getHashedName, getNameAccountKey, NameRegistryState } from '@solana/spl-name-service'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

const SOL_TLD_AUTHORITY = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')
const solanaNetwork = clusterApiUrl('mainnet-beta')
const connection = new Connection(solanaNetwork)

const getInputKey = async (input: string) => {
  const hashedInputName = await getHashedName(input)
  const inputDomainKey = await getNameAccountKey(hashedInputName, undefined, SOL_TLD_AUTHORITY)
  return { inputDomainKey, hashedInputName }
}

export const checkEnsValid = async (input: string) => {
  let addressTemp = input
  if (input.slice(-4) === '.sol') {
    addressTemp = input.slice(0, -4)
  }
  const { inputDomainKey } = await getInputKey(addressTemp)
  const registry = await NameRegistryState.retrieve(connection, inputDomainKey)

  return registry
}

export const parseAddressFromEns = async (input: string) => {
  let addressTemp = input
  if (input.slice(-4) === '.sol') {
    addressTemp = input.slice(0, -4)
  }
  const { inputDomainKey } = await getInputKey(addressTemp)
  const registry = await NameRegistryState.retrieve(connection, inputDomainKey)

  return registry.owner.toBase58()
}
