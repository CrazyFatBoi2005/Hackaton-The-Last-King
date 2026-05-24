# Prompt 4 - Meta Progression / Weapons / Classes Agent

Скопируй этот промпт в новый диалог с агентом.

```text
Ты работаешь в workspace: C:\Programming\hackaton.

Контекст проекта:
- Игра называется Chess Survivors.
- Это Vampire Survivors + шахматы.
- Игрок управляет королем на бесконечной шахматной доске.
- Основная зависимость: автоматические атаки шахматных фигур + level-up выборы.
- Главный документ: C:\Programming\hackaton\docs\gamedesigndoc.md.

Твоя зона ответственности:
1. Прописать meta progression и build system.
2. Сформировать виды оружия.
3. Сформировать классы/архетипы билдов.
4. Дать балансные стартовые числа, которые можно сразу положить в config.
5. Сделать так, чтобы игрок быстро получал кайф в первые 30 секунд.

Не твоя зона:
- game loop implementation;
- rendering;
- audio;
- asset search;
- deployment.

Core weapons:
- Pawn Strike;
- Knight Pulse;
- Bishop Ray;
- Rook Charge;
- Queen's Decree;
- King's Aura.

Что нужно спроектировать:
1. Для каждого оружия:
   - fantasy;
   - pattern;
   - cooldown;
   - damage;
   - range;
   - scaling;
   - upgrades by level;
   - visual/readability note.
2. Для upgrade cards:
   - common upgrades;
   - rare upgrades;
   - stat upgrades;
   - unlock rules;
   - 3-card generation rules.
3. Для классов/архетипов:
   - 4-6 build archetypes;
   - пример: Knight Tempo, Bishop Laser, Rook Fortress, Queen Storm, Pawn Swarm, Royal Tank;
   - какие оружия и статы собираются в каждый класс;
   - какой стиль игры дает каждый класс.
4. Для balance:
   - первые 3 level-up должны быть быстрыми и вкусными;
   - первый level-up в 20-35 секунд;
   - игрок должен почувствовать power spike сразу после выбора;
   - не делать 30 мелких апгрейдов, если 12 сильных лучше.

Важно:
- Не пиши огромную RPG-систему.
- Все должно быть реализуемо за хакатон.
- Лучше 6 оружий с понятными 3-5 уровнями, чем 20 слабых вариантов.
- Шахматы здесь являются языком паттернов, а не строгой шахматной симуляцией.
- Учитывай бесконечную карту: оружия должны помогать против врагов со всех сторон, а не только в фиксированной арене.

Ожидаемый результат:
1. Создай файл:
   C:\Programming\hackaton\docs\design\meta-progression.md
2. Если проект уже создан и есть `src/game`, можно дополнительно создать data-only файл:
   C:\Programming\hackaton\src\game\progressionData.ts
   Но не делай этого, если структура проекта еще не выбрана.

В meta-progression.md опиши:
- weapon catalog;
- upgrade catalog;
- class/build archetypes;
- card generation rules;
- starter build recommendation;
- first 5 minutes progression curve;
- balance table;
- cuts if time runs short.

Если создаешь progressionData.ts, он должен быть data-only:
- без React;
- без рендера;
- без engine loop;
- только typed config объектов, которые game loop сможет импортировать.

Критерий успеха:
- Основной агент может взять твой документ и сразу собрать upgrade system.
- В игре появляются понятные билды, а не случайный набор апгрейдов.
- Первый забег быстро дает игроку ощущение роста силы.
```

