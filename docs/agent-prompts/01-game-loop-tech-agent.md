# Prompt 1 - Game Loop / Tech Foundation Agent

Скопируй этот промпт в новый диалог с агентом.

```text
Ты работаешь в workspace: C:\Programming\hackaton.

Контекст проекта:
- Игра называется Chess Survivors.
- Это Vampire Survivors + шахматы.
- Игрок управляет королем на неограниченной шахматной доске.
- Карта логически бесконечная: world coordinates `(x, y)`, камера/viewport следует за королем.
- Враги появляются кольцом вокруг видимой области.
- Атаки автоматические и основаны на шахматных паттернах: пешка, конь, слон, ладья, ферзь.
- Core loop: движение, враги, автоатаки, урон, цифры урона, XP, level-up, волны, смерть/retry.
- Главный документ: C:\Programming\hackaton\docs\gamedesigndoc.md.

Твоя зона ответственности:
1. Найти и оценить библиотеки/инструменты для game loop и технической основы.
2. Выбрать оптимальный стек под 5-часовой хакатон.
3. Учесть, что игре нужны:
   - неограниченная шахматная карта;
   - камера/viewport;
   - игрок-король;
   - grid movement;
   - враги и спавн вокруг viewport;
   - урон и invulnerability frames;
   - цифры урона;
   - автоатаки по cooldown;
   - collision/hit detection;
   - XP drops;
   - level-up pause;
   - game over/retry;
   - production build для деплоя.

Важно:
- Не начинай с предположения, что React DOM grid точно лучший вариант. После правки про бесконечную карту надо заново сравнить варианты.
- Рассмотри минимум эти подходы:
  - Phaser 3 + TypeScript;
  - PixiJS + custom game loop;
  - Vite React + DOM/CSS viewport;
  - Excalibur или Kaplay/Kaboom, если они реально помогают.
- Если используешь интернет, проверяй актуальную документацию и лицензии библиотек.
- Не занимайся финальной графикой, музыкой или балансом оружия. Для них будут отдельные агенты.
- Не добавляй backend, аккаунты, leaderboard или multiplayer.

Ожидаемый результат:
1. Создай файл:
   C:\Programming\hackaton\docs\technical\game-loop-tech-decision.md
2. В нем опиши:
   - краткое резюме решения;
   - сравнение библиотек;
   - выбранный стек;
   - почему он подходит для бесконечной шахматной карты;
   - какие модули нужно создать;
   - какие риски есть;
   - какие решения должны быть интерфейсами для других агентов.
3. Если проект еще не создан и решение очевидно, можно дополнительно создать минимальный scaffold, но только после записи tech decision.

Рекомендуемый формат tech decision:

# Game Loop Tech Decision

## Recommendation

## Evaluated Options

## Chosen Architecture

## Core Modules

## Data Contracts For Other Agents

## Damage Numbers Strategy

## Infinite Board / Camera Strategy

## Testing And Verification

## Risks And Cuts

Критерий успеха:
- После твоей работы основной агент понимает, на чем строить игру.
- Графический агент понимает, куда подключать рендер/ассеты.
- Meta progression агент понимает, в каком формате отдавать weapons/upgrades.
```

