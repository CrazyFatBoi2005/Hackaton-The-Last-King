# Chess Survivors Audio Plan

## Selection Summary

Status: selected, downloaded, and replaced with a casino/arcade direction.

Important legal note: no audio was copied from Vampire Survivors. That game's assets are commercial copyrighted material. This pack uses legal CC0 sources with a similar functional goal: fast reward feedback, bright coin blips, chip clicks, jackpot stingers, and upbeat chiptune energy.

Target mood: cheerful arcade casino survival. The board should feel like a cursed chess machine paying out every few seconds: chips for movement and combat, coins for XP, short jackpot bursts for upgrades, and a happy dynamic music loop under the run.

Downloaded folder:

`C:\Programming\hackaton\public\audio`

Current total size: about 0.57 MB.

## Event Map

| Event | File | Recommended volume | Usage note |
| --- | --- | ---: | --- |
| Background music loop | `public/audio/music_arcade_invincibility_loop.ogg` | 0.22 | Upbeat 8-bit loop. Start on `Start Run` after user gesture. |
| UI click/select | `public/audio/ui_click_select.ogg` | 0.40 | Buttons, card select, retry select. Crisp casino chip tap. |
| King move | `public/audio/king_move_chip_tick.ogg` | 0.22 | One-cell movement. New short procedural arcade tick for frequent replay. |
| King hit | `public/audio/king_hit_chip_clack.ogg` | 0.66 | Player damage. New falling arcade hit with a sharper negative read. |
| Enemy hit | `public/audio/enemy_hit_chip_clack.ogg` | 0.34 | Weapon impact on enemy. Cap simultaneous voices. |
| Enemy death | `public/audio/enemy_death_chip_payout.ogg` | 0.46 | New short payout burst when a corrupted piece dies. |
| XP pickup | `public/audio/xp_pickup_coin_blip.wav` | 0.32 | Main dopamine sound. Add pitch variance for pickup streams. |
| Extra pickup / bonus | `public/audio/bonus_coin_blip.wav` | 0.28 | Optional alternate for larger XP gems or chained pickups. |
| Level-up | `public/audio/level_up_jackpot.ogg` | 0.76 | Local CC0-derived mini jackpot from coin blips. |
| Weapon proc / attack whoosh | `public/audio/attack_card_whoosh.ogg` | 0.30 | Auto weapon fire, especially bishop/rook/queen pattern reveals. |
| Boss warning | `public/audio/boss_warning_slot_rattle.ogg` | 0.74 | New escalating slot-warning tick before boss or corruption surge. |
| Game over | `public/audio/game_over_bust.ogg` | 0.72 | New descending arcade bust stinger. Stop or fade music first. |
| Victory | `public/audio/victory_jackpot.ogg` | 0.78 | Jackpot payout stinger. Stop or fade music first. |

## Loop Strategy

Use `music_arcade_invincibility_loop.ogg` as the default run loop.

Recommended hackathon implementation:

- Create one persistent `HTMLAudioElement` for music.
- Set `loop = true`.
- Start after the first user gesture, ideally `Start Run`.
- Fade in over 250-500 ms.
- Keep music at about 0.22 master volume during normal play so coin/chip SFX stay readable.
- Duck music to about 0.10 for 500-800 ms on level-up, boss warning, game over, and victory.
- Fade out over 400-600 ms on game over or victory.

If the loop feels too intense for longer runs, expose only one tuning value first: `musicVolume`. Do not spend hackathon time building a full adaptive music system.

## Mix Rules

- SFX master around 0.70, music master around 0.22.
- Repeated sounds should use small pitch variation:
  - XP pickup: 0.88-1.18
  - King move: 0.96-1.05
  - Enemy hit: 0.92-1.08
  - Enemy death: 0.95-1.08
- Voice caps:
  - `xp_pickup_coin_blip`: max 6 active, or batch pickups every 50-80 ms.
  - `enemy_hit_chip_clack`: max 4 active.
  - `attack_card_whoosh`: max 3 active.
  - `king_move_chip_tick`: max 1 active, retrigger allowed.
- Critical feedback priority:
  1. king hit
  2. level-up jackpot
  3. boss warning rattle
  4. XP pickup
  5. enemy death payout
  6. enemy hit / attack whoosh
  7. king move / UI click

## Fallback Plan

If audio wiring is running late, implement only this minimal set:

- `music_arcade_invincibility_loop.ogg`
- `king_move_chip_tick.ogg`
- `xp_pickup_coin_blip.wav`
- `level_up_jackpot.ogg`
- `boss_warning_slot_rattle.ogg`
- `game_over_bust.ogg`
- `victory_jackpot.ogg`

If there is not enough time for music, wire SFX only. The first 30 seconds benefit most from movement ticks, XP coin blips, and the level-up jackpot.

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
  | "bonusPickup"
  | "levelUp"
  | "attackWhoosh"
  | "bossWarning"
  | "gameOver"
  | "victory";
```
