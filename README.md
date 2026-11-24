# groupEventsByDay: RED → GREEN

`groupEventsByDay(events, timeZone = 'Europe/Kyiv')` групує події `{ id, date }`
за календарними днями заданого часового поясу. Результат — об’єкт із ключами
`YYYY-MM-DD` та масивами початкових подій. Порожній масив дає `{}`;
некоректна дата спричиняє `RangeError`.

## Структура та технології

- `src/groupEventsByDay.ts` — типи та реалізація через `Date` і `Intl.DateTimeFormat`.
- `tests/groupEventsByDay.test.ts` — 6 тестів: порожній масив, одна подія,
  кілька подій одного дня, різні дні, межа опівночі в `Europe/Kyiv` і пояс `UTC`, некоректна дата.
- `package.json` — команди та залежності; `tsconfig.json` — сувора перевірка TypeScript, ES2022, ES-модулі.

Фактичне середовище перевірки 24.11.2026: **Node.js v24.15.0** (`node --version`).
Версії в `package.json` збігаються зі встановленими: TypeScript **7.0.2**,
Vitest **5.1.1**, `@types/node` **26.6.6**.

## Встановлення та перевірка

У корені репозиторію (Node.js, npm і Git мають бути доступні в терміналі):

```sh
npm install
npm test
npm run typecheck
```

Lock-файла в репозиторії немає, тому використано `npm install`, а не `npm ci`;
версії транзитивних залежностей не зафіксовані.

## Відтворення RED → GREEN

**RED** — коміт `3dc809eebea94bcebf26b89ec3106d8d8a70d1c6` (`failin`).
Усі 6 тестів уже написані, але функція завжди повертає `{}`.
Фактично отримано: **5 failed | 1 passed (6)**, **1 failed (1)** файл тестів,
код завершення **1**. Проходить лише перевірка порожнього масиву.

```sh
git switch --detach 3dc809eebea94bcebf26b89ec3106d8d8a70d1c6
npm install
npm test
```

**GREEN** — коміт `7f39ad5147f1a87e66a23a8efad79d473d63b754` (`GREEN`).
Додано перевірку дати, визначення дня в заданому часовому поясі та накопичення
подій за ключем. Між RED і GREEN змінено тільки `src/groupEventsByDay.ts`;
тести та `package.json` ідентичні.
Фактично отримано: **6 passed (6)**, **1 passed (1)** файл тестів,
код завершення **0**; `npm run typecheck` також завершився з кодом **0**.

```sh
git switch --detach 7f39ad5147f1a87e66a23a8efad79d473d63b754
npm test
npm run typecheck
```

Повернення до актуальної гілки проєкту:

```sh
git switch master
```

Результати повторно перевірено 24.11.2026: GREEN — через `npm test`,
RED — з архіву відповідного коміту в окремому каталозі через
`npm test -- --root .red-verification`, зі встановленими залежностями проєкту.
Початковий запуск у sandbox завершився `spawn EPERM`; наведені результати
отримано після дозволу на запуск процесів Vitest поза sandbox.

## Перевірка пакета та методів групування

Команда `npm view date-utils-ultra` 24.11.2026 завершилася з кодом **1**.
Фактичний фрагмент відповіді реєстру npm:

```text
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/date-utils-ultra - Not found
npm error 404
npm error 404  The requested resource 'date-utils-ultra@*' could not be found or you do not have permission to access it.
```

Пакет недоступний у публічному реєстрі за цим запитом і не використовується
в реалізації. Початкова спроба в sandbox дала `ENOTCACHED`; відповідь `E404`
отримано повторним запитом із доступом до мережі.

Перевірка в Node.js v24.15.0:

```sh
node -e "console.log('Node.js:', process.version); for (const [name, value] of [['Array.prototype.groupBy', Array.prototype.groupBy], ['Object.groupBy', Object.groupBy], ['Map.groupBy', Map.groupBy]]) console.log(name + ': ' + typeof value)"
```

Фактичний вивід:

```text
Node.js: v24.15.0
Array.prototype.groupBy: undefined
Object.groupBy: function
Map.groupBy: function
```

## Скріншоти

Скріншотів результатів тестування в репозиторії та його наявній історії Git
не знайдено. Доказами слугують наведені коміти й повторювані запуски тестів.
