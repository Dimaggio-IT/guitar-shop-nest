# Guitar-shop

Учебный проект студента HTML Academy. Грейдирование.

## Как пользоваться репозиторием

1. Можно посмотреть список коммитов. С помощью команды `git log --oneline`. Коммиты идут сверху вниз от новых к старым, выглядит это примерно вот так:

    ```bash
    c0ea9d8 1.2 Создаст функцию для генерации разметки меню WIP
    1a34516 1.1 Подключит скрипт `src/main.js` к `public/index.html`
    45f1ffe :hatching_chick: начальное состояние проекта

2. Чтобы встать на нужный коммит воспользуйтесь командой `git checkout хэш_коммита`. Например, вот так `git checkout c0ea9d8`.

3. Чтобы вернуться на мастер-ветку обратно, используйте команду `git checkout master`.

> **Будьте внимательны**, если вы внесёте изменения в момент, когда изучаете коммиты, при попытке вернуться обратно, Git потребует от вас либо откатить изменения, либо закоммитить их. Пока вы не сделаете это, вернуться на master-ветку у вас не выйдет.

### Условные обозначения

- Приписка `WIP` в названии коммита означает, что код в этом коммите может частично или полностью не работать, вызывать ошибки линтера, ломать сборку (`npm run build`) или не запускаться в режиме разработки (`npm run start`). Это нормально, потому что `WIP` — это аббревиатура `Work In Progress`, что дословно означает «работа в процессе». То есть такой коммит отражает некое промежуточное состояние нашего проекта.
- Номер коммита `A. [B. ]C` расшифровывается, если не оговорено другое, следующим образом:
  - `A.` — номер модуля;
  - `[B. ]` — номер части домашнего задания. Квадратные скобки означают опциональность, потому что не все домашние задания даются в двух частях;
  - `C.` — порядковый номер. Исключительно для удобства.

