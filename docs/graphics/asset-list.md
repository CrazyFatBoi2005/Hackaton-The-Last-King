# Chess Survivors Asset List

## Licensing Summary

All current assets below are original SVG files generated in this repository for Chess Survivors on 2026-05-24. No third-party art packs, commercial game assets, or copyrighted chess packs were used.

License status: project-original, attribution-free for the public hackathon deployment. If the repository later adds a formal LICENSE file, include these generated assets under the same project license or dedicate them to CC0-1.0.

## Assets

| Asset name | File path | Source URL or generation note | License | Attribution | Used for |
| --- | --- | --- | --- | --- | --- |
| Last King piece | `public/assets/chess-survivors/piece-last-king.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Player king sprite and HUD hero icon. |
| Corrupted Pawn | `public/assets/chess-survivors/piece-corrupted-pawn.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Basic enemy sprite. |
| Rotten Rook | `public/assets/chess-survivors/piece-rotten-rook.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Durable/slow enemy sprite. |
| Mad Knight | `public/assets/chess-survivors/piece-mad-knight.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Fast or tactical enemy sprite. |
| Blind Bishop | `public/assets/chess-survivors/piece-blind-bishop.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Optional diagonal-threat enemy sprite. |
| Fallen Queen | `public/assets/chess-survivors/piece-fallen-queen.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Optional boss/miniboss sprite. |
| XP Shard | `public/assets/chess-survivors/fx-xp-shard.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | XP drops and pickup animation. |
| Pawn Strike | `public/assets/chess-survivors/fx-pawn-strike.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Pawn weapon telegraph/impact overlay. |
| Knight Pulse | `public/assets/chess-survivors/fx-knight-pulse.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Knight weapon target markers. |
| Bishop Ray | `public/assets/chess-survivors/fx-bishop-ray.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Bishop diagonal beam overlay. |
| Rook Charge | `public/assets/chess-survivors/fx-rook-charge.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Rook rank/file attack overlay. |
| Queen Decree | `public/assets/chess-survivors/fx-queen-decree.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Queen late-game/boss attack overlay. |
| Hit Flash | `public/assets/chess-survivors/fx-hit-flash.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Enemy hit flash and king damage pulse. |
| Enemy Death Pop | `public/assets/chess-survivors/fx-enemy-death-pop.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Enemy death burst sprite/effect reference. |
| Damage Number Pop | `public/assets/chess-survivors/fx-damage-number-pop.svg` | Original vector generated for this project as a style reference. | Project-original, attribution-free. | None required. | Damage number color/outline reference; dynamic numbers can be CSS text. |
| Level-Up Card Frame | `public/assets/chess-survivors/ui-level-up-card.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Upgrade card background/frame. |
| Boss Warning Banner | `public/assets/chess-survivors/ui-boss-warning.svg` | Original vector generated for this project. | Project-original, attribution-free. | None required. | Fallen Queen warning banner. |

## Integration Notes

- Keep sprites at a fixed cell-relative size: player 0.9-1.05 cell, common enemies 0.75-0.9 cell, boss 1.4-1.7 cells.
- Attack SVGs are transparent overlays. Render them below pieces unless the effect is an outline only.
- Damage numbers can be implemented as live text using the colors from `art-direction.md`; the SVG is only a style sample.
- The source-of-truth asset folder is `public/assets/chess-survivors` per project prompt. The current Vite client may need `publicDir` configuration or a copy/symlink into `client/public/assets` when the render agent wires these into the app.
