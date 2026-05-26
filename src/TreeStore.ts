import _ from 'lodash';
import type { Id, TreeItem } from './types';

/** Хранилище элементов дерева */
export class TreeStore<T extends TreeItem = TreeItem> {
  private _items: Map<Id, T>;
  private _childrenMap: Map<Id, T[]>;

  constructor(items: T[]) {
    this._items = new Map();
    this._childrenMap = new Map();
    this._build(items);
  }

  /** Заполнить индексы */
  private _build(items: T[]): void {
    _.forEach(items, (item) => this._items.set(item.id, item));
    _.forEach(items, (item) => {
      if (item.parent != null) this._addChild(item.parent, item);
    });
  }

  getAll(): T[] {
    return [...this._items.values()];
  }

  getItem(id: Id): T | undefined {
    return this._items.get(id);
  }

  getChildren(id: Id): T[] {
    return this._childrenMap.get(id) ?? [];
  }

  getAllChildren(id: Id): T[] {
    const result: T[] = [];
    const stack: T[] = [...(this._childrenMap.get(id) ?? [])];
    while (stack.length > 0) {
      const item = stack.pop()!;
      result.push(item);
      const children = this._childrenMap.get(item.id);
      if (children) {
        _.forEach(children, (child) => stack.push(child));
      }
    }
    return result;
  }

  /**
   * Цепочка от элемента до корня.
   * Порядок: [элемент, родитель, ..., корень]
   */
  getAllParents(id: Id): T[] {
    const result: T[] = [];
    let current = this._items.get(id);
    while (current) {
      result.push(current);
      current = current.parent != null ? this._items.get(current.parent) : undefined;
    }
    return result;
  }

  addItem(item: T): void {
    this._items.set(item.id, item);
    if (item.parent != null) this._addChild(item.parent, item);
  }

  removeItem(id: Id): void {
    const idsToRemove: Id[] = [];
    const stack = [id];
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      idsToRemove.push(currentId);
      const children = this._childrenMap.get(currentId);
      if (children) {
        _.forEach(children, (child) => stack.push(child.id));
      }
    }
    _.forEach(idsToRemove, (removeId) => {
      this._items.delete(removeId);
      this._childrenMap.delete(removeId);
    });
  }

  updateItem(updatedItem: T): void {
    const existing = this._items.get(updatedItem.id);
    if (!existing) return;
    if (existing.parent !== updatedItem.parent) {
      this._removeChild(existing.parent, existing);
      if (updatedItem.parent != null) {
        this._addChild(updatedItem.parent, updatedItem);
      }
    }
    if (existing === updatedItem) return;
    this._items.set(updatedItem.id, updatedItem);
  }

  private _addChild(parentId: Id, child: T): void {
    const siblings = this._childrenMap.get(parentId);
    if (siblings) {
      siblings.push(child);
    } else {
      this._childrenMap.set(parentId, [child]);
    }
  }

  private _removeChild(parentId: Id | null, child: T): void {
    if (parentId == null) return;
    const siblings = this._childrenMap.get(parentId);
    if (siblings) _.pull(siblings, child);
  }
}
