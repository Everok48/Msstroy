import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeTable from '../../src/components/TreeTable.vue'

describe('TreeTable', () => {
  it('рендерится без ошибок', () => {
    const wrapper = mount(TreeTable)
    expect(wrapper.exists()).toBe(true)
  })

  it('содержит AG Grid контейнер', () => {
    const wrapper = mount(TreeTable)
    expect(wrapper.find('.ag-theme-alpine').exists()).toBe(true)
  })
})
