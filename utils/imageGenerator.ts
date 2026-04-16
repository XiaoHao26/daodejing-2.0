/**
 * 图片生成服务
 * 提供统一的AI图片生成功能
 */

// 图片生成配置
export interface ImageGenerationConfig {
  prompt: string
  style: 'ink' | 'cyber' | 'abstract' | 'realistic' | 'minimalist'
  size: 'square' | 'landscape' | 'portrait'
  quality: 'standard' | 'high' | 'ultra'
}

// 生成结果
export interface GenerationResult {
  id: string
  imageUrl: string
  prompt: string
  style: string
  timestamp: Date
  metadata: {
    width: number
    height: number
    size: number
    format: string
  }
}

// 图片风格配置
const styleConfigs = {
  ink: {
    name: '传统水墨',
    description: '中国传统水墨画风格，强调意境和留白',
    keywords: ['水墨', '山水', '意境', '留白', '传统']
  },
  cyber: {
    name: '赛博修仙',
    description: '未来科技与传统修仙的融合风格',
    keywords: ['赛博', '未来', '科技', '修仙', '霓虹']
  },
  abstract: {
    name: '抽象写意',
    description: '抽象艺术风格，强调色彩和形式',
    keywords: ['抽象', '写意', '色彩', '形式', '现代']
  },
  realistic: {
    name: '写实主义',
    description: '高度写实的绘画风格',
    keywords: ['写实', '真实', '细节', '光影', '自然']
  },
  minimalist: {
    name: '极简主义',
    description: '简约风格，强调线条和空间',
    keywords: ['极简', '简约', '线条', '空间', '现代']
  }
}

// 经文与图片主题映射
const scriptureThemes = {
  '道可道，非常道': {
    themes: ['混沌', '宇宙', '本源', '无形', '大道'],
    colors: ['#2c3e50', '#34495e', '#7f8c8d']
  },
  '上善若水': {
    themes: ['水流', '柔和', '包容', '润泽', '谦下'],
    colors: ['#3498db', '#2980b9', '#1abc9c']
  },
  '五色令人目盲': {
    themes: ['简约', '朴素', '清净', '淡泊', '返璞'],
    colors: ['#bdc3c7', '#ecf0f1', '#95a5a6']
  },
  '人法地，地法天，天法道，道法自然': {
    themes: ['自然', '和谐', '规律', '天地', '宇宙'],
    colors: ['#27ae60', '#2ecc71', '#16a085']
  },
  '道生一，一生二，二生三，三生万物': {
    themes: ['创世', '演化', '万物', '阴阳', '太极'],
    colors: ['#9b59b6', '#8e44ad', '#3498db']
  }
}

// 模拟AI图片生成API
class ImageGenerator {
  private baseUrl = 'https://api.daodejing.ai/image'
  
  /**
   * 生成图片
   */
  async generateImage(config: ImageGenerationConfig): Promise<GenerationResult> {
    // 模拟API调用延迟
    await this.simulateDelay(2000 + Math.random() * 2000)
    
    // 构建增强的提示词
    const enhancedPrompt = this.enhancePrompt(config.prompt, config.style)
    
    // 模拟生成结果
    const result: GenerationResult = {
      id: this.generateId(),
      imageUrl: this.generateMockImageUrl(enhancedPrompt, config.style),
      prompt: config.prompt,
      style: config.style,
      timestamp: new Date(),
      metadata: {
        width: 1024,
        height: 1024,
        size: 1024 * 1024,
        format: 'jpg'
      }
    }
    
    // 保存生成记录到本地存储
    this.saveGenerationHistory(result)
    
    return result
  }
  
  /**
   * 获取生成历史
   */
  getGenerationHistory(): GenerationResult[] {
    try {
      const history = localStorage.getItem('image_generation_history')
      return history ? JSON.parse(history) : []
    } catch {
      return []
    }
  }
  
  /**
   * 清除生成历史
   */
  clearGenerationHistory(): void {
    localStorage.removeItem('image_generation_history')
  }
  
  /**
   * 获取风格配置
   */
  getStyleConfig(style: string) {
    return styleConfigs[style as keyof typeof styleConfigs]
  }
  
  /**
   * 获取所有可用风格
   */
  getAllStyles() {
    return Object.entries(styleConfigs).map(([id, config]) => ({
      id,
      ...config
    }))
  }
  
  /**
   * 增强提示词
   */
  private enhancePrompt(prompt: string, style: string): string {
    const styleConfig = this.getStyleConfig(style)
    const theme = scriptureThemes[prompt as keyof typeof scriptureThemes]
    
    let enhanced = prompt
    
    // 添加风格关键词
    if (styleConfig) {
      enhanced += `, ${styleConfig.keywords.join(', ')}`
    }
    
    // 添加主题关键词
    if (theme) {
      enhanced += `, ${theme.themes.join(', ')}`
    }
    
    // 添加质量描述
    enhanced += ', 高质量, 4K分辨率, 艺术创作'
    
    return enhanced
  }
  
  /**
   * 生成模拟图片URL
   */
  private generateMockImageUrl(prompt: string, style: string): string {
    // 使用稳定的图片库，确保相同提示词生成相同图片
    const promptHash = this.hashString(prompt)
    const baseImages = [
      'https://images.unsplash.com/photo-1541518763669-27fef04b14ea', // 水流
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // 山水
      'https://images.unsplash.com/photo-1579546929662-711aa81148cf', // 抽象
      'https://images.unsplash.com/photo-1550684376-efcbd6e3f031', // 自然
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab'  // 极简
    ]
    
    const index = promptHash % baseImages.length
    return `${baseImages[index]}?w=1024&h=1024&fit=crop&auto=format&q=80`
  }
  
  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * 字符串哈希
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
  
  /**
   * 模拟延迟
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * 保存生成历史
   */
  private saveGenerationHistory(result: GenerationResult): void {
    try {
      const history = this.getGenerationHistory()
      history.unshift(result)
      // 只保留最近20条记录
      const limitedHistory = history.slice(0, 20)
      localStorage.setItem('image_generation_history', JSON.stringify(limitedHistory))
    } catch (error) {
      console.warn('Failed to save generation history:', error)
    }
  }
}

// 创建单例实例
export const imageGenerator = new ImageGenerator()

// 导出类型
export type { ImageGenerationConfig, GenerationResult }