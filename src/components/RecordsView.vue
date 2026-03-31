<template>
  <div class="records-view">
    <div class="card">
      <h2>📊 听写记录</h2>

      <div v-if="records.length === 0" class="empty-state">
        <p class="empty-icon">📝</p>
        <p>还没有听写记录</p>
        <p class="empty-hint">快去开始听写吧！</p>
      </div>

      <div v-else class="records-list">
        <div v-for="record in sortedRecords" :key="record.id" class="record-item">
          <div class="record-header">
            <div class="record-info">
              <p class="record-date">{{ formatDate(record.createdAt) }}</p>
              <p class="record-lessons">{{ getLessonsText(record.lessonId) }}</p>
            </div>
            <div class="record-stats">
              <span class="stat-badge">{{ record.settings?.wordCount || 0 }} 个词语</span>
              <span v-if="record.completedAt" class="stat-badge success">已完成</span>
              <span v-else class="stat-badge warning">未完成</span>
            </div>
          </div>

          <div class="record-details">
            <p><strong>基础间隔：</strong>{{ record.settings?.baseInterval || 0 }}秒</p>
            <p><strong>词语：</strong>{{ getWordsSummary(record.wordIds) }}</p>
            <p v-if="record.completedAt"><strong>完成时间：</strong>{{ formatDate(record.completedAt) }}</p>
          </div>

          <div class="record-actions">
            <button @click="retryDictation(record)" class="btn-small">
              再听一遍
            </button>
            <button @click="deleteRecord(record.id)" class="btn-small btn-danger">
              删除
            </button>
          </div>
        </div>
      </div>

      <div v-if="records.length > 0" class="records-footer">
        <button @click="clearAllRecords" class="btn-danger">
          清空所有记录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { recordStorage, wordStorage, lessonStorage } from '../utils/storage'

const emit = defineEmits(['retry-dictation'])

const records = ref(recordStorage.getAll())

const sortedRecords = computed(() => {
  return [...records.value].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLessonsText = (lessonIds) => {
  if (!lessonIds) return '未知课程'
  const ids = lessonIds.split(',')
  const lessons = lessonStorage.getAll()
  return ids
    .map(id => lessons.find(l => l.id === id))
    .filter(Boolean)
    .map(l => l.name)
    .join('、') || '未知课程'
}

const getWordsSummary = (wordIds) => {
  if (!wordIds || wordIds.length === 0) return '无词语'
  const words = wordStorage.getAll()
  const selectedWords = wordIds
    .map(id => words.find(w => w.id === id))
    .filter(Boolean)
  if (selectedWords.length <= 5) {
    return selectedWords.map(w => w.content).join('、')
  } else {
    return selectedWords.slice(0, 5).map(w => w.content).join('、') + ` 等${selectedWords.length}个`
  }
}

const deleteRecord = (id) => {
  if (confirm('确定要删除这条记录吗？')) {
    const allRecords = recordStorage.getAll().filter(r => r.id !== id)
    localStorage.setItem('tingxie_records', JSON.stringify(allRecords))
    records.value = recordStorage.getAll()
  }
}

const clearAllRecords = () => {
  if (confirm('确定要清空所有听写记录吗？此操作不可恢复。')) {
    localStorage.setItem('tingxie_records', JSON.stringify([]))
    records.value = []
  }
}

const retryDictation = (record) => {
  // 发送事件给父组件，请求跳转到听写页面
  emit('retry-dictation', record)
}
</script>

<style scoped>
.records-view {
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-hint {
  color: #aaa;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.record-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #f093fb;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.record-info {
  flex: 1;
}

.record-date {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.record-lessons {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.record-stats {
  display: flex;
  gap: 0.5rem;
}

.stat-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  background: #e9ecef;
  color: #495057;
}

.stat-badge.success {
  background: #d4edda;
  color: #155724;
}

.stat-badge.warning {
  background: #fff3cd;
  color: #856404;
}

.record-details {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.record-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.record-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #f093fb;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
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

.records-footer {
  text-align: right;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
</style>
