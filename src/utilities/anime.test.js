import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderingAnime } from './anime'
import anime from 'animejs'

// 模拟animejs库
vi.mock('animejs', () => {
  return {
    default: vi.fn()
  }
})

describe('anime.js 工具函数', () => {
  beforeEach(() => {
    // 重置模拟
    vi.resetAllMocks()
    
    // 创建模拟DOM元素
    document.body.innerHTML = `
      <div class="renderIn beforeRenderIn"></div>
      <div class="renderIn beforeRenderIn"></div>
    `
  })

  it('renderingAnime应该正确调用anime函数', () => {
    // 调用函数
    renderingAnime()
    
    // 验证anime被调用
    expect(anime).toHaveBeenCalledTimes(1)
    
    // 验证调用参数
    expect(anime).toHaveBeenCalledWith(expect.objectContaining({
      targets: '.renderIn',
      easing: 'easeInOutExpo',
      duration: 1500,
    }))
  })

  it('动画开始时应该移除beforeRenderIn类', () => {
    // 模拟anime的行为
    anime.mockImplementation(({ begin }) => {
      if (begin) {
        // 创建模拟的animatables数组
        const animatables = [
          { target: document.querySelector('.renderIn') },
          { target: document.querySelector('.renderIn:nth-child(2)') }
        ]
        
        // 调用begin回调
        begin({ animatables })
      }
    })
    
    // 调用函数
    renderingAnime()
    
    // 验证类被移除
    const elements = document.querySelectorAll('.renderIn')
    elements.forEach(el => {
      expect(el.classList.contains('beforeRenderIn')).toBe(false)
    })
  })
})
