<template>
  <div class="min-h-screen pt-4 pb-20 px-4 md:px-8">
    <div class="container mx-auto max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl font-bold text-primary mb-4 font-serif">道境 · 数字艺术画廊</h1>
        <p class="text-lg text-gray-600 italic">
          "大象无形" —— AI 绘出的道家意境
        </p>
      </div>

      <!-- Generator Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-secondary/20 relative overflow-hidden animate-slide-up">
        <!-- Background Decor -->
        <div class="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
          <i class="fas fa-paint-brush text-9xl"></i>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Controls Panel -->
          <div class="lg:col-span-1">
            <h2 class="text-2xl font-bold text-primary mb-4 font-serif">创作您的道境画作</h2>
            <p class="text-gray-600 mb-6">
              选择经文、风格和参数，让 AI 为您生成独一无二的道家意境图。
            </p>
            
            <div class="space-y-6">
              <!-- 经文选择 -->
              <div>
                <label class="block text-sm font-bold text-dark mb-2">灵感经文</label>
                <div class="relative">
                  <select 
                    v-model="selectedQuote" 
                    class="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 focus:border-primary focus:outline-none appearance-none bg-light/50"
                  >
                    <option value="" disabled selected>请选择灵感经文...</option>
                    <option v-for="quote in quotes" :key="quote.id" :value="quote.text">
                      {{ quote.chapter }} - {{ quote.text }}
                    </option>
                  </select>
                  <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <i class="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <!-- 风格选择 -->
              <div>
                <label class="block text-sm font-bold text-dark mb-2">艺术风格</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    v-for="style in styles" 
                    :key="style.id"
                    @click="selectedStyle = style.id"
                    class="p-3 rounded-lg border transition-all text-sm font-bold flex flex-col items-center justify-center gap-2"
                    :class="selectedStyle === style.id ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-gray-500 hover:border-primary/50'"
                  >
                    <i :class="style.icon"></i>
                    {{ style.name }}
                  </button>
                </div>
              </div>

              <!-- 尺寸和质量 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-dark mb-2">画布尺寸</label>
                  <div class="space-y-2">
                    <button 
                      v-for="size in sizes" 
                      :key="size.id"
                      @click="selectedSize = size.id"
                      class="w-full p-2 rounded border transition-all text-xs flex items-center justify-center gap-1"
                      :class="selectedSize === size.id ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-500 hover:border-primary/50'"
                    >
                      <i :class="size.icon"></i>
                      {{ size.name }}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-dark mb-2">画质等级</label>
                  <div class="space-y-2">
                    <button 
                      v-for="quality in qualities" 
                      :key="quality.id"
                      @click="selectedQuality = quality.id"
                      class="w-full p-2 rounded border transition-all text-xs flex items-center justify-center gap-1"
                      :class="selectedQuality === quality.id ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-500 hover:border-primary/50'"
                    >
                      <i :class="quality.icon"></i>
                      {{ quality.name }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 生成按钮 -->
              <button 
                @click="generateArt"
                :disabled="!selectedQuote || isGenerating"
                class="w-full py-4 bg-primary text-white text-lg font-bold rounded-full shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 flex items-center justify-center"
              >
                <span v-if="isGenerating">
                  <i class="fas fa-spinner fa-spin mr-2"></i> 正在泼墨挥毫...
                </span>
                <span v-else>
                  <i class="fas fa-magic mr-2"></i> 生成画作
                </span>
              </button>
            </div>
          </div>

          <!-- Preview Area -->
          <div class="lg:col-span-2">
            <div class="h-96 bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-300">
              <div v-if="!generatedImage" class="text-center text-gray-400">
                <i class="fas fa-image text-6xl mb-4 opacity-50"></i>
                <p class="text-lg">画作将在此处显现</p>
                <p class="text-sm mt-2">选择经文开始创作</p>
              </div>
              
              <div v-else class="w-full h-full relative">
                <img 
                  :src="generatedImage" 
                  alt="Generated Art" 
                  class="w-full h-full object-cover animate-fade-in"
                />
                
                <!-- 生成信息 -->
                <div class="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-palette"></i>
                    <span>{{ styles.find(s => s.id === currentResult.style)?.name }}</span>
                  </div>
                </div>
                
                <!-- Actions Overlay -->
                <div class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button @click="downloadImage" class="p-4 bg-white rounded-full text-primary hover:bg-gray-100 shadow-lg" title="下载高清图">
                    <i class="fas fa-download text-xl"></i>
                  </button>
                  <button @click="shareImage" class="p-4 bg-white rounded-full text-primary hover:bg-gray-100 shadow-lg" title="分享作品">
                    <i class="fas fa-share-alt text-xl"></i>
                  </button>
                  <button @click="regenerateSamePrompt" class="p-4 bg-white rounded-full text-primary hover:bg-gray-100 shadow-lg" title="重新生成">
                    <i class="fas fa-redo text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 历史记录 -->
            <div v-if="generationHistory.length > 0" class="mt-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-bold text-dark">生成历史</h3>
                <button @click="clearHistory" class="text-sm text-gray-500 hover:text-red-500">
                  <i class="fas fa-trash mr-1"></i>清除历史
                </button>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div 
                  v-for="(item, index) in generationHistory.slice(0, 4)" 
                  :key="item.id"
                  @click="generatedImage = item.imageUrl; currentResult = item"
                  class="aspect-square bg-gray-200 rounded cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
                  :class="{ 'ring-2 ring-primary': generatedImage === item.imageUrl }"
                >
                  <img :src="item.imageUrl" :alt="item.prompt" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <h2 class="text-2xl font-bold text-primary mb-6 font-serif pl-4 border-l-4 border-accent">社区佳作</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="art in gallery" 
          :key="art.id"
          class="relative group rounded-lg overflow-hidden shadow-md cursor-pointer"
        >
          <img :src="art.url" :alt="art.title" class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p class="text-white font-bold text-sm">{{ art.title }}</p>
            <p class="text-white/70 text-xs">by {{ art.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { imageGenerator, type GenerationResult } from '@/utils/imageGenerator'

// 状态管理
const isGenerating = ref(false)
const selectedQuote = ref('')
const selectedStyle = ref('ink')
const selectedSize = ref('square')
const selectedQuality = ref('standard')
const generatedImage = ref('')
const generationHistory = ref<GenerationResult[]>([])
const showHistory = ref(false)

// 当前生成结果
const currentResult = reactive({
  prompt: '',
  style: '',
  timestamp: null as Date | null,
  metadata: null as any
})

// 经文库
const quotes = [
  { id: 1, chapter: '第一章', text: '道可道，非常道' },
  { id: 2, chapter: '第八章', text: '上善若水' },
  { id: 3, chapter: '第十二章', text: '五色令人目盲' },
  { id: 4, chapter: '第二十五章', text: '人法地，地法天，天法道，道法自然' },
  { id: 5, chapter: '第四十二章', text: '道生一，一生二，二生三，三生万物' }
]

// 风格库
const styles = imageGenerator.getAllStyles()

// 尺寸选项
const sizes = [
  { id: 'square', name: '正方形', icon: 'fas fa-square' },
  { id: 'landscape', name: '横版', icon: 'fas fa-rectangle-wide' },
  { id: 'portrait', name: '竖版', icon: 'fas fa-rectangle-portrait' }
]

// 质量选项
const qualities = [
  { id: 'standard', name: '标准', icon: 'fas fa-battery-half' },
  { id: 'high', name: '高清', icon: 'fas fa-battery-three-quarters' },
  { id: 'ultra', name: '超清', icon: 'fas fa-battery-full' }
]

// 社区画廊
const gallery = [
  { id: 1, title: '混沌初开', author: 'DaoMaster_01', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop' },
  { id: 2, title: '上善若水', author: 'WaterFlow', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
  { id: 3, title: '万物负阴抱阳', author: 'YinYang', url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&h=400&fit=crop' },
  { id: 4, title: '致虚守静', author: 'ZenMind', url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400&h=400&fit=crop' }
]

// 生命周期
onMounted(() => {
  loadGenerationHistory()
})

// 生成画作
const generateArt = async () => {
  if (!selectedQuote.value) return
  
  isGenerating.value = true
  
  try {
    const config = {
      prompt: selectedQuote.value,
      style: selectedStyle.value as any,
      size: selectedSize.value as any,
      quality: selectedQuality.value as any
    }
    
    const result = await imageGenerator.generateImage(config)
    
    // 更新状态
    generatedImage.value = result.imageUrl
    currentResult.prompt = result.prompt
    currentResult.style = result.style
    currentResult.timestamp = result.timestamp
    currentResult.metadata = result.metadata
    
    // 重新加载历史记录
    loadGenerationHistory()
    
  } catch (error) {
    console.error('生成图片失败:', error)
    // 这里可以添加错误提示
  } finally {
    isGenerating.value = false
  }
}

// 下载图片
const downloadImage = () => {
  if (!generatedImage.value) return
  
  const link = document.createElement('a')
  link.href = generatedImage.value
  link.download = `道境_${currentResult.prompt}_${Date.now()}.jpg`
  link.click()
}

// 分享图片
const shareImage = async () => {
  if (!generatedImage.value) return
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: `道境 · ${currentResult.prompt}`,
        text: `我使用道德经平台生成了"${currentResult.prompt}"的意境图`,
        url: window.location.href
      })
    } else {
      // 复制链接到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  } catch (error) {
    console.log('分享取消或失败')
  }
}

// 加载生成历史
const loadGenerationHistory = () => {
  generationHistory.value = imageGenerator.getGenerationHistory()
}

// 清除历史记录
const clearHistory = () => {
  if (confirm('确定要清除所有生成历史吗？')) {
    imageGenerator.clearGenerationHistory()
    loadGenerationHistory()
  }
}

// 重新生成相同提示词
const regenerateSamePrompt = () => {
  if (selectedQuote.value) {
    generateArt()
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Zen Mode Support */
:global(html.zen-mode) .bg-white {
  background-color: #2c2c2e;
  border-color: #3f3f46;
}

:global(html.zen-mode) .text-primary {
  color: #d4b483;
}

:global(html.zen-mode) .text-dark {
  color: #d1d5db;
}

:global(html.zen-mode) .bg-gray-100 {
  background-color: #3f3f46;
  border-color: #52525b;
}

:global(html.zen-mode) .text-gray-600 {
  color: #9ca3af;
}

:global(html.zen-mode) select {
  background-color: #1c1c1e;
  border-color: #3f3f46;
  color: #d4b483;
}
</style>
