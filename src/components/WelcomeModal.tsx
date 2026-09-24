import { useState } from 'react'
import type { Difficulty } from '@/game/types'
import { DIFFICULTY_LABEL, markOnboarded, setPlayerId } from '@/lib/leaderboard'

interface WelcomeModalProps {
  onStart: (playerId: string, difficulty: Difficulty) => void
}

export function WelcomeModal({ onStart }: WelcomeModalProps) {
  const [playerId, setId] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('hard')
  const [error, setError] = useState('')

  const submit = (): void => {
    const cleaned = playerId.trim().slice(0, 16)
    if (!cleaned) {
      setError('请输入一个昵称 / ID')
      return
    }
    setPlayerId(cleaned)
    markOnboarded()
    onStart(cleaned, difficulty)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-felt-dark border border-gold/40 shadow-felt px-5 py-6 text-cream">
        <h2 id="welcome-title" className="font-display text-3xl text-gold-bright text-center">
          猪猪纸牌
        </h2>
        <p className="mt-1 text-center text-sm text-cream/75">猪猪纸牌 · 蜘蛛接龙</p>
        <p className="mt-4 text-sm text-cream/85 leading-relaxed text-center">
          点明牌会自动落到合适的列；动不了会晃一下。空列时不能发牌。本地单机，轻松畅玩。
        </p>

        <label className="mt-5 block text-xs text-cream/70">
          你的 ID
          <input
            value={playerId}
            maxLength={16}
            placeholder="例如：小猪玩家"
            autoFocus
            onChange={(e) => {
              setId(e.target.value.slice(0, 16))
              setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submit()
              }
            }}
            className="mt-1.5 w-full rounded-lg bg-black/25 border border-gold/30 px-3 py-2.5 text-cream text-sm outline-none focus:border-gold-bright"
          />
        </label>
        {error ? <p className="mt-1 text-xs text-suit-red">{error}</p> : null}

        <p className="mt-4 text-xs text-cream/70 mb-1.5">选择难度</p>
        <div className="flex gap-1.5">
          {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium border ${
                difficulty === d
                  ? 'bg-gold/30 border-gold-bright text-gold-bright'
                  : 'bg-wood/50 border-gold/25 text-cream/80'
              }`}
            >
              {DIFFICULTY_LABEL[d]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-cream/45 text-center">
          简单单花色 · 中等双花色 · 困难四花色
        </p>

        <button
          type="button"
          onClick={submit}
          className="mt-5 w-full rounded-xl bg-gold text-felt-dark font-semibold py-2.5 hover:bg-gold-bright active:scale-[0.99]"
        >
          开始游戏
        </button>
      </div>
    </div>
  )
}
