<template>
  <div class="min-h-screen pt-4 pb-20 px-4 md:px-8">
    <div class="container mx-auto max-w-5xl">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl font-bold text-primary mb-4 font-serif">道家决策辅助</h1>
        <p class="text-lg text-gray-600 italic">
          "人法地，地法天，天法道，道法自然"
        </p>
        <p class="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          将西方管理学 SWOT 分析与东方道家智慧相结合。
          <br>
          <span class="text-accent">阳(优势) · 阴(劣势) · 天时(机会) · 地利(威胁)</span>
        </p>
      </div>

      <!-- Input Section -->
      <div v-if="step === 1" class="bg-white rounded-2xl shadow-xl p-8 border border-secondary/20 animate-slide-up relative overflow-hidden">
        <!-- Background Decor -->
        <div class="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
          <i class="fas fa-compass text-9xl"></i>
        </div>

        <div class="mb-8">
          <label class="block text-lg font-bold text-primary mb-2">您面临的决策难题是？</label>
          <input 
            v-model="decisionTopic"
            type="text" 
            placeholder="例如：是否应该辞职创业？ / 是否应该接手这个新项目？"
            class="w-full px-4 py-3 rounded-lg border-2 border-secondary/30 focus:border-primary focus:outline-none transition-colors text-lg bg-light/50"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 阳 (Strengths) -->
          <div class="space-y-2">
            <label class="flex items-center text-lg font-bold text-red-800">
              <span class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2 text-sm border border-red-200">阳</span>
              自身优势 (Strengths)
            </label>
            <textarea 
              v-model="swot.strengths"
              rows="4"
              placeholder="您具备哪些有利条件？您的核心竞争力是什么？"
              class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none transition-all resize-none bg-red-50/30"
            ></textarea>
          </div>

          <!-- 阴 (Weaknesses) -->
          <div class="space-y-2">
            <label class="flex items-center text-lg font-bold text-blue-800">
              <span class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-sm border border-blue-200">阴</span>
              自身劣势 (Weaknesses)
            </label>
            <textarea 
              v-model="swot.weaknesses"
              rows="4"
              placeholder="您面临哪些内部阻碍？有哪些不足之处？"
              class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all resize-none bg-blue-50/30"
            ></textarea>
          </div>

          <!-- 天时 (Opportunities) -->
          <div class="space-y-2">
            <label class="flex items-center text-lg font-bold text-yellow-700">
              <span class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2 text-sm border border-yellow-200">天</span>
              外部机遇 (Opportunities)
            </label>
            <textarea 
              v-model="swot.opportunities"
              rows="4"
              placeholder="当前大环境有哪些有利因素？是否有顺势而为的机会？"
              class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all resize-none bg-yellow-50/30"
            ></textarea>
          </div>

          <!-- 地利 (Threats) -->
          <div class="space-y-2">
            <label class="flex items-center text-lg font-bold text-green-800">
              <span class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 text-sm border border-green-200">地</span>
              外部风险 (Threats)
            </label>
            <textarea 
              v-model="swot.threats"
              rows="4"
              placeholder="环境中有哪些潜在危机？竞争对手的情况如何？"
              class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none transition-all resize-none bg-green-50/30"
            ></textarea>
          </div>
        </div>

        <div class="mt-10 text-center">
          <!-- 抽签动画容器 -->
          <div class="relative inline-block">
            <!-- 签筒动画 -->
            <div class="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <transition name="bounce">
                <div v-if="isAnalyzing" class="flex flex-col items-center">
                  <div class="w-8 h-20 bg-gradient-to-b from-yellow-800 to-yellow-600 rounded-lg shadow-lg border-2 border-yellow-900 relative">
                    <!-- 签筒装饰 -->
                    <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full"></div>
                    <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full"></div>
                  </div>
                  <!-- 飞出的签 -->
                  <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-fly-sign">
                    <div class="w-4 h-16 bg-gradient-to-b from-red-600 to-red-800 rounded-sm shadow-lg border border-red-900 relative">
                      <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-red-300 rounded-full"></div>
                      <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-red-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            
            <button 
              @click="analyze"
              :disabled="!isValid || isAnalyzing"
              class="px-12 py-4 bg-primary text-white text-xl font-bold rounded-full shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 relative z-10"
              :class="{'animate-shake': isAnalyzing}"
            >
              <span v-if="isAnalyzing">
                <i class="fas fa-yin-yang fa-spin mr-2"></i> 起卦中...
              </span>
              <span v-else>
                <i class="fas fa-compass mr-2"></i> 起卦推演
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Result Section -->
      <div v-else class="space-y-8 animate-fade-in">
        <!-- AI Analysis Card with Animation -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-accent relative overflow-hidden">
          <!-- 结果展示动画 -->
          <transition name="result-fade">
            <div v-if="showResultAnimation" class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl animate-pulse"></div>
          </transition>
          
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary font-serif">
              <transition name="bounce" appear>
                <span>道家决策建议</span>
              </transition>
            </h2>
            <button @click="step = 1" class="text-sm text-gray-500 hover:text-primary underline">重新推演</button>
          </div>

          <div class="prose max-w-none text-dark leading-relaxed">
            <transition name="quote-slide" appear>
              <div class="mb-6 p-4 bg-light rounded-lg border border-secondary/20 italic text-lg text-center">
                "{{ result.quote }}"
                <div class="text-sm text-gray-500 mt-2 not-italic">—— {{ result.source }}</div>
              </div>
            </transition>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="font-bold text-lg mb-3 flex items-center">
                  <i class="fas fa-yin-yang text-primary mr-2"></i> 局势研判
                </h3>
                <p class="text-gray-700">{{ result.analysis }}</p>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-3 flex items-center">
                  <i class="fas fa-lightbulb text-accent mr-2"></i> 破局之道
                </h3>
                <p class="text-gray-700">{{ result.strategy }}</p>
              </div>
            </div>

            <div class="bg-primary/5 p-6 rounded-xl">
              <h3 class="font-bold text-primary mb-3">具体行动建议：</h3>
              <ul class="space-y-2">
                <li v-for="(action, idx) in result.actions" :key="idx" class="flex items-start">
                  <span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">{{ idx + 1 }}</span>
                  <span class="text-gray-800">{{ action }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Hexagram Visualization with Animation -->
        <div class="flex justify-center">
          <div class="relative">
            <!-- 卦象动画 -->
            <transition-group name="hexagram" tag="div" class="flex flex-col gap-2">
              <div 
                v-for="(line, index) in hexagramLines" 
                :key="index"
                class="w-32 h-4 bg-primary rounded-sm opacity-30 transition-all duration-500"
                :class="{'animate-pulse': index === currentHexagramLine}"
              ></div>
            </transition-group>
            
            <!-- 阴阳鱼动画 -->
            <div class="absolute -right-20 top-1/2 transform -translate-y-1/2 opacity-40">
              <div class="relative w-16 h-16 animate-rotate-yin-yang">
                <div class="absolute inset-0 rounded-full bg-primary"></div>
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-dark rounded-full"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-dark rounded-full"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const step = ref(1)
const isAnalyzing = ref(false)
const decisionTopic = ref('')

const swot = ref({
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: ''
})

const isValid = computed(() => {
  return decisionTopic.value.trim().length > 0 &&
         (swot.value.strengths || swot.value.weaknesses || swot.value.opportunities || swot.value.threats)
})

interface AnalysisResult {
  quote: string
  source: string
  analysis: string
  strategy: string
  actions: string[]
}

const result = ref<AnalysisResult>({
  quote: '',
  source: '',
  analysis: '',
  strategy: '',
  actions: []
})

const hexagramLines = ref([1, 2, 3, 4, 5, 6])
const currentHexagramLine = ref(0)
const showResultAnimation = ref(false)

// 震动反馈函数
const triggerHaptic = (pattern: number | number[] = 50) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

// Mock AI Analysis Logic
const analyze = () => {
  if (!isValid.value) return
  
  isAnalyzing.value = true
  showResultAnimation.value = false
  currentHexagramLine.value = 0
  
  // 开始震动反馈
  triggerHaptic([100, 50, 100, 50, 100])
  
  // 卦象逐行显示动画
  const hexagramInterval = setInterval(() => {
    if (currentHexagramLine.value < hexagramLines.value.length - 1) {
      currentHexagramLine.value++
    } else {
      clearInterval(hexagramInterval)
    }
  }, 300)
  
  // Simulate API delay
  setTimeout(() => {
    generateResult()
    isAnalyzing.value = false
    step.value = 2
    showResultAnimation.value = true
    
    // 结果展示震动
    triggerHaptic(200)
    
    // 卦象动画重置
    setTimeout(() => {
      currentHexagramLine.value = 0
    }, 1000)
  }, 2000)
}

const generateResult = () => {
  // Simple logic to generate "Daoist" advice based on SWOT input length/presence
  // In a real app, this would send the SWOT data to an LLM
  
  const hasStrongInternal = swot.value.strengths.length > swot.value.weaknesses.length
  const hasStrongExternal = swot.value.opportunities.length > swot.value.threats.length
  
  if (hasStrongInternal && hasStrongExternal) {
    // SO Strategy: 顺势而为
    result.value = {
      quote: '抟扶摇而上者九万里，绝云气，负青天。',
      source: '庄子·逍遥游（引申）',
      analysis: '当前您自身具备较强优势（阳气足），且外部环境有利（天时至）。此乃顺风顺水之局，犹如大鹏展翅，势不可挡。',
      strategy: '当“无为而无不为”。顺应大势，大胆行动，不要过分犹豫。利用自身优势最大化外部机遇。',
      actions: [
        '制定激进的扩张或行动计划，快速抢占先机。',
        '整合现有资源，集中力量在核心突破点上。',
        '保持开放心态，广泛结交盟友（“善贷且成”）。'
      ]
    }
  } else if (hasStrongInternal && !hasStrongExternal) {
    // ST Strategy: 韬光养晦
    result.value = {
      quote: '持而盈之，不如其已；揣而锐之，不可长保。',
      source: '道德经 第九章',
      analysis: '您自身实力尚可，但外部环境充满挑战与风险。此时若强行出击，恐有折损之虞。正如锋芒毕露易折，盈满易溢。',
      strategy: '宜“守柔曰强”。利用自身优势构筑护城河，对外保持低调，等待外部环境转好。不争一时之长短。',
      actions: [
        '优化内部流程，降低成本，保存实力（“治大国若烹小鲜”）。',
        '避免正面冲突，寻找细分市场或避风港。',
        '密切观察环境变化，通过小规模尝试来测试风险。'
      ]
    }
  } else if (!hasStrongInternal && hasStrongExternal) {
    // WO Strategy: 借力使力
    result.value = {
      quote: '江海所以能为百谷王者，以其善下之，故能为百谷王。',
      source: '道德经 第六十六章',
      analysis: '外部机会虽好，但您自身存在明显短板。若盲目贪大求全，恐虚不受补。此时需要谦下、包容，善于借力。',
      strategy: '当“处下不争”。承认自身不足，通过合作、外包或学习来弥补短板。像江海一样处于低位，汇聚他人之力。',
      actions: [
        '寻找合作伙伴，以利益共享换取能力互补。',
        '专注于利用机会中最容易入手的部分，逐步积累。',
        '快速学习，提升核心能力，缩小差距。'
      ]
    }
  } else {
    // WT Strategy: 否极泰来/静观其变
    result.value = {
      quote: '致虚极，守静笃。万物并作，吾以观复。',
      source: '道德经 第十六章',
      analysis: '当前内忧外患，局势晦暗不明。自身条件不足，且环境恶劣。此时妄动必凶，强行作为只会加速消耗。',
      strategy: '宜“归根复命”。彻底停下来反思，回归本源，削减不必要的欲望和行动。等待是目前最好的策略。',
      actions: [
        '做减法，砍掉非核心业务或支出（“少则得，多则惑”）。',
        '静心修养，提升内在心性，等待时机流转。',
        '重新审视目标，是否违背了自然规律，考虑转换赛道。'
      ]
    }
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes fly-sign {
  0% { transform: translate(-50%, 0) rotate(0deg); }
  20% { transform: translate(-50%, -30px) rotate(10deg); }
  40% { transform: translate(-50%, -60px) rotate(-5deg); }
  60% { transform: translate(-50%, -90px) rotate(8deg); }
  80% { transform: translate(-50%, -120px) rotate(-3deg); }
  100% { transform: translate(-50%, -150px) rotate(0deg); opacity: 0; }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes rotate-yin-yang {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes result-fade {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0; transform: scale(1); }
}

@keyframes quote-slide {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes hexagram-enter {
  0% { opacity: 0; transform: scaleY(0); }
  100% { opacity: 1; transform: scaleY(1); }
}

@keyframes hexagram-leave {
  0% { opacity: 1; transform: scaleY(1); }
  100% { opacity: 0; transform: scaleY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: fade-in 0.6s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-shake {
  animation: shake 0.8s ease-in-out infinite;
}

.animate-fly-sign {
  animation: fly-sign 1.5s ease-out forwards;
}

.bounce-enter-active {
  animation: bounce 0.8s;
}

.bounce-leave-active {
  animation: bounce 0.8s reverse;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-rotate-yin-yang {
  animation: rotate-yin-yang 3s linear infinite;
}

.result-fade-enter-active {
  animation: result-fade 2s ease-out;
}

.quote-slide-enter-active {
  animation: quote-slide 0.8s ease-out;
}

.hexagram-enter-active {
  animation: hexagram-enter 0.5s ease-out;
}

.hexagram-leave-active {
  animation: hexagram-leave 0.5s ease-out;
}

.hexagram-move {
  transition: transform 0.5s ease-out;
}

/* Zen Mode Support */
:global(html.zen-mode) .bg-white {
  background-color: #2c2c2e;
  border-color: #3f3f46;
}

:global(html.zen-mode) .text-primary {
  color: #d4b483;
}

:global(html.zen-mode) .text-dark,
:global(html.zen-mode) .text-gray-700,
:global(html.zen-mode) .text-gray-800 {
  color: #d1d5db;
}

:global(html.zen-mode) .text-gray-600,
:global(html.zen-mode) .text-gray-500 {
  color: #9ca3af;
}

:global(html.zen-mode) input,
:global(html.zen-mode) textarea {
  background-color: #1c1c1e;
  border-color: #3f3f46;
  color: #d4b483;
}

:global(html.zen-mode) .bg-light {
  background-color: #3f3f46;
}
</style>
