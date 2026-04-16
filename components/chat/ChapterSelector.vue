<template>
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-primary mb-4">选择章节</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div 
        v-for="(chapter, index) in chapters" 
        :key="index"
        class="relative group"
      >
        <button 
          @click="sendChapterQuestion(chapter)"
          class="chapter-select w-full"
          :disabled="isLoading"
        >
          {{ chapter }}
        </button>
        
        <!-- 第八章图片生成按钮 -->
        <button 
          v-if="chapter === '第八章 上善若水'"
          @click="generateChapterImage(chapter)"
          class="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-all flex items-center justify-center text-xs"
          :disabled="isLoading"
          title="生成上善若水意境图"
        >
          <i class="fas fa-image"></i>
        </button>
      </div>
    </div>

    <!-- 第八章图片生成模态框 -->
    <transition name="modal">
      <div v-if="showImageModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slide-up">
          <!-- Header -->
          <div class="bg-primary text-white p-6 relative">
            <h3 class="text-xl font-bold font-serif">上善若水 · 意境图</h3>
            <p class="text-white/80 text-sm mt-1">第八章 "上善若水" 的AI意境生成</p>
            <button @click="closeImageModal" class="absolute top-4 right-4 text-white/70 hover:text-white">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
              <div v-if="isGenerating" class="text-center text-gray-400">
                <i class="fas fa-water text-6xl mb-4 opacity-50 animate-pulse"></i>
                <p class="text-sm">AI正在挥毫泼墨...</p>
              </div>
              <img 
                v-else-if="generatedImage" 
                :src="generatedImage" 
                alt="上善若水意境图" 
                class="w-full h-full object-cover animate-fade-in"
              />
              <div v-else class="text-center text-gray-400">
                <i class="fas fa-image text-6xl mb-4 opacity-50"></i>
                <p class="text-sm">点击生成按钮开始创作</p>
              </div>
            </div>

            <!-- Quote -->
            <div class="bg-light p-4 rounded-lg border border-secondary/20 italic text-center mb-4">
              <p class="text-primary font-bold">"上善若水。水善利万物而不争，处众人之所恶，故几于道。"</p>
              <p class="text-gray-600 text-sm not-italic mt-1">——《道德经》第八章</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button 
                @click="regenerateImage"
                :disabled="isGenerating"
                class="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <span v-if="isGenerating">
                  <i class="fas fa-spinner fa-spin mr-2"></i>生成中...
                </span>
                <span v-else>
                  <i class="fas fa-redo mr-2"></i>重新生成
                </span>
              </button>
              <button 
                @click="downloadImage"
                :disabled="!generatedImage || isGenerating"
                class="flex-1 py-3 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
              >
                <i class="fas fa-download mr-2"></i>下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { ref } from 'vue'
import { imageGenerator } from '@/utils/imageGenerator'

const chatStore = useChatStore()
const { chapters, isLoading } = storeToRefs(chatStore)
const { sendChapterQuestion } = chatStore

const showImageModal = ref(false)
const generatedImage = ref('')
const isGenerating = ref(false)

const generateChapterImage = async (chapter: string) => {
  if (chapter === '第八章 上善若水') {
    isGenerating.value = true
    showImageModal.value = true
    
    try {
      const config = {
        prompt: '上善若水',
        style: 'ink',
        size: 'square',
        quality: 'standard'
      }
      
      const result = await imageGenerator.generateImage(config)
      generatedImage.value = result.imageUrl
    } catch (error) {
      console.error('生成图片失败:', error)
      // 使用备用图片
      generatedImage.value = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop'
    } finally {
      isGenerating.value = false
    }
  }
}

const closeImageModal = () => {
  showImageModal.value = false
  generatedImage.value = ''
}

const downloadImage = () => {
  if (generatedImage.value) {
    const link = document.createElement('a')
    link.href = generatedImage.value
    link.download = '上善若水意境图.jpg'
    link.click()
  }
}

const regenerateImage = () => {
  generateChapterImage('第八章 上善若水')
}
</script>

<style scoped>
/* 章节选择器样式 */
.chapter-select {
  @apply px-4 py-3 rounded-lg border-2 border-secondary/30 bg-white text-dark font-medium transition-all duration-300;
}

.chapter-select:hover:not(:disabled) {
  @apply border-primary bg-primary/5 transform -translate-y-1 shadow-lg;
}

.chapter-select:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 古籍模式适配 */
:global(html.retro-mode) h2 {
  font-family: "KaiTi", "STKaiti", serif;
}

:global(html.retro-mode) .chapter-select {
  font-family: "KaiTi", "STKaiti", serif;
  border-color: #8d6e63;
  background-color: #f7f1e3;
}

:global(html.retro-mode) .chapter-select:hover {
  background-color: #8d6e63;
  color: #fff;
}

:global(html.retro-mode.zen-mode) .chapter-select {
  background-color: #2c2c2e;
  border-color: #d4b483;
  color: #d1d5db;
}

:global(html.retro-mode.zen-mode) .chapter-select:hover {
  background-color: #d4b483;
  color: #1c1c1e;
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

:global(html.zen-mode) .bg-light {
  background-color: #3f3f46;
  border-color: #52525b;
}

:global(html.zen-mode) .bg-gray-100 {
  background-color: #3f3f46;
  border-color: #52525b;
}

:global(html.zen-mode) .text-gray-600 {
  color: #9ca3af;
}
</style>