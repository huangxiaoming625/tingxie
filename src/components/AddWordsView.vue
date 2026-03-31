<template>
  <div class="add-words-view">
    <div class="card">
      <h2>📷 添加词语</h2>

      <div class="instructions">
        <p>💡 使用说明：</p>
        <ol>
          <li>用红色或蓝色荧光笔在课本上划出要学习的词语</li>
          <li>拍摄课本页面，确保图片清晰</li>
          <li>系统会自动识别并提取标记的词语</li>
          <li>确认无误后保存到词语库</li>
        </ol>
      </div>

      <!-- 图片上传区域 -->
      <div class="upload-section">
        <label class="upload-label">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            hidden
          />
          <div class="upload-area" :class="{ dragging: isDragging }">
            <div v-if="!previewImage" class="upload-placeholder">
              <p class="upload-icon">📷</p>
              <p>点击选择图片或拖拽到此处</p>
              <p class="upload-hint">支持 JPG、PNG、WebP 格式</p>
            </div>
            <img v-if="previewImage" :src="previewImage" class="preview-image" />
          </div>
        </label>

        <!-- 图片预览和操作 -->
        <div v-if="previewImage" class="image-actions">
          <button @click="resetImage" class="btn-secondary">重新选择</button>
          <button @click="startRecognition" :disabled="isRecognizing" class="btn-primary">
            {{ isRecognizing ? '识别中...' : '开始识别' }}
          </button>
        </div>
      </div>

      <!-- 识别结果 -->
      <div v-if="recognizedWords.length > 0" class="recognition-result">
        <h3>🔍 识别结果</h3>
        <div class="words-to-confirm">
          <div v-for="word in recognizedWords" :key="word" class="word-tag">
            {{ word }}
            <button @click="removeWord(word)" class="btn-remove">×</button>
          </div>
        </div>

        <!-- 选择课程 -->
        <div class="course-selection">
          <label>
            保存到：
            <select v-model="selectedLessonId">
              <optgroup
                v-for="unit in units"
                :key="unit.id"
                :label="`${unit.name} (${getLessonsByUnit(unit.id).length}课)`"
              >
                <option
                  v-for="lesson in getLessonsByUnit(unit.id)"
                  :key="lesson.id"
                  :value="lesson.id"
                >
                  {{ lesson.name }}
                </option>
              </optgroup>
            </select>
          </label>

          <label>
            词语难度：
            <select v-model="selectedDifficulty">
              <option v-for="d in 5" :key="d" :value="d">
                {{ getDifficultyText(d) }}
              </option>
            </select>
          </label>
        </div>

        <button @click="saveWords" class="btn-primary btn-large">
          保存到词语库
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { imageProcessor } from '../utils/imageProcessor'
import { unitStorage, lessonStorage, wordStorage } from '../utils/storage'

const fileInput = ref(null)
const isDragging = ref(false)
const previewImage = ref(null)
const isRecognizing = ref(false)
const recognizedWords = ref([])
const selectedLessonId = ref(null)
const selectedDifficulty = ref(2)

const units = computed(() => {
  return unitStorage.getAll()
})

const getLessonsByUnit = (unitId) => {
  return lessonStorage.getByUnitId(unitId).sort((a, b) => a.order - b.order)
}

const getDifficultyText = (diff) => {
  const texts = ['', '最简单', '简单', '中等', '较难', '最难']
  return texts[diff] || '中等'
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false

  const files = Array.from(e.dataTransfer.files)
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    processImageFile(files[0])
  }
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

const processImageFile = async (file) => {
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
      recognizedWords.value = []
    }
    reader.readAsDataURL(file)
  } catch (error) {
    alert('图片读取失败，请重试')
  }
}

const resetImage = () => {
  previewImage.value = null
  recognizedWords.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const startRecognition = async () => {
  if (!previewImage.value) return

  isRecognizing.value = true
  try {
    console.log('开始识别...')
    // 这里应该是实际的图像识别
    // 由于是简化版，我们使用模拟识别
    const results = await imageProcessor.recognizeWordsFromImage(previewImage.value)

    if (results.length === 0) {
      alert('未识别到词语，请确保已用红色或蓝色荧光笔标记')
      return
    }

    // 过滤重复并去重
    const uniqueResults = [...new Set(results)]
    recognizedWords.value = uniqueResults

    alert(`成功识别到 ${uniqueResults.length} 个词语！`)
  } catch (error) {
    console.error('识别失败:', error)
    alert('识别失败，请重试')
  } finally {
    isRecognizing.value = false
  }
}

const removeWord = (word) => {
  const index = recognizedWords.value.indexOf(word)
  if (index !== -1) {
    recognizedWords.value.splice(index, 1)
  }
}

const saveWords = () => {
  if (recognizedWords.value.length === 0) {
    alert('没有可保存的词语')
    return
  }

  if (!selectedLessonId.value) {
    alert('请选择要保存到的课程')
    return
  }

  const words = recognizedWords.value.map(word => ({
    lessonId: selectedLessonId.value,
    content: word,
    difficulty: selectedDifficulty.value
  }))

  wordStorage.addBatch(words)

  alert(`成功保存 ${words.length} 个词语！`)

  // 重置
  resetImage()
  selectedLessonId.value = null
  selectedDifficulty.value = 2
}
</script>

<style scoped>
.add-words-view {
  min-height: 600px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-bottom: 1.5rem;
  color: #f5576c;
}

.instructions {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.instructions p {
  margin: 0 0 0.5rem 0;
  color: #856404;
}

.instructions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.instructions li {
  color: #856404;
  margin-bottom: 0.5rem;
}

.upload-section {
  margin-bottom: 2rem;
}

.upload-label {
  display: block;
  cursor: pointer;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #f093fb;
  background: #fef5f7;
}

.upload-area.dragging {
  border-color: #f5576c;
  background: #fff0f0;
}

.upload-placeholder {
  color: #888;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  margin: 0 0 0.5rem 0;
}

.upload-hint {
  font-size: 0.9rem;
  color: #aaa;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.recognition-result {
  background: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.recognition-result h3 {
  margin-top: 0;
  color: #1976d2;
  margin-bottom: 1rem;
}

.words-to-confirm {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.word-tag {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-remove {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  color: #ee5a5a;
}

.course-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.course-selection label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.course-selection select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  flex: 1;
  min-width: 200px;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
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

.btn-large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}
</style>
