# Prompt 3 - Music / SFX Agent

Скопируй этот промпт в новый диалог с агентом.

```text
Ты работаешь в workspace: C:\Programming\hackaton.

Контекст проекта:
- Игра называется Chess Survivors.
- Это Vampire Survivors + шахматы.
- Игрок управляет королем на неограниченной corrupted chessboard.
- Игра должна цеплять за первые 30 секунд.
- Главный документ: C:\Programming\hackaton\docs\gamedesigndoc.md.

Твоя зона ответственности:
1. Найти бесплатную музыку и звуковые эффекты.
2. Проверить лицензии и требования атрибуции.
3. Подобрать короткий аудио-набор, который реально можно встроить за хакатон.
4. Подготовить структуру файлов и credits.

Нужные звуки:
- background music loop: dark royal fantasy, tense, loopable, не слишком агрессивная;
- UI click/select;
- king move;
- king hit;
- enemy hit;
- enemy death;
- XP pickup;
- level-up;
- weapon proc или attack whoosh;
- boss warning;
- game over;
- victory.

Источники можно искать среди:
- OpenGameArt;
- Kenney;
- Pixabay Music/Sound Effects;
- Freesound, только если лицензия подходит;
- Mixkit;
- itch.io asset packs с явной free license;
- другие источники, но только с понятной лицензией.

Правила лицензий:
- Предпочтительно CC0, public domain, MIT-like, или free for commercial use без сложной атрибуции.
- CC BY допустимо только если ты явно записал attribution text.
- Не использовать assets, где лицензия неясна.
- Не использовать copyrighted музыку, ремиксы, саундтреки из игр/фильмов, YouTube ripped audio.
- Для каждого файла укажи источник, лицензию, автора и attribution requirement.

Важно:
- Не занимайся game loop, графикой или балансом.
- Не добавляй тяжелые аудио-файлы без необходимости.
- Цель не собрать огромную библиотеку, а выбрать 1 музыку + 8-12 SFX, которые усиливают игру.
- Если нельзя безопасно скачать файлы, сделай research doc с прямыми ссылками и лицензиями.

Ожидаемый результат:
1. Создай файл:
   C:\Programming\hackaton\docs\audio\audio-plan.md
2. Создай файл:
   C:\Programming\hackaton\docs\audio\audio-credits.md
3. Если скачиваешь аудио, складывай в:
   C:\Programming\hackaton\public\audio
4. Если проект уже создан, можешь предложить простой audio manager API, но не внедряй его без необходимости.

В audio-plan.md опиши:
- выбранный mood;
- список нужных событий;
- какой звук на какое событие;
- рекомендуемая громкость;
- loop strategy для музыки;
- fallback, если аудио не успеют подключить.

В audio-credits.md опиши:
- file path;
- title;
- author;
- source URL;
- license;
- attribution text.

Критерий успеха:
- У основного агента есть безопасный, легальный и короткий набор аудио.
- Звуки усиливают game feel, но не мешают быстрым итерациям.
```

