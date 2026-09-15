import { useEffect, useMemo, useReducer, useRef } from 'react'
import { ExplorerContext, DEFAULT_STATE, reducer } from './state'
import { LeverSliders, RoleSelector, ScenarioTabs } from './Controls'
import { Interpretation, KpiReadout, ShareLink } from './Readout'
import QuadrantMatrix from './charts/QuadrantMatrix'
import WeekStack from './charts/WeekStack'
import LadderChart from './charts/LadderChart'
import { ScenarioCards } from './ScenarioCards'
import { TaskStrip } from './TaskStrip'
import { runModel } from '../../lib/explorer/model'
import { decodeState, encodeState } from '../../lib/explorer/hash'

/**
 * The one interactive island on the page.
 *
 * Everything that must share state lives inside this single React root:
 * Astro gives each `client:*` directive its own root, so sibling islands could
 * not see each other's state without an external store. One island plus context
 * keeps it to a single hydration boundary and a single bundle.
 *
 * Data is imported here rather than passed as props — Astro serialises island
 * props into the HTML, so passing the task atlas in would ship it twice.
 */
export default function ScenarioExplorer() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const lastHash = useRef<string | null>(null)

  const result = useMemo(() => runModel(state.role, state.levers), [state.role, state.levers])

  // Read the fragment only after mount. Doing it during render would make the
  // client's first pass disagree with the prerendered HTML, and React 19 throws
  // away the whole root on a hydration mismatch.
  useEffect(() => {
    if (!window.location.hash) return
    const decoded = decodeState(window.location.hash)
    lastHash.current = encodeState(decoded)
    dispatch({ type: 'hydrate', state: decoded })
  }, [])

  // Mirror state into the fragment. replaceState, never `location.hash =`,
  // which would push a history entry on every tick of a slider drag and trigger
  // a smooth-scroll jump via the global `scroll-behavior: smooth`.
  useEffect(() => {
    const encoded = encodeState(state)
    if (encoded === lastHash.current) return
    const id = window.requestAnimationFrame(() => {
      lastHash.current = encoded
      window.history.replaceState(null, '', `#${encoded}`)
    })
    return () => window.cancelAnimationFrame(id)
  }, [state])

  // Back/forward and pasted links, ignoring the echo of our own writes.
  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash
      if (!raw) return
      const decoded = decodeState(raw)
      const encoded = encodeState(decoded)
      if (encoded === lastHash.current) return
      lastHash.current = encoded
      dispatch({ type: 'hydrate', state: decoded })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const value = useMemo(() => ({ state, result, dispatch }), [state, result])

  return (
    <ExplorerContext.Provider value={value}>
      {/* ── The atlas ──────────────────────────────────────────────── */}
      <div className="border-t border-border pt-12 sm:pt-16">
        <div className="flex items-baseline gap-4 sm:gap-6 mb-8">
          <span className="section-num section-num--03">03</span>
          <h2 className="text-fg text-xs sm:text-sm uppercase tracking-[0.22em]">
            The task atlas
          </h2>
        </div>

        <div className="max-w-2xl mb-10">
          <p className="text-fg/80 leading-relaxed mb-4">
            Twenty-nine tasks that make up product design work, each scored on how
            automatable it is and how expensive it is for a human to check the
            result. Verification is the brake: a task can be trivial for a machine
            and still stay human if nobody can cheaply tell whether the output is
            right.
          </p>
          <p className="text-muted leading-relaxed">
            Switch seniority to resize the bubbles. The scores do not change — only
            which tasks fill the week.
          </p>
        </div>

        <div className="mb-8">
          <RoleSelector />
        </div>

        {/* Scatter on wider screens; a ranked strip on phones, where a
            squashed scatter would be unreadable. */}
        <div className="hidden sm:block">
          <QuadrantMatrix />
        </div>
        <div className="sm:hidden">
          <TaskStrip />
        </div>
      </div>

      {/* ── The explorer ───────────────────────────────────────────── */}
      <div
        id="explorer"
        className="border-t border-border mt-16 sm:mt-24 pt-12 sm:pt-16 scroll-mt-8"
      >
        <div className="flex items-baseline gap-4 sm:gap-6 mb-8">
          <span className="section-num section-num--04">04</span>
          <h2 className="text-fg text-xs sm:text-sm uppercase tracking-[0.22em]">
            The explorer
          </h2>
        </div>

        <div className="max-w-2xl mb-10">
          <p className="text-fg/80 leading-relaxed">
            Five levers decide how much of that atlas moves. Start from a named
            scenario or set them yourself; the outputs update as you go. None of
            this is a forecast — it is a way of checking whether a belief about
            design work is internally consistent.
          </p>
        </div>

        <div className="mb-10">
          <ScenarioTabs />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <LeverSliders />
          </div>

          <div className="space-y-12 min-w-0">
            <KpiReadout />

            <div className="max-w-2xl">
              <Interpretation />
              <div className="mt-4">
                <ShareLink />
              </div>
            </div>

            <section>
              <h3 className="font-serif text-2xl sm:text-3xl text-fg mb-2">
                The week, redistributed
              </h3>
              <p className="text-muted text-sm mb-6 max-w-xl">
                Both bars use the same scale. The dashed remainder is freed capacity
                — what happens to it is what the demand lever decides.
              </p>
              <WeekStack />
            </section>

            <section>
              <h3 className="font-serif text-2xl sm:text-3xl text-fg mb-2">
                Why seniority is the whole story
              </h3>
              <p className="text-muted text-sm mb-6 max-w-xl">
                Identical levers across all four bands. The gradient comes entirely
                from task mix — juniors hold the work that automates first.
              </p>
              <LadderChart />
            </section>
          </div>
        </div>
      </div>

      {/* ── Four futures ───────────────────────────────────────────── */}
      <div className="border-t border-border mt-16 sm:mt-24 pt-12 sm:pt-16">
        <div className="flex items-baseline gap-4 sm:gap-6 mb-8">
          <span className="section-num section-num--05">05</span>
          <h2 className="text-fg text-xs sm:text-sm uppercase tracking-[0.22em]">
            Four futures
          </h2>
        </div>
        <div className="max-w-2xl mb-10">
          <p className="text-fg/80 leading-relaxed">
            Each of these is a coherent set of lever positions rather than a
            prediction. What separates them is not arithmetic but belief — about
            whether design was rationed by cost, and about how much unchecked output
            a team will tolerate. Load one into the explorer above to see it run.
          </p>
        </div>
        <ScenarioCards />
      </div>
    </ExplorerContext.Provider>
  )
}
