import { act } from '@testing-library/react-native'
import type * as ZustandExports from 'zustand'

// Grab the real create & createStore
const {
  create: actualCreate,
  createStore: actualCreateStore,
  ...rest
} = jest.requireActual<typeof ZustandExports>('zustand')

// A set to hold all reset functions
export const storeResetFns = new Set<() => void>()

// Helper for the un-curried API
function createUncurried<T>(
  stateCreator: ZustandExports.StateCreator<T>,
) {
  const store = actualCreate(stateCreator)
  const initialState = store.getState()
  // register a reset that will restore the initial snapshot
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

export const createMock = (<T>(
  stateCreator?: ZustandExports.StateCreator<T>,
) => {
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof actualCreate


function createStoreUncurried<T>(
  stateCreator: ZustandExports.StateCreator<T>,
) {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

export const createStoreMock = (<T>(
  stateCreator?: ZustandExports.StateCreator<T>,
) => {
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof actualCreateStore

// After each test, run all reset fns inside React Testing Library's act()
afterEach(() => {
  act(() => {
    storeResetFns.forEach((reset) => reset())
  })
})

module.exports = {
  ...rest,                 
  create: createMock,
  createStore: createStoreMock,
  storeResetFns,
}