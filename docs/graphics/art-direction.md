# Chess Survivors Art Direction

## Goal

Chess Survivors should read instantly in the first 30 seconds: the player is the Last King, the floor is an endless chessboard, enemies are corrupted chess pieces, and attacks are clear chess patterns. The visual style is dark royal fantasy, but gameplay readability wins over decoration.

The art should feel like a corrupted chess kingdom: graphite stone, worn ivory, royal gold, crimson corruption, and very limited blue/violet magic. Avoid a full-screen purple haze. Use silhouette, contrast, and short-lived effects rather than noisy background art.

## Palette Tokens

Use these as CSS tokens or a visual config baseline.

```css
:root {
  --cs-bg: #0b0d10;
  --cs-bg-soft: #12151a;
  --cs-surface: #181b21;
  --cs-surface-raised: #22252c;
  --cs-border: #39342b;

  --cs-board-dark: #1a1d22;
  --cs-board-light: #b8af94;
  --cs-board-light-muted: #7c745f;
  --cs-board-grid: rgba(244, 232, 193, 0.16);

  --cs-ivory: #f0e5c7;
  --cs-ivory-muted: #c9bea1;
  --cs-gold: #d9aa3a;
  --cs-gold-hot: #ffd56a;
  --cs-crimson: #b82537;
  --cs-crimson-hot: #ff445f;
  --cs-corruption-dark: #3b0f19;
  --cs-magic-blue: #63c7ff;
  --cs-magic-violet: #9a6cff;

  --cs-text: #e9dfc5;
  --cs-text-muted: #a89f8c;
  --cs-shadow: rgba(0, 0, 0, 0.55);
}
```

Usage ratios:

- Graphite and muted board tones: 65-75%.
- Ivory and gold: 15-25%.
- Crimson corruption: 8-12%.
- Blue/violet magic: 3-6%, reserved for special attacks and rare accents.

## Endless Chessboard

The board is the primary readable space. It should be clean, flat, and procedurally colored from world coordinate parity.

- Render a 13x13 or 15x15 viewport centered on the king.
- Use alternating dark graphite and weathered ivory cells. The ivory cell should be muted, not pure white.
- Keep cell borders subtle: 1px graphite/ivory alpha lines or no border if the alternating tones are enough.
- Add a very light vignette outside the playable grid only if it does not hide edge spawns.
- Do not add ornate floor textures, smoke, or complex background illustrations behind cells.
- Optional: add tiny coordinate ticks every 5 cells at very low opacity to imply infinite world movement.

Layer order:

1. Board cells.
2. Telegraphs and attack highlights.
3. XP shards and pickups.
4. Enemies.
5. Player king.
6. Damage numbers, death pops, hit flashes.
7. HUD and modals.

## King

The Last King is the visual anchor.

- Shape: compact crowned chess silhouette with a readable cross/crown top and heavy base.
- Color: gold body, ivory highlight, dark graphite outline.
- Size: about 85-95% of a cell, with crown allowed to reach 105% if it does not overlap UI.
- Anchor: always centered in his cell; never hidden under attack effects.
- Feedback: gold/ivory invulnerability flash, small ring pulse after damage, brief board shake for heavy hits.
- Z-index: above enemies and attack highlights.

If everything else becomes chaotic, the king should still be findable through gold color, outline, and a small persistent shadow/glow.

## Enemies

Enemy silhouettes must differ by type before color is considered.

### Corrupted Pawn

- Smallest enemy.
- Shape: hunched pawn drop with a crimson core and broken base.
- Color: dark graphite shell with crimson cracks.
- Read: common fodder, weak, many on screen.

### Rotten Rook

- Heavy square tower.
- Shape: crenellated block, wide base, cracked masonry.
- Color: dark stone with deep crimson seams.
- Read: durable blocker or slow pressure enemy.

### Mad Knight

- Angular horse-head shard.
- Shape: slanted head, jagged mane, hooked nose.
- Color: graphite with one small blue/violet eye and crimson underside.
- Read: faster, more erratic, tactically dangerous.

### Blind Bishop

- Tall narrow mitre.
- Shape: bishop slit/diagonal cut, blindfold band.
- Color: ivory-dark shell with crimson vertical damage and faint blue diagonal magic.
- Read: diagonal threat, precision danger.

### Fallen Queen

- Larger boss silhouette.
- Shape: crown spikes, heavy queen base, hollow dark center.
- Color: crimson corruption wrapped in tarnished gold and ivory.
- Read: boss/miniboss, command presence, should occupy 1.4-1.7 cells if implemented as a boss.

## Attacks

All attacks should communicate their chess pattern before or as damage happens. Telegraph first, damage second.

### Pawn Strike

- Visual: short gold/crimson wedge or highlighted cells directly in front of the king.
- Timing: 90-140ms telegraph, 80-120ms impact flash.
- Color: gold core, crimson edge if upgraded.

### Knight Pulse

- Visual: eight L-pattern target rings/diamonds around the king.
- Timing: quick pop at each target, not a full-screen wave.
- Color: limited blue/violet with ivory rim.

### Bishop Ray

- Visual: clean diagonal ray bands that follow cell diagonals.
- Timing: thin telegraph line, then brighter slash.
- Color: ivory/gold ray with a small blue-violet magic edge.

### Rook Charge

- Visual: horizontal and/or vertical rank/file bands.
- Timing: strong directional sweep, high clarity.
- Color: gold/ivory center with graphite shadow.

### Queen Decree

- Visual: combined cardinal and diagonal star pattern.
- Timing: boss-grade or late-upgrade effect; keep alpha low so it does not cover pieces.
- Color: gold and ivory with tiny crimson sparks. Avoid making it mostly violet.

## XP And Rewards

XP shards are small readable pickups.

- Shape: tiny diamond/shard, 35-45% of a cell.
- Color: gold with a limited blue glint so it is distinct from enemies.
- Motion: on pickup, arc or glide toward the king over 180-280ms.
- Do not make XP crimson; crimson belongs to corruption and danger.

Level-up should feel royal and clean.

- Pause gameplay and dim the board, but keep the grid faintly visible.
- Show 3 cards with consistent dimensions.
- Each card has a chess icon, upgrade name, one-line effect, and rarity/accent strip.
- Card frame: graphite surface, ivory border, gold hover/selected outline.
- Rare/special cards may use restrained violet edge light.

## Damage, Hits, And Death

- Enemy hit flash: quick ivory flash with crimson crack pulse, 80-120ms.
- King hit flash: gold to ivory blink, plus a small red vignette or ring, 150-250ms.
- Enemy death pop: small radial burst of crimson shards and gold dust, 180-260ms.
- Damage numbers: compact, high-contrast, outlined text. Normal damage uses ivory/gold; player damage uses crimson-hot. Numbers rise 0.4-0.7 cell and fade within 700ms.
- Keep death particles below 8-12 particles per enemy in busy waves.

## Boss Warning

The boss warning should interrupt without hiding the board.

- Banner: top-center or board-center strip, dark graphite fill, crimson edge, gold title text.
- Copy: short, for example `FALLEN QUEEN APPROACHES`.
- Board feedback: threatened ranks/files/diagonals pulse crimson at 25-35% opacity.
- Duration: 1.5-2.5 seconds before boss appears.
- Do not cover the king for the entire warning.

## Readability Rules

- The king always wins the contrast fight.
- Enemy type must be readable from silhouette at one cell size.
- Attack telegraphs stay below characters in layer order unless they are pure outline.
- Active damage effects may brighten, but should be short-lived.
- No decorative background should compete with the board.
- Avoid full-screen blue/violet gradients; reserve blue/violet for magic accents.
- Board cells must remain visible under all effects.
- UI should not overlap the active grid unless gameplay is paused.
- Use fixed cell-relative dimensions for pieces, attacks, pickups, and numbers so layout does not shift.
- Test at common laptop widths; if text or cards collide, reduce copy before reducing gameplay space.

## Integration Notes

The original SVG assets live under `public/assets/chess-survivors`. They are intentionally flat, high-contrast, and dependency-free. The main game renderer can use them as image sprites, CSS mask images, or inline SVG imports.

In the current Vite client, root `public/` is not automatically the client public directory unless the client config is adjusted. Keep `public/assets/chess-survivors` as the source-of-truth requested by the project prompt; the implementation agent can either configure Vite `publicDir` or copy/symlink the folder into `client/public/assets` when wiring the playable renderer.
