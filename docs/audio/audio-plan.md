# Chess Survivors Audio Plan

## Selection Summary

Status: selected and downloaded.

Target mood: dark royal fantasy, tense, ritual-like, and readable. The game should feel like a corrupted throne room expanding into an endless board, not like a loud action trailer. Music stays low and ominous; SFX carry most of the moment-to-moment feedback.

All selected assets are CC0. Attribution is not required, but credits are documented in `docs/audio/audio-credits.md`.

Downloaded folder:

`C:\Programming\hackaton\public\audio`

Current total size: about 2.9 MB.

## Event Map

| Event | File | Recommended volume | Usage note |
| --- | --- | ---: | --- |
| Background music loop | `public/audio/music_dark_shrine_loop.ogg` | 0.26 | Start on run start after user gesture. Keep under SFX. |
| UI click/select | `public/audio/ui_click_select.wav` | 0.35 | Buttons, card select, retry select. |
| King move | `public/audio/king_move.wav` | 0.24 | One-cell movement. Add slight pitch variance if easy. |
| King hit | `public/audio/king_hit.wav` | 0.68 | Player damage. Pair with hit flash/shake. |
| Enemy hit | `public/audio/enemy_hit.wav` | 0.38 | Weapon impact on enemy. Limit simultaneous voices. |
| Enemy death | `public/audio/enemy_death.wav` | 0.42 | Corrupted piece removed. Use lower volume during swarms. |
| XP pickup | `public/audio/xp_pickup.wav` | 0.26 | Pickup shard. Pitch randomization helps repeated pickups. |
| Level-up | `public/audio/level_up.wav` | 0.72 | Play when upgrade cards appear. Duck music briefly. |
| Weapon proc / attack whoosh | `public/audio/attack_whoosh.wav` | 0.32 | Auto weapon fire. Cap to avoid machine-gun noise. |
| Boss warning | `public/audio/boss_warning.wav` | 0.78 | Telegraph boss spawn or corruption surge. Optional music duck. |
| Game over | `public/audio/game_over.wav` | 0.74 | Death/result screen. Stop or fade music first. |
| Victory | `public/audio/victory.wav` | 0.70 | Win/result screen. Stop or fade music first. |

## Loop Strategy

Use `music_dark_shrine_loop.ogg` as the default run loop.

Recommended hackathon implementation:

- Create one persistent `HTMLAudioElement` for music.
- Set `loop = true`.
- Start after the first user gesture, ideally `Start Run`.
- Fade in over 500-800 ms.
- Keep music at about 0.26 master volume during normal play.
- Duck to about 0.12 for 700-1000 ms on level-up and boss warning if easy.
- Fade out over 500 ms on game over or victory.

If gapless looping becomes noticeable, keep the same asset but switch music playback to Web Audio with a decoded `AudioBufferSourceNode`. For hackathon scope, native `loop` is acceptable.

## Mix Rules

- SFX master around 0.65, music master around 0.26.
- Repeated sounds should have a small pitch range when possible:
  - XP pickup: 0.94-1.10
  - King move: 0.96-1.04
  - Enemy hit: 0.92-1.06
- Voice caps:
  - `attack_whoosh`: max 3 active
  - `enemy_hit`: max 4 active
  - `xp_pickup`: max 5 active, or batch pickups into one sound every 60-90 ms
- Critical feedback priority:
  1. king hit
  2. level-up
  3. boss warning
  4. XP pickup
  5. enemy hit/death
  6. attack whoosh

## Fallback Plan

If audio wiring is running late, implement only this minimal set:

- `music_dark_shrine_loop.ogg`
- `king_hit.wav`
- `xp_pickup.wav`
- `level_up.wav`
- `game_over.wav`
- `victory.wav`

If there is not enough time for music, wire SFX only. The first 30 seconds benefit most from king movement, XP pickup, and level-up feedback.

If no audio is wired, keep the game silent instead of throwing load/play errors. Audio should never block run start, movement, combat, or retry.

## Integration Note

The requested asset folder is `C:\Programming\hackaton\public\audio`.

The current project has a Vite client under `C:\Programming\hackaton\client`; Vite normally serves assets from `client/public`. When implementing playback, either copy/sync this selected folder to `client/public/audio`, or add a small build/dev convention that exposes root `public/audio` to the client.

Suggested audio keys if an audio manager is added later:

```ts
type AudioKey =
  | "music"
  | "uiClick"
  | "kingMove"
  | "kingHit"
  | "enemyHit"
  | "enemyDeath"
  | "xpPickup"
  | "levelUp"
  | "attackWhoosh"
  | "bossWarning"
  | "gameOver"
  | "victory";
```
