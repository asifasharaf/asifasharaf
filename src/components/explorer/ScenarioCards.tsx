import { useExplorer } from './state'
import { token } from './tokens'
import { SCENARIOS } from '../../lib/explorer/scenarios'
import { runModel } from '../../lib/explorer/model'

const TONES = ['--rgb-olive', '--rgb-cobalt', '--rgb-rose', '--rgb-accent', '--rgb-mustard']

/**
 * The named scenarios as narrative cards, each showing what would have to be
 * true and what signal would tell you it is happening. Selecting one drives the
 * explorer above.
 */
export function ScenarioCards() {
  const { state, dispatch } = useExplorer()

  return (
    <div className="grid md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden">
      {SCENARIOS.map((s, i) => {
        const active = state.scenarioId === s.id
        const outcome = runModel(state.role, s.levers)
        const tone = TONES[i % TONES.length]

        return (
          <article key={s.id} className="bg-bg p-6 sm:p-8 flex flex-col">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h3 className="font-serif text-2xl sm:text-3xl" style={{ color: token(tone) }}>
                {s.name}
              </h3>
              {active && (
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted shrink-0">
                  loaded
                </span>
              )}
            </div>

            <p className="text-fg/80 leading-relaxed mb-5">{s.premise}</p>

            <dl className="space-y-4 text-sm mb-6">
              <div>
                <dt className="text-muted text-[11px] uppercase tracking-[0.14em] mb-1">
                  What has to be true
                </dt>
                <dd className="text-fg/75 leading-relaxed">{s.requires}</dd>
              </div>
              <div>
                <dt className="text-muted text-[11px] uppercase tracking-[0.14em] mb-1">
                  What you&rsquo;d watch for
                </dt>
                <dd className="text-fg/75 leading-relaxed">{s.indicator}</dd>
              </div>
            </dl>

            <div className="mt-auto pt-5 border-t border-border">
              <dl className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                <div>
                  <dt className="text-muted text-[10px] uppercase tracking-[0.14em]">Headcount</dt>
                  <dd className="font-mono text-sm text-fg tabular-nums">
                    {Math.round(outcome.headcountIndex)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted text-[10px] uppercase tracking-[0.14em]">Entry work</dt>
                  <dd className="font-mono text-sm text-fg tabular-nums">
                    {Math.round(outcome.entryPoolIndex)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted text-[10px] uppercase tracking-[0.14em]">
                    Week absorbed
                  </dt>
                  <dd className="font-mono text-sm text-fg tabular-nums">
                    {Math.round(outcome.absorbed * 100)}%
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => dispatch({ type: 'scenario', id: s.id })}
                className="link-underline text-sm"
                style={{ color: token(tone) }}
                aria-label={`Load the ${s.name} scenario into the explorer`}
              >
                {active ? 'Loaded in the explorer' : 'Load this scenario →'}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
