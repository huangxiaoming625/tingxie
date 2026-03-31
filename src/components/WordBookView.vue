<template>
  <div class="wordbook-view">
    <div class="card">
      <h2>📖 词语库</h2>

      <!-- 年级和学期选择 -->
      <div class="filter-bar">
        <label>
          年级：
          <select v-model="selectedGrade" @change="loadUnits">
            <option v-for="g in 6" :key="g" :value="g">{{ g }}年级</option>
          </select>
        </label>
        <label>
          学期：
          <select v-model="selectedSemester" @change="loadUnits">
            <option :value="1">上册</option>
            <option :value="2">下册</option>
          </select>
        </label>
        <button @click="showAddUnitDialog = true" class="btn-small">+ 添加单元</button>
      </div>

      <!-- 单元和课程列表 -->
      <div class="units-list">
        <div v-for="unit in units" :key="unit.id" class="unit-item">
          <div class="unit-header">
            <h3>{{ unit.name }}</h3>
            <div class="unit-actions">
              <button @click="showAddLessonDialog(unit.id)" class="btn-small">+ 添加课程</button>
              <button @click="deleteUnit(unit.id)" class="btn-small btn-danger">删除</button>
            </div>
          </div>

          <div class="lessons-list">
            <div v-for="lesson in getLessonsByUnit(unit.id)" :key="lesson.id" class="lesson-item">
              <div class="lesson-header" @click="toggleLesson(lesson.id)">
                <span class="toggle-icon">{{ expandedLessons.includes(lesson.id) ? '▼' : '▶' }}</span>
                <h4>{{ lesson.name }}</h4>
                <span class="word-count">({{ getWordsByLesson(lesson.id).length }}个词语)</span>
                <div class="lesson-actions">
                  <button @click.stop="showAddWordDialog(lesson.id)" class="btn-small">+ 词语</button>
                  <button @click.stop="deleteLesson(lesson.id)" class="btn-small btn-danger">删除</button>
                </div>
              </div>

              <div v-if="expandedLessons.includes(lesson.id)" class="words-list">
                <div v-if="getWordsByLesson(lesson.id).length === 0" class="empty-message">
                  暂无词语，点击上方按钮添加
                </div>
                <div v-for="word in getWordsByLesson(lesson.id)" :key="word.id" class="word-item">
                  <span class="word-content">{{ word.content }}</span>
                  <span v-if="word.pinyin" class="word-pinyin">{{ word.pinyin }}</span>
                  <span class="word-difficulty">难度: {{ getDifficultyText(word.difficulty) }}</span>
                  <button @click="deleteWord(word.id)" class="btn-mini btn-danger">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="units.length === 0" class="empty-message">
          暂无单元，请先添加单元
        </div>
      </div>
    </div>

    <!-- 添加单元弹窗 -->
    <div v-if="showAddUnitDialog" class="modal-overlay" @click.self="showAddUnitDialog = false">
      <div class="modal">
        <h3>添加单元</h3>
        <input v-model="newUnitName" placeholder="单元名称，如：第一单元" />
        <div class="modal-actions">
          <button @click="showAddUnitDialog = false">取消</button>
          <button @click="addUnit" class="btn-primary">确认</button>
        </div>
      </div>
    </div>

    <!-- 添加课程弹窗 -->
    <div v-if="showAddLessonDialogUnitId" class="modal-overlay" @click.self="showAddLessonDialogUnitId = null">
      <div class="modal">
        <h3>添加课程</h3>
        <input v-model="newLessonName" placeholder="课程名称，如：《春夏秋冬》" />
        <div class="modal-actions">
          <button @click="showAddLessonDialogUnitId = null">取消</button>
          <button @click="addLesson" class="btn-primary">确认</button>
        </div>
      </div>
    </div>

    <!-- 添加词语弹窗 -->
    <div v-if="showAddWordDialogLessonId" class="modal-overlay" @click.self="showAddWordDialogLessonId = null">
      <div class="modal">
        <h3>添加词语</h3>
        <textarea v-model="newWordsText" placeholder="输入词语，每行一个&#10;如：&#10;春天&#10;冬天&#10;花朵"></textarea>
        <label>
          难度：
          <select v-model="newWordDifficulty">
            <option v-for="d in 5" :key="d" :value="d">{{ getDifficultyText(d) }}</option>
          </select>
        </label>
        <div class="modal-actions">
          <button @click="showAddWordDialogLessonId = null">取消</button>
          <button @click="addWords" class="btn-primary">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { unitStorage, lessonStorage, wordStorage } from '../utils/storage'

const selectedGrade = ref(1)
const selectedSemester = ref(1)
const units = ref([])
const expandedLessons = ref([])

const showAddUnitDialog = ref(false)
const newUnitName = ref('')

const showAddLessonDialogUnitId = ref(null)
const newLessonName = ref('')

const showAddWordDialogLessonId = ref(null)
const newWordsText = ref('')
const newWordDifficulty = ref(2)

const loadUnits = () => {
  units.value = unitStorage.getByGradeAndSemester(selectedGrade.value, selectedSemester.value)
}

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

const toggleLesson = (lessonId) => {
  const index = expandedLessons.value.indexOf(lessonId)
  if (index !== -1) {
    expandedLessons.value.splice(index, 1)
  } else {
    expandedLessons.value.push(lessonId)
  }
}

const addUnit = () => {
  if (newUnitName.value.trim()) {
    unitStorage.add({
      name: newUnitName.value.trim(),
      grade: selectedGrade.value,
      semester: selectedSemester.value,
      order: units.value.length + 1
    })
    newUnitName.value = ''
    showAddUnitDialog.value = false
    loadUnits()
  }
}

const deleteUnit = (unitId) => {
  if (confirm('确定要删除此单元及其下所有课程和词语吗？')) {
    const lessons = lessonStorage.getByUnitId(unitId)
    lessons.forEach(l => {
      wordStorage.deleteByLessonId(l.id)
      lessonStorage.delete(l.id)
    })
    unitStorage.delete(unitId)
    loadUnits()
  }
}

const showAddLessonDialog = (unitId) => {
  showAddLessonDialogUnitId.value = unitId
  newLessonName.value = ''
}

const addLesson = () => {
  if (showAddLessonDialogUnitId.value && newLessonName.value.trim()) {
    const lessons = lessonStorage.getByUnitId(showAddLessonDialogUnitId.value)
    lessonStorage.add({
      unitId: showAddLessonDialogUnitId.value,
      name: newLessonName.value.trim(),
      order: lessons.length + 1
    })
    newLessonName.value = ''
    showAddLessonDialogUnitId.value = null
    loadUnits()
  }
}

const deleteLesson = (lessonId) => {
  if (confirm('确定要删除此课程及其下所有词语吗？')) {
    wordStorage.deleteByLessonId(lessonId)
    lessonStorage.delete(lessonId)
    loadUnits()
  }
}

const showAddWordDialog = (lessonId) => {
  showAddWordDialogLessonId.value = lessonId
  newWordsText.value = ''
  newWordDifficulty.value = 2
}

const addWords = () => {
  if (showAddWordDialogLessonId.value && newWordsText.value.trim()) {
    const lines = newWordsText.value.split('\n').filter(line => line.trim())
    const words = lines.map(line => ({
      lessonId: showAddWordDialogLessonId.value,
      content: line.trim(),
      difficulty: newWordDifficulty.value
    }))
    wordStorage.addBatch(words)
    newWordsText.value = ''
    showAddWordDialogLessonId.value = null
    loadUnits()
  }
}

const deleteWord = (wordId) => {
  if (confirm('确定要删除此词语吗？')) {
    wordStorage.delete(wordId)
    loadUnits()
  }
}

onMounted(() => {
  loadUnits()
})
</script>

<style scoped>
.wordbook-view {
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

.filter-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.filter-bar label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-bar select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.btn-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #f093fb;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-small:hover {
  background: #f5576c;
}

.btn-danger {
  background: #ff6b6b;
}

.btn-danger:hover {
  background: #ee5a5a;
}

.btn-mini {
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
}

.units-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.unit-item {
  border: 2px solid #f093fb;
  border-radius: 12px;
  padding: 1rem;
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.unit-header h3 {
  color: #f5576c;
  margin: 0;
}

.unit-actions {
  display: flex;
  gap: 0.5rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-item {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.lesson-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  flex-wrap: wrap;
}

.toggle-icon {
  color: #f5576c;
  font-size: 0.8rem;
}

.lesson-header h4 {
  margin: 0;
  flex: 1;
}

.word-count {
  color: #888;
  font-size: 0.9rem;
}

.lesson-actions {
  display: flex;
  gap: 0.5rem;
}

.words-list {
  padding: 1rem;
  border-top: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.word-item {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.word-content {
  font-weight: 600;
  color: #333;
}

.word-pinyin {
  color: #888;
  font-size: 0.9rem;
}

.word-difficulty {
  font-size: 0.8rem;
  color: #f5576c;
  background: #fff0f0;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
}

.empty-message {
  color: #888;
  text-align: center;
  padding: 2rem;
  width: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  min-width: 400px;
  max-width: 90%;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #f5576c;
}

.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.modal textarea {
  min-height: 120px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-actions button {
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
</style>
