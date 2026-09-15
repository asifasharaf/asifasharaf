import { createContext, useContext } from 'react'
import type { LeverId, ModelResult, Role } from '../../lib/explorer/types'
import type { ExplorerState } from '../../lib/explorer/hash'
import { DEFAULT_STATE } from '../../lib/explorer/hash'
import { findScenario } from '../../lib/explorer/scenarios'

export type Action =
  | { type: 'scenario'; id: string }
  | { type: 'role'; role: Role }
  | { type: 'lever'; id: LeverId; value: number }
  | { type: 'hydrate'; state: ExplorerState }

export function reducer(state: ExplorerState, action: Action): ExplorerState {
  switch (action.type) {
    case 'scenario': {
      const scenario = findScenario(action.id)
      if (!scenario) return state
      return { ...state, scenarioId: scenario.id, levers: { ...scenario.levers } }
    }
    case 'role':
      return { ...state, role: action.role }
    case 'lever':
      // Moving a lever by hand detaches from the named scenario — the tabs
      // then show "custom" rather than claiming the reader is still in a preset.
      return {
        ...state,
        scenarioId: 'custom',
        levers: { ...state.levers, [action.id]: action.value },
      }
    case 'hydrate':
      return action.state
    default:
      return state
  }
}

interface ExplorerContextValue {
  state: ExplorerState
  result: ModelResult
  dispatch: (action: Action) => void
}

export const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error('useExplorer must be used inside ScenarioExplorer')
  return ctx
}

export { DEFAULT_STATE }
