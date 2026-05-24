# Prompt 2 - Graphics / Render / Assets Agent

Скопируй этот промпт в новый диалог с агентом.

```text
Ты работаешь в workspace: C:\Programming\hackaton.

Контекст проекта:
- Игра называется Chess Survivors.
- Это Vampire Survivors + шахматы.
- Игрок управляет королем на неограниченной шахматной доске.
- Камера показывает viewport вокруг короля, но мир логически бесконечный.
- Главный документ: C:\Programming\hackaton\docs\gamedesigndoc.md.

Твоя зона ответственности:
1. Графика, рендер и визуальный стиль.
2. Поиск или подготовка ассетов.
3. Визуальная читаемость бесконечной шахматной карты.
4. Визуальные состояния:
   - король;
   - corrupted pawn;
   - rotten rook;
   - mad knight;
   - blind bishop, если успеваем;
   - fallen queen, если успеваем;
   - XP shards;
   - атаки Pawn/Knight/Bishop/Rook/Queen;
   - hit flash;
   - enemy death pop;
   - damage numbers;
   - level-up cards;
   - boss warning.

Стиль:
- dark royal fantasy;
- corrupted chess kingdom;
- доска должна быть чистой и читаемой;
- король всегда должен быть главным визуальным якорем;
- цвета: dark graphite, ivory, gold, crimson corruption, limited blue/violet magic;
- не превращай экран в фиолетовую кашу;
- не используй сложные декоративные фоны, которые мешают читать клетки.

Важно:
- Не трогай core game loop, баланс оружия, музыку и meta progression.
- Если проекта еще нет, создай только дизайн-док и asset plan.
- Если проект уже создан, работай только в рендерных компонентах, CSS, public/assets и визуальных конфигурациях.
- Все найденные ассеты должны быть бесплатными и легальными для публичного хакатонного деплоя.
- Для каждого ассета зафиксируй источник, лицензию и нужна ли атрибуция.
- Не используй ассеты из популярных коммерческих игр или copyrighted chess packs без явной лицензии.

Ожидаемый результат:
1. Создай файл:
   C:\Programming\hackaton\docs\graphics\art-direction.md
2. Создай файл:
   C:\Programming\hackaton\docs\graphics\asset-list.md
3. Если скачиваешь или создаешь ассеты, складывай их в:
   C:\Programming\hackaton\public\assets
4. Если проект уже создан, можешь добавить визуальные компоненты/стили, но не ломай game loop.

В art-direction.md опиши:
- визуальный стиль;
- palette tokens;
- как выглядит шахматная доска;
- как выглядят король и враги;
- как выглядят атаки;
- как выглядят XP, damage numbers, level-up и boss warning;
- правила читаемости.

В asset-list.md опиши:
- asset name;
- file path;
- source URL или generation note;
- license;
- attribution text, если нужен;
- где используется в игре.

Критерий успеха:
- Основной агент может быстро подключить ассеты.
- Игра будет выглядеть цельно уже в первые 30 секунд.
- Рендер не мешает читать клетку, врага, атаку и урон.
```

