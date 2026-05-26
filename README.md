# MStroy Frontend
<img width="1860" height="346" alt="image" src="https://github.com/user-attachments/assets/34417b1e-c074-4d93-b079-02e97177260e" />


## Быстрый старт

```bash
npm install
npm run dev
npm run build
npm run test
```

## Стек

- Vue 3 + TypeScript (strict)
- AG Grid Enterprise (RowGroupingModule + TreeDataModule)
- Quasar (только layout)
- Vite 8, Vitest

## Структура

```
src/
  TreeStore.ts              — класс-хранилище дерева
  types.ts                  — Id, TreeItem
  components/TreeTable.vue  — таблица на AG Grid
  data/sampleData.ts        — тестовые данные
tests/
  TreeStore.test.ts         — 24 теста хранилища
  components/TreeTable.test.ts — 2 теста компонента
```

## TreeStore API

| Метод                | Описание                   |
| -------------------- | -------------------------- |
| `getAll()`           | Все элементы               |
| `getItem(id)`        | Элемент по id              |
| `getChildren(id)`    | Прямые потомки             |
| `getAllChildren(id)` | Все потомки                |
| `getAllParents(id)`  | Цепочка до корня           |
| `addItem(item)`      | Добавить элемент           |
| `removeItem(id)`     | Удалить с потомками        |
| `updateItem(item)`   | Обновить                   |

