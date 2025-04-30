import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from './ThemeToggle.vue'

// 模拟localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// 模拟document.documentElement
const documentElementMock = {
  setAttribute: vi.fn(),
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    // 重置模拟
    vi.resetAllMocks()
    
    // 设置模拟
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    Object.defineProperty(document, 'documentElement', { value: documentElementMock })
  })

  it('初始化时应该根据localStorage设置主题', async () => {
    // 设置localStorage返回值
    localStorageMock.getItem.mockReturnValue('light')
    
    const wrapper = mount(ThemeToggle)
    
    // 等待组件挂载后的异步操作完成
    await wrapper.vm.$nextTick()
    
    // 检查isDark的初始值是否正确
    expect(wrapper.vm.isDark).toBe(false)
  })

  it('切换主题时应该更新localStorage和文档属性', async () => {
    const wrapper = mount(ThemeToggle)
    
    // 模拟点击切换主题
    await wrapper.find('input[type="checkbox"]').setValue(true)
    
    // 检查是否调用了正确的方法
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'synthwave')
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'synthwave')
  })
})
