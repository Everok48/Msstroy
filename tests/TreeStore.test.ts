import _ from 'lodash'
import { describe, it, expect } from 'vitest'
import { TreeStore } from '../src/TreeStore'
import type { TreeItem } from '../src/types'

function createSampleData(): TreeItem[] {
  return [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]
}

describe('TreeStore', () => {
  describe('constructor', () => {
    it('создаёт хранилище с переданными элементами', () => {
      const store = new TreeStore(createSampleData())
      expect(store.getAll()).toHaveLength(8)
    })

    it('принимает пустой массив', () => {
      const store = new TreeStore([])
      expect(store.getAll()).toEqual([])
    })
  })

  describe('getAll', () => {
    it('возвращает исходный массив', () => {
      const data = createSampleData()
      const store = new TreeStore(data)
      expect(store.getAll()).toEqual(data)
    })

    it('отражает изменения после addItem/removeItem', () => {
      const store = new TreeStore(createSampleData())
      store.addItem({ id: 100, parent: null, label: 'New' })
      expect(store.getAll()).toHaveLength(9)
      store.removeItem(100)
      expect(store.getAll()).toHaveLength(8)
    })
  })

  describe('getItem', () => {
    it('находит элемент по числовому id', () => {
      const store = new TreeStore(createSampleData())
      const item = store.getItem(1)
      expect(item).toEqual({ id: 1, parent: null, label: 'Айтем 1' })
    })

    it('находит элемент по строковому id', () => {
      const store = new TreeStore(createSampleData())
      const item = store.getItem('91064cee')
      expect(item).toBeDefined()
      expect(item!.label).toBe('Айтем 2')
    })

    it('возвращает undefined для несуществующего id', () => {
      const store = new TreeStore(createSampleData())
      expect(store.getItem(999)).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('возвращает прямых потомков элемента', () => {
      const store = new TreeStore(createSampleData())
      const children = store.getChildren(1)
      expect(children).toHaveLength(2)
      expect(_.map(children, 'id')).toContain('91064cee')
      expect(_.map(children, 'id')).toContain(3)
    })

    it('возвращает пустой массив для листового узла', () => {
      const store = new TreeStore(createSampleData())
      expect(store.getChildren(7)).toEqual([])
    })

    it('возвращает пустой массив для несуществующего id', () => {
      const store = new TreeStore(createSampleData())
      expect(store.getChildren(999)).toEqual([])
    })
  })

  describe('getAllChildren', () => {
    it('возвращает всех потомков включая вложенные уровни', () => {
      const store = new TreeStore(createSampleData())
      const all = store.getAllChildren(1)
      expect(all).toHaveLength(7)
    })

    it('находит потомков через несколько уровней вложенности', () => {
      const store = new TreeStore(createSampleData())
      const all = store.getAllChildren('91064cee')
      expect(all).toHaveLength(5)
      expect(_.map(all, 'id')).toContain(4)
      expect(_.map(all, 'id')).toContain(7)
    })

    it('возвращает пустой массив для листа', () => {
      const store = new TreeStore(createSampleData())
      expect(store.getAllChildren(7)).toEqual([])
    })
  })

  describe('getAllParents', () => {
    it('строит цепочку от элемента до корня', () => {
      const store = new TreeStore(createSampleData())
      const parents = store.getAllParents(7)
      expect(parents).toHaveLength(4)
      expect(parents[0].id).toBe(7)
      expect(parents[1].id).toBe(4)
      expect(parents[2].id).toBe('91064cee')
      expect(parents[3].id).toBe(1)
    })

    it('возвращает [корень] для корневого элемента', () => {
      const store = new TreeStore(createSampleData())
      const parents = store.getAllParents(1)
      expect(parents).toHaveLength(1)
      expect(parents[0].id).toBe(1)
    })
  })

  describe('addItem', () => {
    it('добавляет корневой элемент', () => {
      const store = new TreeStore(createSampleData())
      store.addItem({ id: 100, parent: null, label: 'New Root' })
      expect(store.getItem(100)).toBeDefined()
    })

    it('добавляет дочерний элемент', () => {
      const store = new TreeStore(createSampleData())
      store.addItem({ id: 200, parent: 1, label: 'New Child' })
      const children = store.getChildren(1)
      expect(children).toHaveLength(3)
      expect(_.find(children, { id: 200 })).toBeDefined()
    })
  })

  describe('removeItem', () => {
    it('удаляет элемент и всех его потомков', () => {
      const store = new TreeStore(createSampleData())
      store.removeItem('91064cee')
      expect(store.getItem('91064cee')).toBeUndefined()
      expect(store.getItem(4)).toBeUndefined()
      expect(store.getItem(7)).toBeUndefined()
      expect(store.getItem(1)).toBeDefined()
    })

    it('ничего не делает при удалении несуществующего id', () => {
      const store = new TreeStore(createSampleData())
      store.removeItem(999)
      expect(store.getAll()).toHaveLength(8)
    })
  })

  describe('updateItem', () => {
    it('обновляет поля элемента', () => {
      const store = new TreeStore(createSampleData())
      store.updateItem({ id: 1, parent: null, label: 'Обновлённый Айтем 1' })
      const item = store.getItem(1)
      expect(item!.label).toBe('Обновлённый Айтем 1')
    })

    it('перелинковывает потомков при смене parent', () => {
      const store = new TreeStore(createSampleData())
      store.updateItem({ id: 4, parent: 1, label: 'Айтем 4' })
      const childrenOf1 = store.getChildren(1)
      expect(_.find(childrenOf1, { id: 4 })).toBeDefined()
      const childrenOfRoot = store.getChildren('91064cee')
      expect(_.find(childrenOfRoot, { id: 4 })).toBeUndefined()
    })

    it('ничего не делает для несуществующего id', () => {
      const store = new TreeStore(createSampleData())
      store.updateItem({ id: 999, parent: null, label: 'Ghost' })
      expect(store.getAll()).toHaveLength(8)
    })
  })

  describe('смешанные типы id', () => {
    it('корректно работает с числовыми и строковыми id', () => {
      const data: TreeItem[] = [
        { id: 'root', parent: null, label: 'Root' },
        { id: 1, parent: 'root', label: 'Child 1' },
        { id: 'child2', parent: 'root', label: 'Child 2' },
      ]
      const store = new TreeStore(data)
      expect(store.getItem('root')).toBeDefined()
      expect(store.getItem(1)).toBeDefined()
      expect(store.getItem('child2')).toBeDefined()
      expect(store.getChildren('root')).toHaveLength(2)
    })
  })

  describe('производительность', () => {
    it('обрабатывает 10000 элементов без задержек', () => {
      const items: TreeItem[] = _.times(10000, (i) => ({
        id: i + 1,
        parent: i > 0 ? Math.floor((i + 1) / 2) : null,
        label: `Item ${i + 1}`,
      }))

      const start = performance.now()
      const store = new TreeStore(items)
      expect(performance.now() - start).toBeLessThan(500)

      const getStart = performance.now()
      store.getItem(5000)
      expect(performance.now() - getStart).toBeLessThan(1)

      const childrenStart = performance.now()
      store.getAllChildren(1)
      expect(performance.now() - childrenStart).toBeLessThan(5)
    })
  })
})
