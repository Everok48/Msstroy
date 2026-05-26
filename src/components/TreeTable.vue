<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { ModuleRegistry, ClientSideRowModelModule, ValidationModule } from 'ag-grid-community';
import type { ColDef, ValueGetterParams, GetRowIdParams } from 'ag-grid-community';
import { RowGroupingModule, TreeDataModule } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { TreeItem } from '../types';
import { TreeStore } from '../TreeStore';
import { sampleData } from '../data/sampleData';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  TreeDataModule,
  ...(import.meta.env.DEV ? [ValidationModule] : []),
]);

const store = new TreeStore(sampleData);

type RowData = TreeItem & { path: string[] };

const rowData = shallowRef<RowData[]>([]);

function computePath(item: TreeItem): string[] {
  const path: string[] = [];
  let current: TreeItem | undefined = item;
  while (current) {
    path.unshift(current.label);
    current = current.parent != null ? store.getItem(current.parent) : undefined;
  }
  return path;
}

/** Посчитать категорию: Группа / Элемент */
function resolveCategory(item: TreeItem): string {
  return store.getChildren(item.id).length > 0 ? 'Группа' : 'Элемент';
}

function refreshData(): void {
  rowData.value = store.getAll().map((item) => ({
    ...item,
    path: computePath(item),
  }));
}

refreshData();

const getDataPath = (data: RowData) => data.path;

const columnDefs = computed<ColDef[]>(() => [
  {
    headerName: '№ п/п',
    valueGetter: (p: ValueGetterParams) => (p.node?.rowIndex ?? 0) + 1,
    width: 80,
    sortable: false,
  },
  {
    headerName: 'Категория',
    showRowGroup: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: any) => resolveCategory(params.data as RowData),
      suppressCount: true,
    },
    flex: 1,
    sortable: false,
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    sortable: false,
  },
]);

const defaultColDef: ColDef = {
  resizable: true,
};

function getRowId(params: GetRowIdParams): string {
  return String(params.data.id);
}
</script>

<template>
  <div class="ag-theme-alpine grid-wrapper">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :treeData="true"
      :treeDataDisplayType="'custom'"
      :getDataPath="getDataPath"
      :getRowId="getRowId"
      :groupDefaultExpanded="-1"
      :animateRows="true"
      :suppressRowHoverHighlight="true"
    />
  </div>
</template>

<style scoped>
.grid-wrapper {
  height: 100%;
  min-height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
:deep(.ag-row-odd) {
  background-color: #ffffff;
}
:deep(.ag-row-even) {
  background-color: #f5f5f5;
}
:deep(.ag-header-cell) {
  font-weight: 600;
  color: #333;
}
</style>
