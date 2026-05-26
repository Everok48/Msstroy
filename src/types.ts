export type Id = string | number;

/** Элемент дерева с полями id, parent и произвольными данными */
export interface TreeItem {
  id: Id;
  parent: Id | null;
  label: string;
  [key: string]: unknown;
}
