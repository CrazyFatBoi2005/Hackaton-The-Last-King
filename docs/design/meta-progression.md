# Meta-progression Chess Survivors

Этот документ описывает систему билдов внутри забега для Chess Survivors:
оружия, карточки улучшений, архетипы, стартовый баланс и первые пять минут
прогрессии. Система специально ограничена так, чтобы ее можно было реализовать
за хакатон.

## Дизайн-позиция

- Шахматы здесь являются языком паттернов, а не строгой симуляцией.
- Основная прогрессия происходит внутри забега: собираешь XP, выбираешь 1 из 3
  карт, формируешь билд.
- Постоянная meta progression опциональна и не должна превращать MVP в гринд.
- Каждая карта должна сразу давать заметный эффект: новый паттерн, большую зону,
  более частый темп, защитный сейв или редкую мутацию.
- Лимит активных оружий: 4.
- Максимальный уровень оружия: 4. Каждый уровень - заметный брейкпоинт.
- Первые три level-up частично заскриптованы, чтобы первый забег ощущался вкусно.
- Новое или улучшенное оружие должно сработать в течение 0.2 секунды после выбора
  карты, чтобы игрок сразу увидел payoff.

## Легкая Meta Progression

Для MVP постоянную прогрессию лучше оставить минимальной и хранить в localStorage:

| Unlock | Правило | Эффект |
| --- | --- | --- |
| Queen's Decree в пуле карт | Достичь уровня 4 один раз или прожить 2:00 один раз | Queen's Decree может появляться как редкая карта оружия в будущих забегах |
| Выбор стартового оружия | Победить один раз или прожить 4:00 один раз | Игрок может стартовать с Pawn Strike или King's Aura |
| Рекорды забегов | Всегда | Хранить лучшее время, лучший уровень, максимум убийств |

Не добавлять постоянные апгрейды урона, HP или cooldown для MVP. Игра должна
переигрываться из-за разных билдов, а не из-за гринда числовой силы аккаунта.

## Каталог Оружия

Все значения урона - config points, а не сердца игрока. Рекомендуемые HP врагов:
Corrupted Pawn 10, Mad Knight 18, Rotten Rook 42, Blind Bishop 24.

### Pawn Strike

Fantasy: дисциплинированные удары королевской пехоты перед королем.

Pattern: атакует клетки в направлении взгляда короля. Это самое понятное первое
оружие: оно учит направлению, движению, cooldown, убийствам и XP.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 1.15s |
| Damage | 10 |
| Range | 2 клетки вперед |
| Targets | Все враги на подсвеченных клетках |
| Scaling | Урон, дальность, ширина фронта, защита сзади |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | Pawn Strike | Бьет 2 клетки вперед на 10 урона |
| 2 | Long File | Дальность становится 3 клетки, урон становится 14 |
| 3 | Pawn Fork | Также бьет переднюю-левую и переднюю-правую клетки на глубину до 2 клеток |
| 4 | Promotion Drill | Cooldown становится 0.95s и добавляется удар на 2 клетки позади короля |

Visual/readability note: подсвечивать короткую золотую линию перед королем,
затем на level 3 вспыхивает компактный фронтальный клин. Эффект должен быть
коротким, чтобы не прятать врагов.

### Knight Pulse

Fantasy: тактические ударные волны по клеткам хода коня.

Pattern: бьет 8 классических knight offsets вокруг короля. Это сразу дает
шахматную идентичность и защищает от врагов, заходящих под странными углами.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 2.40s |
| Damage | 14 |
| Range | Knight offsets: (1,2), (2,1) и зеркальные варианты |
| Targets | Все враги на подсвеченных клетках |
| Scaling | Cooldown, двойной импульс, stun, дальнее L-эхо |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | Knight Pulse | Бьет все 8 клеток хода коня на 14 урона |
| 2 | Tempo Cut | Cooldown становится 2.05s, урон становится 17 |
| 3 | Double Pulse | Повторяет импульс через 0.25s с 70% урона |
| 4 | Forked Tempo | Импульс накладывает stun на 0.35s, каждый второй cast также бьет дальние L-offsets (2,3) и (3,2) |

Visual/readability note: показать 8 четких сине-белых клеток с маленькой
искрой в форме головы коня. Отложенный второй импульс должен использовать более
легкий контур.

### Bishop Ray

Fantasy: диагональный королевский свет, разрезающий corruption.

Pattern: выпускает диагональные лучи от короля в 4 диагональных направлениях.
Это основное оружие для чистки линий, когда враги идут из углов viewport.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 3.00s |
| Damage | 13 |
| Range | 5 клеток по каждой диагонали |
| Targets | Все враги на подсвеченных диагональных клетках |
| Scaling | Дальность, damage over time, повторный луч |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | Bishop Ray | Бьет 4 диагонали, дальность 5, урон 13 |
| 2 | Long Diagonal | Дальность становится 7, урон становится 16 |
| 3 | Sacred Burn | Задетые враги также получают 5 урона за 1.5s |
| 4 | Cathedral Beam | Луч повторяется через 0.35s с 80% урона |

Visual/readability note: использовать тонкие диагональные лучи с быстрым
telegraph-line. Не делать толстые лазеры, которые закрывают parity доски.

### Rook Charge

Fantasy: сила крепости, направленная по вертикалям и горизонталям.

Pattern: атакует прямые линии в 4 cardinal directions. Очищает lanes и
отталкивает давление, когда игрока начинают зажимать.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 3.20s |
| Damage | 15 |
| Range | 4 клетки вверх, вниз, влево, вправо |
| Targets | Все враги на подсвеченных клетках |
| Scaling | Дальность, урон, ширина, knockback trail |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | Rook Charge | Бьет 4 cardinal lanes, дальность 4, урон 15, knockback 1 клетка |
| 2 | Open File | Дальность становится 6, урон становится 18 |
| 3 | Stone Rank | Первые 3 клетки каждого lane становятся шириной 3, урон становится 20 |
| 4 | Castling Wall | Оставляет damaging trail на 0.8s: 8 урона и knockback 1 клетка |

Visual/readability note: использовать прямые ivory/gold линии по ranks и files.
Knockback должен двигать врагов вдоль направления линии, чтобы результат легко
читался.

### Queen's Decree

Fantasy: редкий королевский приказ, очищающий доску.

Pattern: объединяет язык ладьи и слона, стреляя в 8 направлений. Должно
ощущаться как ultimate, а не как обычное filler-оружие.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 8.00s |
| Damage | 26 |
| Range | 7 клеток в 8 направлениях |
| Targets | Все враги на подсвеченных клетках |
| Scaling | Cooldown, дальность, повторный decree, execute threshold |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | Queen's Decree | Бьет 8 направлений, дальность 7, урон 26 |
| 2 | Royal Command | Cooldown становится 7.00s, урон становится 32 |
| 3 | Absolute File | Дальность становится 9, враги ниже 25% HP добиваются execute-эффектом |
| 4 | Second Decree | Повторяется через 0.45s с 60% урона |

Visual/readability note: это может быть самый крупный эффект игры, но он должен
быть коротким. Использовать четкую восьминаправленную вспышку-звезду и сильный
screen-light pulse.

### King's Aura

Fantasy: последняя защитная власть короля.

Pattern: периодический ring pulse вокруг короля. Предотвращает фрустрирующие
смерти от врагов в соседних клетках и дает defensive-билдам свою идентичность.

Базовый config:

| Поле | Значение |
| --- | --- |
| Cooldown | 0.75s pulse tick |
| Damage | 5 |
| Range | 8 соседних клеток |
| Targets | Все враги в клетках кольца |
| Scaling | Tick damage, радиус, knockback, emergency defense |

Уровни:

| Level | Название | Эффект |
| --- | --- | --- |
| 1 | King's Aura | Пульсирует по 8 соседним клеткам на 5 урона каждые 0.75s |
| 2 | Royal Guard | Урон становится 8 |
| 3 | Wider Court | Добавляет внешнее кольцо radius 2 на 5 урона |
| 4 | Last Authority | Каждый четвертый pulse отталкивает врагов на 1 клетку; если HP ниже 35%, также дает 0.35s invulnerability |

Visual/readability note: использовать тонкий золотой ring pulse вокруг короля.
Aura не должна выглядеть как постоянный залитый круг, иначе она будет прятать
melee-угрозы.

## Каталог Улучшений

### Common Weapon Cards

Common weapon cards - это либо unlock-карты, либо карты следующего уровня для
уже взятого оружия. Это основа билдов.

| Тип карты | Правило | Пример |
| --- | --- | --- |
| Weapon unlock | Предлагается только если активных оружий меньше cap и оружие unlocked | "Knight Pulse: бьет клетки хода коня вокруг тебя" |
| Weapon level | Предлагается только для owned weapons ниже max level | "Bishop Ray II: более длинные диагонали и больше урона" |
| Starter upgrade | Pawn Strike level 2 или King's Aura level 1 могут появиться на первом level-up | "Long File: Pawn Strike бьет дальше" |

### Stat Cards

Stat cards должны быть сильными и ограниченными. Не добавлять мелкие filler-карты.

| Карта | Rarity | Эффект | Stack Limit |
| --- | --- | --- | --- |
| Royal Tempo | Common | Cooldown всех оружий -10% | 2 |
| Sharp Orders | Common | Урон всех оружий +15% | 2 |
| King's Step | Common | Movement step cooldown -10% | 2 |
| Royal Magnet | Common | Радиус подбора XP +0.75 клетки | 2 |
| Castle Skin | Common | Max HP +20 и heal 20 HP | 2 |
| Oracle Lessons | Common | Получаемый XP +18% | 1 |
| Emergency Coronation | Common | Heal 35 HP и +0.25s post-hit invulnerability | 1 |

### Rare Mutation Cards

Rare cards должны определять билд. Им нужны prerequisites, чтобы предложенная
карта обычно совпадала с текущим направлением игрока.

| Карта | Unlock Rule | Эффект |
| --- | --- | --- |
| Promotion Chain | Pawn Strike level 3+ | Убийства Pawn Strike снижают его cooldown на 0.15s, максимум 0.45s за cast cycle |
| Forked Timeline | Knight Pulse level 2+ | Double Pulse у Knight Pulse наносит 100% урона вместо 70% |
| Diagonal Inferno | Bishop Ray level 3+ | Sacred Burn перекидывается на одного соседнего врага, если burning enemy умирает |
| Castling Engine | Rook Charge level 2+ и King's Aura owned | Trail от Rook Charge также вызывает один pulse King's Aura |
| Queen's Favor | Player level 4+ или 3 owned weapons | Unlock Queen's Decree или upgrade Queen's Decree, если оно уже owned |
| Last Stand | King's Aura owned или HP игрока один раз опустилось ниже 50% | Пока HP ниже 40%, cooldowns снижены на 18% |

## Unlock Rules

- Pawn Strike, Knight Pulse, Bishop Ray, Rook Charge и King's Aura доступны с
  первого забега.
- Queen's Decree редкое. Оно входит в пул после player level 4 в текущем забеге
  или после того, как игрок хотя бы раз достиг level 4 в любом предыдущем забеге.
- Не предлагать unlock нового оружия, если у игрока уже 4 active weapons.
- Не предлагать level cards для locked или maxed weapons.
- Не предлагать rare mutations до третьего level-up, кроме Queen's Favor, если
  после 2:00 забег явно проседает по урону.
- Если после двух level-up у игрока только 1 оружие, принудительно предложить
  новое оружие.
- Если к level 4 у игрока нет defensive tool, увеличить вес King's Aura до
  появления в оффере.

## Правила Генерации 3 Карт

Генерация карт должна ощущаться направляемой, но не полностью заскриптованной.

### Первые Три Level-Up

| Достигнутый Player Level | Целевое время | Принудительная форма оффера |
| --- | --- | --- |
| Level 2 | 20-35s | Knight Pulse unlock, King's Aura unlock, Pawn Strike level 2 |
| Level 3 | 45-65s | 1 upgrade owned weapon, 1 new weapon, 1 stat card |
| Level 4 | 75-100s | 1 upgrade owned weapon, 1 eligible build-synergy rare, 1 new weapon или strong stat |

Первый level-up никогда не должен состоять из трех passive stat cards. Минимум
две карты должны заметно менять attack coverage.

### Общий Алгоритм

Сгенерировать три slots, затем убрать дубли по card id:

| Slot | Цель | Правило |
| --- | --- | --- |
| A | Power | Предпочитать next level для owned weapon; fallback на Sharp Orders или Royal Tempo |
| B | Coverage | Предпочитать new weapon, если active weapon count ниже 3; после этого owned weapon level |
| C | Twist | 55% stat card, 30% eligible rare, 15% weapon card |

Дополнительные правила:

- Никаких duplicate cards в одном offer.
- Не больше одной rare card в одном offer.
- До player level 5 не показывать offer только из stat cards.
- Если игрок два level-up подряд пропускал new weapons и имеет меньше 3 weapons,
  принудительно дать одну new weapon card.
- Если все карты в slot invalid, использовать safe fallback в таком порядке:
  owned weapon level, Royal Tempo, Sharp Orders, Castle Skin.
- Выбор weapon unlock или weapon upgrade сбрасывает cooldown этого оружия в
  ready-состояние, чтобы power spike появился сразу.

## Классы И Архетипы Билдов

Это не жесткие классы. Это узнаваемые build lanes, которые появляются через
синергию карт.

| Архетип | Core Weapons | Key Stats/Cards | Стиль игры |
| --- | --- | --- | --- |
| Knight Tempo | Knight Pulse, Pawn Strike, King's Aura | Royal Tempo, King's Step, Forked Timeline | Быстрое уклонение вокруг pack-ов, частые pulses, защита от флангов |
| Bishop Laser | Bishop Ray, Queen's Decree, Pawn Strike | Sharp Orders, Diagonal Inferno, Royal Magnet | Kite по диагоналям, выстраивание врагов в линии, плавит плотные волны |
| Rook Fortress | Rook Charge, King's Aura, Bishop Ray | Castle Skin, Castling Engine, Emergency Coronation | Удерживает пространство, чистит lanes, прощает ошибки |
| Queen Storm | Queen's Decree, Bishop Ray, Rook Charge | Royal Tempo, Sharp Orders, Queen's Favor | Late-game burst build, большие моменты screen clear |
| Pawn Swarm | Pawn Strike, Knight Pulse, Rook Charge | Promotion Chain, Royal Tempo, Oracle Lessons | Агрессивный early snowball, много быстрых малых зачисток |
| Royal Tank | King's Aura, Rook Charge, Knight Pulse | Castle Skin, Last Stand, Royal Magnet | Close-range survival, проходит через давление и безопасно собирает XP |

Build guidance:

- Knight Tempo - самый безопасный "fun first" билд, потому что Knight Pulse сразу
  закрывает blind spots.
- Bishop Laser - самый понятный high-skill билд, потому что позиционирование
  напрямую меняет ценность лучей.
- Rook Fortress и Royal Tank beginner-friendly, потому что исправляют ошибки и
  предотвращают внезапные melee-смерти.
- Queen Storm должен ощущаться как aspirational build. Он силен после level 5,
  а не в первые 30 секунд.

## Рекомендация Стартового Билда

Default first-run starter:

- Weapon: Pawn Strike level 1.
- Player HP: 100.
- Pickup radius: 1.35 клетки.
- Active weapon cap: 4.
- Первый level-up fixed offer: Knight Pulse, King's Aura, Pawn Strike level 2.

Рекомендуемый первый выбор для demo feel: Knight Pulse. Он сразу создает новый
паттерн вокруг короля и показывает, что шахматные фигуры становятся оружием.

Если early deaths слишком частые, переключить default starter на King's Aura
level 1 и сделать Pawn Strike первой fixed card. Делать это только если тестеры
умирают до первого level-up.

## Кривая Прогрессии Первых 5 Минут

| Время | Ожидаемое состояние | Enemy Pressure | Ощущение игрока |
| --- | --- | --- | --- |
| 0:00-0:20 | Level 1, Pawn Strike | Медленные Corrupted Pawns с нескольких сторон | "Я понял: двигаться, автоатака, собирать XP." |
| 0:20-0:35 | Level 2 | 5-8 убитых pawns всего | Первый выбор карты, сразу новый паттерн |
| 0:35-1:05 | Level 3 | Pawns спавнятся быстрее, первый малый surround | Начинается направление билда: tempo, aura или line clear |
| 1:05-1:40 | Level 4 | Появляется Rotten Rook, optional Mad Knight warning | Первый rare/synergy moment или третье оружие |
| 1:40-2:30 | Level 5-6 | Mixed pawns, rooks, knights | У игрока 2-3 оружия, появляется intentional kite |
| 2:30-3:15 | Level 6-7 | Более высокая density, diagonal threats если реализованы | Идентичность билда читается |
| 3:15-4:00 | Level 7-8 | Fallen Queen warning или corruption surge | Big spike cards начинают решать |
| 4:00-5:00 | Level 8-10 | Boss или final survival wave | Забег приходит к win/lose payoff |

## Таблица Баланса

### Player And World

| Config Key | Value |
| --- | --- |
| visibleViewportSize | 15x15 |
| spawnRingChebyshevMin | 9 клеток от короля |
| spawnRingChebyshevMax | 11 клеток от короля |
| activeWeaponCap | 4 |
| playerMaxHp | 100 |
| playerStartHp | 100 |
| playerMoveStepCooldown | 0.16s |
| postHitInvulnerability | 0.85s |
| pickupRadius | 1.35 клетки |

### XP Curve

Использовать XP, требуемый от текущего уровня до следующего:

| Current Level | XP To Next | Expected Timing |
| --- | --- | --- |
| 1 | 6 | Level 2 за 20-35s |
| 2 | 8 | Level 3 за 45-65s |
| 3 | 11 | Level 4 за 75-100s |
| 4 | 15 | Level 5 около 2:00 |
| 5 | 18 | Level 6 около 2:30 |
| 6 | 22 | Level 7 около 3:10 |
| 7 | 26 | Level 8 около 3:50 |
| 8 | 30 | Level 9 около 4:30 |
| 9 | 34 | Level 10 около 5:00 |

### Enemy Starter Values

| Enemy | HP | Contact Damage | XP | Move Cadence | First Appears |
| --- | --- | --- | --- | --- | --- |
| Corrupted Pawn | 10 | 18 | 1 | 0.95s per step | 0:00 |
| Rotten Rook | 42 | 28 | 3 | 1.35s per step | 1:05 |
| Mad Knight | 18 | 24 | 2 | 1.15s per step, jump every 3.2s | 1:25 |
| Blind Bishop | 24 | 24 | 2 | 1.25s per step, diagonal telegraph | 2:15 |
| Fallen Queen | 260 | 35 | 0 | Boss behavior | 3:15 |

### Spawn Curve

| Время | Spawn Rule |
| --- | --- |
| 0:00-0:30 | 1 pawn каждые 1.45s |
| 0:30-1:00 | 1-2 pawns каждые 1.25s |
| 1:00-1:30 | 2 pawns каждые 1.15s, 1 rook каждые 9s |
| 1:30-2:15 | 2-3 pawns каждые 1.05s, 1 knight каждые 8s, 1 rook каждые 10s |
| 2:15-3:15 | 3 pawns каждые 0.95s, mixed elite каждые 6-8s |
| 3:15-5:00 | Boss или final wave; снизить normal spawns на 25%, пока boss active |

### Weapon Base Values

| Weapon | Cooldown | Damage | Range | Role |
| --- | --- | --- | --- | --- |
| Pawn Strike | 1.15s | 10 | 2 вперед | Starter DPS |
| Knight Pulse | 2.40s | 14 | 8 knight offsets | Surround coverage |
| Bishop Ray | 3.00s | 13 | 5 diagonal | Line clear |
| Rook Charge | 3.20s | 15 | 4 cardinal | Lane clear и knockback |
| Queen's Decree | 8.00s | 26 | 7 в 8 направлениях | Rare burst |
| King's Aura | 0.75s | 5 | Radius 1 ring | Defensive close range |

### Rarity Weights After Level 4

| Rarity | Weight | Notes |
| --- | --- | --- |
| Common weapon level | 45 | Highest priority, если owned weapons не maxed |
| Common stat | 25 | Сильные, stack-limited |
| New weapon | 20 | Только пока active weapon count ниже cap |
| Rare mutation | 10 | Только если prerequisite выполнен |

## Правила Моментального Фана В Первые 30 Секунд

- Первую волну pawns спавнить в течение 1 секунды после Start Run.
- Первые XP shards должны собираться без дальнего backtracking.
- Pawn Strike должен one-shot Corrupted Pawns на level 1.
- Первый level-up должен требовать 6 XP, не больше.
- Первый level-up offer должен включать минимум две attack-pattern cards.
- После выбора Knight Pulse или King's Aura оружие должно сработать почти сразу.
- Не показывать Queen's Decree в первом offer; оно лучше работает как
  aspirational rare позже.

## Cuts If Time Runs Short

Резать в таком порядке:

1. Постоянная meta progression. Оставить только best run records.
2. Rare mutations кроме Queen's Favor, Royal Tempo, Castle Skin, Royal Magnet.
3. Queen's Decree levels 2-4. Оставить его как одну rare ultimate card.
4. Level 4 effects для оружий. Зарелизить каждое оружие с 3 уровнями.
5. Blind Bishop enemy и diagonal burn spread.
6. Dynamic weighted generation. Захардкодить первые три level-up offers, затем
   использовать простой random eligible cards.

Не резать:

- Timing первого level-up.
- Выбор 1 из 3 карт.
- Минимум 4 оружия: Pawn Strike, Knight Pulse, Bishop Ray, Rook Charge.
- Мгновенный cooldown reset после выбора weapon card.
