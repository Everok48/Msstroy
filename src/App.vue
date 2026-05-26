<script setup lang="ts">
import TreeTable from './components/TreeTable.vue'
</script>

<template>
  <q-layout view="hHh Lpr lFf" class="app-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>MStroy</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="page-content">
        <TreeTable />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.app-layout {
  height: 100%;
}

.page-content {
  padding: 16px;
  height: calc(100vh - 50px);
  box-sizing: border-box;
}
</style>
