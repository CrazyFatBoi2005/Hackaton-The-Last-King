# Chess Survivors Meta Progression

This document defines the run build system for Chess Survivors: weapons, upgrade
cards, archetypes, starting balance, and the first five minutes of progression.
It is intentionally small enough for a hackathon build.

## Design Stance

- Chess is the pattern language, not a strict simulation.
- The main progression is per-run: collect XP, choose 1 of 3 cards, shape a build.
- Permanent meta progression is optional and should not add grind for the MVP.
- Every card should create an immediate visible spike: new pattern, larger area,
  faster cadence, survival save, or a clear rare mutation.
- Active weapon cap: 4 weapons.
- Weapon max level: 4. Each level is a meaningful breakpoint.
- First three level-ups are partially scripted so the first run feels good.
- Newly unlocked or upgraded weapons should fire within 0.2 seconds after the
  level-up choice so the player instantly sees the payoff.

## Lightweight Meta Progression

For MVP, keep permanent progression tiny and localStorage-only:

| Unlock | Rule | Effect |
| --- | --- | --- |
| Queen's Decree in card pool | Reach player level 4 once, or survive 2:00 once | Allows Queen's Decree to appear as a rare weapon card in future runs |
| Starter choice | Win once, or survive 4:00 once | Player may start with Pawn Strike or King's Aura |
| Best run records | Always | Store best time, best level, best kills |

Do not add permanent damage, HP, or cooldown upgrades for the hackathon MVP.
The game should be replayable because builds change, not because the player
grinds numeric account power.

## Weapon Catalog

All damage values are config points, not player hearts. Recommended enemy HP:
Corrupted Pawn 10, Mad Knight 18, Rotten Rook 42, Blind Bishop 24.

### Pawn Strike

Fantasy: disciplined royal infantry strikes in front of the king.

Pattern: attacks cells in the king's facing direction. It is the clearest first
weapon because it teaches facing, movement, cooldowns, kills, and XP.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 1.15s |
| Damage | 10 |
| Range | 2 cells forward |
| Targets | Every enemy in highlighted cells |
| Scaling | Damage, range, frontal width, rear safety |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | Pawn Strike | Hit 2 cells forward for 10 damage |
| 2 | Long File | Range becomes 3 cells, damage becomes 14 |
| 3 | Pawn Fork | Also hits front-left and front-right cells up to 2 cells deep |
| 4 | Promotion Drill | Cooldown becomes 0.95s and also strikes 2 cells behind the king |

Visual/readability note: highlight a short gold file in front of the king, then
flash a compact wedge at level 3. Keep it brief so it does not hide enemies.

### Knight Pulse

Fantasy: tactical shockwaves at knight-move positions.

Pattern: hits the 8 classic knight offsets around the king. This gives instant
chess identity and protects against enemies approaching from odd angles.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 2.40s |
| Damage | 14 |
| Range | Knight offsets: (1,2), (2,1), and mirrored variants |
| Targets | Every enemy in highlighted cells |
| Scaling | Cooldown, double pulse, stun, long L echo |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | Knight Pulse | Hit all 8 knight cells for 14 damage |
| 2 | Tempo Cut | Cooldown becomes 2.05s, damage becomes 17 |
| 3 | Double Pulse | Repeats once after 0.25s at 70% damage |
| 4 | Forked Tempo | Pulse applies 0.35s stun and every second cast also hits long-L offsets (2,3) and (3,2) |

Visual/readability note: show 8 crisp blue-white squares with a small horse-head
spark at each cell. The delayed second pulse should use a lighter outline.

### Bishop Ray

Fantasy: diagonal royal light cutting through corruption.

Pattern: fires diagonal rays from the king in all 4 diagonal directions. This is
the main line-clearing weapon for enemies coming from corners of the viewport.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 3.00s |
| Damage | 13 |
| Range | 5 cells on each diagonal |
| Targets | Every enemy on highlighted diagonal cells |
| Scaling | Range, damage over time, repeat ray |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | Bishop Ray | Hit 4 diagonals, range 5, damage 13 |
| 2 | Long Diagonal | Range becomes 7, damage becomes 16 |
| 3 | Sacred Burn | Hit enemies also take 5 damage over 1.5s |
| 4 | Cathedral Beam | Ray repeats after 0.35s for 80% damage |

Visual/readability note: use thin diagonal beams with a fast telegraph line.
Avoid thick lasers that cover the board parity.

### Rook Charge

Fantasy: fortress force projected down ranks and files.

Pattern: attacks straight lines in the 4 cardinal directions. It clears lanes
and pushes back pressure when the player is being boxed in.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 3.20s |
| Damage | 15 |
| Range | 4 cells up, down, left, right |
| Targets | Every enemy in highlighted cells |
| Scaling | Range, damage, width, knockback trail |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | Rook Charge | Hit 4 cardinal lanes, range 4, damage 15, knockback 1 cell |
| 2 | Open File | Range becomes 6, damage becomes 18 |
| 3 | Stone Rank | First 3 cells of each lane become width 3, damage becomes 20 |
| 4 | Castling Wall | Leaves a 0.8s damaging trail for 8 damage and knockback 1 cell |

Visual/readability note: use straight ivory/gold ranks and files. Knockback must
move enemies along the line direction so the result is easy to read.

### Queen's Decree

Fantasy: a rare board-clearing royal command.

Pattern: combines rook and bishop language by firing in 8 directions. It should
feel like an ultimate, not a normal filler weapon.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 8.00s |
| Damage | 26 |
| Range | 7 cells in 8 directions |
| Targets | Every enemy in highlighted cells |
| Scaling | Cooldown, range, repeat decree, execute threshold |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | Queen's Decree | Hit 8 directions, range 7, damage 26 |
| 2 | Royal Command | Cooldown becomes 7.00s, damage becomes 32 |
| 3 | Absolute File | Range becomes 9 and hit enemies below 25% HP are executed |
| 4 | Second Decree | Repeats after 0.45s for 60% damage |

Visual/readability note: this can be the biggest effect in the game, but it must
be short. Use a clear eight-direction starburst and a strong screen-light pulse.

### King's Aura

Fantasy: the king's last defensive authority.

Pattern: periodic ring pulse around the king. It prevents frustrating deaths
from enemies entering adjacent cells and gives defensive builds an identity.

Base config:

| Field | Value |
| --- | --- |
| Cooldown | 0.75s pulse tick |
| Damage | 5 |
| Range | Adjacent 8 cells |
| Targets | Every enemy in ring cells |
| Scaling | Tick damage, radius, knockback, emergency defense |

Levels:

| Level | Name | Effect |
| --- | --- | --- |
| 1 | King's Aura | Pulse adjacent 8 cells for 5 damage every 0.75s |
| 2 | Royal Guard | Damage becomes 8 |
| 3 | Wider Court | Adds radius 2 outer ring for 5 damage |
| 4 | Last Authority | Every fourth pulse knocks enemies back 1 cell; if HP is below 35%, also grants 0.35s invulnerability |

Visual/readability note: use a subtle gold ring pulse centered on the king. The
aura should not look like a permanent filled circle because it would hide melee
threats.

## Upgrade Catalog

### Common Weapon Cards

Common weapon cards are either unlock cards or next-level cards for owned
weapons. They are the backbone of builds.

| Card Type | Rule | Example |
| --- | --- | --- |
| Weapon unlock | Offered only if active weapons are below cap and weapon is unlocked | "Knight Pulse: hit knight-move cells around you" |
| Weapon level | Offered only for owned weapons below max level | "Bishop Ray II: longer diagonals and more damage" |
| Starter upgrade | Pawn Strike level 2 or King's Aura level 1 can appear in the first level-up | "Long File: Pawn Strike reaches farther" |

### Stat Cards

Stat cards should be strong and limited. Avoid tiny filler cards.

| Card | Rarity | Effect | Stack Limit |
| --- | --- | --- | --- |
| Royal Tempo | Common | All weapon cooldowns -10% | 2 |
| Sharp Orders | Common | All weapon damage +15% | 2 |
| King's Step | Common | Movement step cooldown -10% | 2 |
| Royal Magnet | Common | XP pickup radius +0.75 cells | 2 |
| Castle Skin | Common | Max HP +20 and heal 20 HP | 2 |
| Oracle Lessons | Common | XP gained +18% | 1 |
| Emergency Coronation | Common | Heal 35 HP and gain +0.25s post-hit invulnerability | 1 |

### Rare Mutation Cards

Rare cards should define a build. They need prerequisites so the offered card
usually matches the player's current direction.

| Card | Unlock Rule | Effect |
| --- | --- | --- |
| Promotion Chain | Pawn Strike level 3+ | Pawn Strike kills reduce its cooldown by 0.15s, max 0.45s per cast cycle |
| Forked Timeline | Knight Pulse level 2+ | Knight Pulse double pulse deals 100% damage instead of 70% |
| Diagonal Inferno | Bishop Ray level 3+ | Sacred Burn spreads to one adjacent enemy if the burned enemy dies |
| Castling Engine | Rook Charge level 2+ and King's Aura owned | Rook Charge trail also triggers one King's Aura pulse |
| Queen's Favor | Player level 4+ or 3 owned weapons | Unlock Queen's Decree, or upgrade it if already owned |
| Last Stand | King's Aura owned or player HP below 50% once | While below 40% HP, cooldowns are reduced by 18% |

## Unlock Rules

- Pawn Strike, Knight Pulse, Bishop Ray, Rook Charge, and King's Aura are
  available from the first run.
- Queen's Decree is rare. It enters the pool after player level 4 in the current
  run, or after the player has reached level 4 once in any previous run.
- Do not offer new weapon unlocks after the player has 4 active weapons.
- Do not offer level cards for locked or maxed weapons.
- Do not offer rare mutations before the third level-up, except Queen's Favor if
  the run is already behind on damage after 2:00.
- If the player has only 1 weapon after two level-ups, force a new weapon offer.
- If the player has no defensive tool by level 4, increase King's Aura offer
  weight until it appears.

## 3-Card Generation Rules

Card generation should feel guided without feeling scripted.

### First Three Level-Ups

| Player Level Reached | Target Time | Forced Offer Shape |
| --- | --- | --- |
| Level 2 | 20-35s | Knight Pulse unlock, King's Aura unlock, Pawn Strike level 2 |
| Level 3 | 45-65s | 1 owned weapon upgrade, 1 new weapon, 1 stat card |
| Level 4 | 75-100s | 1 owned weapon upgrade, 1 build-synergy rare if eligible, 1 new weapon or strong stat |

The first level-up should never be three passive stat cards. At least two cards
must visibly change attack coverage.

### General Algorithm

Generate three slots, then dedupe by card id:

| Slot | Purpose | Rule |
| --- | --- | --- |
| A | Power | Prefer next level for an owned weapon; fallback to Sharp Orders or Royal Tempo |
| B | Coverage | Prefer a new weapon if active weapon count is below 3; after that, prefer owned weapon level |
| C | Twist | 55% stat card, 30% eligible rare, 15% weapon card |

Additional rules:

- No duplicate cards in the same offer.
- No more than one rare card in the same offer.
- No pure-stat-only offers before player level 5.
- If a player skipped new weapons for two consecutive level-ups and has fewer
  than 3 weapons, force one new weapon card.
- If all cards in a slot are invalid, use a safe fallback in this order:
  owned weapon level, Royal Tempo, Sharp Orders, Castle Skin.
- Selecting a weapon unlock or weapon upgrade resets that weapon cooldown to
  ready so the power spike appears immediately.

## Class And Build Archetypes

These are not hard classes. They are recognizable build lanes produced by card
synergy.

| Archetype | Core Weapons | Key Stats/Cards | Playstyle |
| --- | --- | --- | --- |
| Knight Tempo | Knight Pulse, Pawn Strike, King's Aura | Royal Tempo, King's Step, Forked Timeline | Fast dodging around packs, frequent pulses, safe against flanks |
| Bishop Laser | Bishop Ray, Queen's Decree, Pawn Strike | Sharp Orders, Diagonal Inferno, Royal Magnet | Kites diagonally, lines enemies up, melts dense waves |
| Rook Fortress | Rook Charge, King's Aura, Bishop Ray | Castle Skin, Castling Engine, Emergency Coronation | Holds space, clears lanes, survives mistakes |
| Queen Storm | Queen's Decree, Bishop Ray, Rook Charge | Royal Tempo, Sharp Orders, Queen's Favor | Late-game burst build, huge screen-clearing moments |
| Pawn Swarm | Pawn Strike, Knight Pulse, Rook Charge | Promotion Chain, Royal Tempo, Oracle Lessons | Aggressive early snowball, many quick small clears |
| Royal Tank | King's Aura, Rook Charge, Knight Pulse | Castle Skin, Last Stand, Royal Magnet | Close-range survival, walks through pressure and collects XP safely |

Build guidance:

- Knight Tempo is the safest "fun first" build because Knight Pulse immediately
  covers blind spots.
- Bishop Laser is the clearest high-skill build because positioning changes ray
  value.
- Rook Fortress and Royal Tank are beginner-friendly because they correct
  mistakes and prevent sudden melee deaths.
- Queen Storm should feel aspirational. It is strongest after level 5, not in
  the first 30 seconds.

## Starter Build Recommendation

Default first-run starter:

- Weapon: Pawn Strike level 1.
- Player HP: 100.
- Pickup radius: 1.35 cells.
- Active weapon cap: 4.
- First level-up fixed offer: Knight Pulse, King's Aura, Pawn Strike level 2.

Recommended first pick for demo feel: Knight Pulse. It immediately creates a
new pattern around the king and shows that chess pieces become weapons.

If early deaths are too common, switch default starter to King's Aura level 1
and make Pawn Strike the first fixed card. Do this only if testers die before
their first level-up.

## First 5 Minutes Progression Curve

| Time | Expected State | Enemy Pressure | Player Feeling |
| --- | --- | --- | --- |
| 0:00-0:20 | Level 1, Pawn Strike | Slow Corrupted Pawns from multiple sides | "I get it. Move, auto-attack, collect XP." |
| 0:20-0:35 | Level 2 | 5-8 total pawns killed | First card choice, immediate new pattern |
| 0:35-1:05 | Level 3 | Pawns spawn faster, first small surround | Build direction starts: tempo, aura, or line clear |
| 1:05-1:40 | Level 4 | Rotten Rook appears, optional Mad Knight warning | First rare/synergy moment or third weapon |
| 1:40-2:30 | Level 5-6 | Mixed pawns, rooks, knights | Player has 2-3 weapons and can intentionally kite |
| 2:30-3:15 | Level 6-7 | Higher density, diagonal threats if implemented | Build identity is readable |
| 3:15-4:00 | Level 7-8 | Fallen Queen warning or corruption surge | Big spike cards matter |
| 4:00-5:00 | Level 8-10 | Boss or final survival wave | Run reaches win/lose payoff |

## Balance Table

### Player And World

| Config Key | Value |
| --- | --- |
| visibleViewportSize | 15x15 |
| spawnRingChebyshevMin | 9 cells from king |
| spawnRingChebyshevMax | 11 cells from king |
| activeWeaponCap | 4 |
| playerMaxHp | 100 |
| playerStartHp | 100 |
| playerMoveStepCooldown | 0.16s |
| postHitInvulnerability | 0.85s |
| pickupRadius | 1.35 cells |

### XP Curve

Use XP required from the current level to the next level:

| Current Level | XP To Next | Expected Timing |
| --- | --- | --- |
| 1 | 6 | Level 2 at 20-35s |
| 2 | 8 | Level 3 at 45-65s |
| 3 | 11 | Level 4 at 75-100s |
| 4 | 15 | Level 5 around 2:00 |
| 5 | 18 | Level 6 around 2:30 |
| 6 | 22 | Level 7 around 3:10 |
| 7 | 26 | Level 8 around 3:50 |
| 8 | 30 | Level 9 around 4:30 |
| 9 | 34 | Level 10 around 5:00 |

### Enemy Starter Values

| Enemy | HP | Contact Damage | XP | Move Cadence | First Appears |
| --- | --- | --- | --- | --- | --- |
| Corrupted Pawn | 10 | 18 | 1 | 0.95s per step | 0:00 |
| Rotten Rook | 42 | 28 | 3 | 1.35s per step | 1:05 |
| Mad Knight | 18 | 24 | 2 | 1.15s per step, jump every 3.2s | 1:25 |
| Blind Bishop | 24 | 24 | 2 | 1.25s per step, diagonal telegraph | 2:15 |
| Fallen Queen | 260 | 35 | 0 | Boss behavior | 3:15 |

### Spawn Curve

| Time | Spawn Rule |
| --- | --- |
| 0:00-0:30 | 1 pawn every 1.45s |
| 0:30-1:00 | 1-2 pawns every 1.25s |
| 1:00-1:30 | 2 pawns every 1.15s, 1 rook every 9s |
| 1:30-2:15 | 2-3 pawns every 1.05s, 1 knight every 8s, 1 rook every 10s |
| 2:15-3:15 | 3 pawns every 0.95s, mixed elite every 6-8s |
| 3:15-5:00 | Boss or final wave; reduce normal spawns by 25% while boss is active |

### Weapon Base Values

| Weapon | Cooldown | Damage | Range | Role |
| --- | --- | --- | --- | --- |
| Pawn Strike | 1.15s | 10 | 2 forward | Starter DPS |
| Knight Pulse | 2.40s | 14 | 8 knight offsets | Surround coverage |
| Bishop Ray | 3.00s | 13 | 5 diagonal | Line clear |
| Rook Charge | 3.20s | 15 | 4 cardinal | Lane clear and knockback |
| Queen's Decree | 8.00s | 26 | 7 in 8 directions | Rare burst |
| King's Aura | 0.75s | 5 | Radius 1 ring | Defensive close range |

### Rarity Weights After Level 4

| Rarity | Weight | Notes |
| --- | --- | --- |
| Common weapon level | 45 | Highest priority if owned weapons are not maxed |
| Common stat | 25 | Strong, stack-limited |
| New weapon | 20 | Only while below active weapon cap |
| Rare mutation | 10 | Only if prerequisite is met |

## Immediate Fun Rules For First 30 Seconds

- Spawn the first pawn wave within 1 second of pressing Start Run.
- First XP shards should be collectible without backtracking far.
- Pawn Strike should one-shot Corrupted Pawns at level 1.
- First level-up must happen from 6 XP, not a larger threshold.
- First level-up offer must include at least two attack-pattern cards.
- After picking Knight Pulse or King's Aura, fire it almost immediately.
- Avoid showing Queen's Decree in the first offer; it is stronger as an
  aspirational rare later.

## Cuts If Time Runs Short

Cut in this order:

1. Permanent meta progression. Keep only best run records.
2. Rare mutations except Queen's Favor, Royal Tempo, Castle Skin, Royal Magnet.
3. Queen's Decree levels 2-4. Keep it as a single rare ultimate card.
4. Weapon level 4 effects. Ship each weapon with 3 levels.
5. Blind Bishop enemy and diagonal burn spread.
6. Dynamic weighted generation. Hardcode the first three level-up offers, then
   use simple random eligible cards.

Do not cut:

- First level-up timing.
- 3-card choice.
- At least 4 weapons: Pawn Strike, Knight Pulse, Bishop Ray, Rook Charge.
- Immediate cooldown reset after choosing a weapon card.
