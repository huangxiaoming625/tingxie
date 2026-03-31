<template>
  <div class="dictation-view">
    <div class="card">
      <!-- 设置阶段 -->
      <div v-if="!isDictating && !dictationComplete" class="setup-phase">
        <h2>🎯 听写设置</h2>

        <!-- 选择课程 -->
        <div class="setup-section">
          <h3>选择要听写的内容</h3>

          <div class="lesson-selector">
            <div v-for="unit in units" :key="unit.id" class="unit-section">
              <h4>{{ unit.name }}</h4>
              <div class="lessons-grid">
                <div
                  v-for="lesson in getLessonsByUnit(unit.id)"
                  :key="lesson.id"
                  class="lesson-card"
                  :class="{ selected: selectedLessons.includes(lesson.id) }"
                  @click="toggleLesson(lesson.id)"
                >
                  <p class="lesson-name">{{ lesson.name }}</p>
                  <p class="lesson-count">{{ getWordsByLesson(lesson.id).length }}个词语</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 听写设置 -->
        <div v-if="selectedLessons.length > 0" class="setup-section">
          <h3>听写参数</h3>

          <div class="settings-form">
            <div class="setting-item">
              <label>听写词语数量：</label>
              <div class="count-control">
                <button @click="adjustCount(-5)" :disabled="wordCount <= 5">-5</button>
                <button @click="adjustCount(-1)" :disabled="wordCount <= 1">-1</button>
                <span class="count-display">{{ wordCount }} / {{ totalAvailableWords }}</span>
                <button @click="adjustCount(1)" :disabled="wordCount >= totalAvailableWords">+1</button>
                <button @click="adjustCount(5)" :disabled="wordCount + 5 > totalAvailableWords">+5</button>
              </div>
            </div>

            <div class="setting-item">
              <label>基础间隔时间：</label>
              <div class="interval-control">
                <input
                  type="range"
                  v-model="baseInterval"
                  min="3"
                  max="15"
                  step="1"
                />
                <span class="interval-display">{{ baseInterval }}秒</span>
              </div>
              <p class="hint">难度高的词语自动延长间隔时间</p>
            </div>

            <div class="setting-item">
              <label>
                <input type="checkbox" v-model="showPinyin" />
                听写时显示拼音提示
              </label>
            </div>
          </div>

          <button @click="startDictation" class="btn-primary btn-large">
            开始听写 🎤
          </button>
        </div>

        <div v-else class="empty-hint">
          请选择要听写的课程
        </div>
      </div>

      <!-- 听写阶段 -->
      <div v-if="isDictating" class="dictating-phase">
        <div class="dictation-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${((currentIndex) / wordsToDictate.length) * 100}%` }"
            ></div>
          </div>

          <div class="progress-text">
            第 {{ currentIndex + 1 }} / {{ wordsToDictate.length }} 个
          </div>

          <div class="current-word">
            <p class="word-display" v-if="currentWord">
              {{ showPinyin ? currentWord.content.replace(/./g, '●') : '●'.repeat(currentWord.content.length) }}
            </p>
            <p v-if="showPinyin && currentWord" class="pinyin-display">
              {{ currentWord.pinyin || '(拼音暂无)' }}
            </p>
            <p class="difficulty-tag">
              难度: {{ getDifficultyText(currentWord?.difficulty || 3) }}
            </p>
          </div>

          <div class="countdown" v-if="countdown > 0">
            下一个词语: {{ countdown }}秒
          </div>

          <div class="dictation-controls">
            <button @click="repeatWord" class="btn-secondary">
              🔁 再读一遍
            </button>
            <button @click="pauseDictation" v-if="!isPaused" class="btn-secondary">
              ⏸️ 暂停
            </button>
            <button @click="resumeDictation" v-if="isPaused" class="btn-secondary">
              ▶️ 继续
            </button>
            <button @click="endDictationEarly" class="btn-danger">
              结束听写
            </button>
          </div>
        </div>
      </div>

      <!-- 结果阶段 -->
      <div v-if="dictationComplete" class="result-phase">
        <h2>🎉 听写完成！</h2>

        <div class="result-summary">
          <p>共听写 <strong>{{ wordsToDictate.length }}</strong> 个词语</p>
          <p>使用课程: {{ getLessonsUsed() }}</p>
        </div>

        <div class="word-review">
          <h3>听写词语回顾</h3>
          <div class="words-list">
            <div v-for="word in wordsToDictate" :key="word.id" class="word-item">
              <span class="word-content">{{ word.content }}</span>
              <span v-if="word.pinyin" class="word-pinyin">{{ word.pinyin }}</span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button @click="restartDictation" class="btn-secondary">
            重新听写
          </button>
          <button @click="backToSetup" class="btn-primary">
            返回设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { tts } from '../utils/tts'
import { unitStorage, lessonStorage, wordStorage, recordStorage } from '../utils/storage'

// 设置阶段
const selectedLessons = ref([])
const wordCount = ref(10)
const baseInterval = ref(5)
const showPinyin = ref(false)

// 听写阶段
const isDictating = ref(false)
const isPaused = ref(false)
const dictationComplete = ref(false)
const wordsToDictate = ref([])
const currentIndex = ref(0)
const countdown = ref(0)
let countdownTimer = null

const units = computed(() => unitStorage.getAll())

const getLessonsByUnit = (unitId) => {
  return lessonStorage.getByUnitId(unitId).sort((a, b) => a.order - b.order)
}

const getWordsByLesson = (lessonId) => {
  return wordStorage.getByLessonId(lessonId)
}

const getDifficultyText = (diff) => {
  const texts = ['', '最简单', '简单', '中等', '较难', '最难']
  return texts[diff] || '中等'
}

const totalAvailableWords = computed(() => {
  let total = 0
  selectedLessons.value.forEach(lessonId => {
    total += getWordsByLesson(lessonId).length
  })
  return total
})

const currentWord = computed(() => {
  return wordsToDictate.value[currentIndex.value] || null
})

const toggleLesson = (lessonId) => {
  const index = selectedLessons.value.indexOf(lessonId)
  if (index !== -1) {
    selectedLessons.value.splice(index, 1)
  } else {
    selectedLessons.value.push(lessonId)
  }

  if (wordCount.value > totalAvailableWords.value) {
    wordCount.value = totalAvailableWords.value
  }
}

const adjustCount = (delta) => {
  const newCount = wordCount.value + delta
  if (newCount >= 1 && newCount <= totalAvailableWords.value) {
    wordCount.value = newCount
  }
}

const startDictation = async () => {
  if (selectedLessons.value.length === 0) return

  // 收集所有选择的词语
  let allWords = []
  selectedLessons.value.forEach(lessonId => {
    allWords = allWords.concat(getWordsByLesson(lessonId))
  })

  // 随机选择词语
  wordsToDictate.value = shuffleArray(allWords).slice(0, wordCount.value)
  currentIndex.value = 0
  isDictating.value = true
  isPaused.value = false
  dictationComplete.value = false

  // 保存听写记录
  recordStorage.add({
    lessonId: selectedLessons.value.join(','),
    wordIds: wordsToDictate.value.map(w => w.id),
    settings: {
      wordCount: wordCount.value,
      baseInterval: baseInterval.value
    }
  })

  // 开始听写第一个词语
  await speakCurrentWord()
}

const speakCurrentWord = async () => {
  if (!currentWord.value || !isDictating.value) return

  try {
    await tts.speak(currentWord.value.content)
    if (!isDictating.value) return

    // 计算间隔时间（根据难度调整）
    const difficulty = currentWord.value.difficulty || 3
    const interval = baseInterval.value * (1 + (difficulty - 1) * 0.3)

    startCountdown(Math.round(interval))
  } catch (error) {
    console.error('语音播报失败:', error)
    alert('语音播报失败，请检查浏览器权限')
  }
}

const startCountdown = (seconds) => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  countdown.value = seconds

  countdownTimer = setInterval(() => {
    if (isPaused.value) return

    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      nextWord()
    }
  }, 1000)
}

const nextWord = async () => {
  currentIndex.value++
  if (currentIndex.value >= wordsToDictate.value.length) {
    finishDictation()
  } else {
    await speakCurrentWord()
  }
}

const repeatWord = async () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  await speakCurrentWord()
}

const pauseDictation = () => {
  isPaused.value = true
  tts.stop()
}

const resumeDictation = async () => {
  isPaused.value = false
  await speakCurrentWord()
}

const endDictationEarly = () => {
  if (confirm('确定要结束听写吗？')) {
    finishDictation()
  }
}

const finishDictation = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  isDictating.value = false
  dictationComplete.value = true
  tts.stop()
}

const restartDictation = async () => {
  currentIndex.value = 0
  dictationComplete.value = false
  isDictating.value = true
  await speakCurrentWord()
}

const backToSetup = () => {
  dictationComplete.value = false
  wordsToDictate.value = []
  currentIndex.value = 0
}

const getLessonsUsed = () => {
  return selectedLessons.value
    .map(id => lessonStorage.getAll().find(l => l.id === id))
    .filter(Boolean)
    .map(l => l.name)
    .join('、')
}

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  tts.stop()
})
</script>

<style scoped>
.dictation-view {
  min-height: 600px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #f5576c;
}

.setup-section {
  margin-bottom: 2rem;
}

.setup-section h3 {
  color: #333;
  margin-bottom: 1rem;
}

.unit-section {
  margin-bottom: 1.5rem;
}

.unit-section h4 {
  color: #f5576c;
  margin-bottom: 0.75rem;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.lesson-card {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.lesson-card:hover {
  border-color: #f093fb;
  background: #fef5f7;
}

.lesson-card.selected {
  border-color: #f5576c;
  background: #fff0f0;
}

.lesson-name {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.lesson-count {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.settings-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-control button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #f093fb;
  color: white;
  cursor: pointer;
}

.count-control button:hover {
  background: #f5576c;
}

.count-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.count-display {
  font-size: 1.2rem;
  font-weight: 600;
  color: #f5576c;
  min-width: 100px;
  text-align: center;
}

.interval-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.interval-control input[type="range"] {
  flex: 1;
}

.interval-display {
  font-weight: 600;
  color: #f5576c;
  min-width: 60px;
}

.hint {
  color: #888;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.empty-hint {
  text-align: center;
  color: #888;
  padding: 2rem;
}

/* 听写阶段 */
.dictating-phase {
  text-align: center;
}

.dictation-container {
  padding: 2rem;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f093fb, #f5576c);
  transition: width 0.5s;
}

.progress-text {
  color: #888;
  margin-bottom: 2rem;
}

.current-word {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.word-display {
  font-size: 4rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.5rem;
}

.pinyin-display {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.difficulty-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin: 0;
}

.countdown {
  font-size: 2rem;
  color: #f5576c;
  font-weight: bold;
  margin-bottom: 2rem;
}

.dictation-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 结果阶段 */
.result-phase {
  text-align: center;
}

.result-summary {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.result-summary p {
  margin: 0.5rem 0;
}

.result-summary strong {
  color: #f5576c;
  font-size: 1.5rem;
}

.word-review {
  margin-bottom: 2rem;
  text-align: left;
}

.word-review h3 {
  color: #333;
  margin-bottom: 1rem;
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.word-item {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.word-content {
  font-weight: 600;
  color: #333;
}

.word-pinyin {
  color: #888;
  font-size: 0.9rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}

.btn-primary {
  background: #f5576c;
  color: white;
}

.btn-primary:hover {
  background: #e4465b;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background: #ee5a5a;
}

.btn-large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}
</style>
