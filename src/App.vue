<template>
  <div id="app" class="app-container">
    <!-- 导航栏 -->
    <nav class="nav-bar">
      <h1 class="app-title">📚 小学语文听写</h1>
      <div class="nav-actions">
        <button @click="switchTab('wordbook')" :class="{ active: currentTab === 'wordbook' }">
          词语库
        </button>
        <button @click="switchTab('add')" :class="{ active: currentTab === 'add' }">
          添加词语
        </button>
        <button @click="switchTab('dictation')" :class="{ active: currentTab === 'dictation' }">
          开始听写
        </button>
        <button @click="switchTab('records')" :class="{ active: currentTab === 'records' }">
          听写记录
        </button>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <WordBookView v-if="currentTab === 'wordbook'" />
      <AddWordsView v-if="currentTab === 'add'" />
      <DictationView v-if="currentTab === 'dictation'" :retry-record="retryRecord" />
      <RecordsView v-if="currentTab === 'records'" @retry-dictation="handleRetryDictation" />
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer">
      <p>&copy; 2026 小学语文听写助手</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WordBookView from './components/WordBookView.vue'
import AddWordsView from './components/AddWordsView.vue'
import DictationView from './components/DictationView.vue'
import RecordsView from './components/RecordsView.vue'

const currentTab = ref('wordbook')
const retryRecord = ref(null)

const switchTab = (tab) => {
  currentTab.value = tab
}

const handleRetryDictation = (record) => {
  retryRecord.value = record
  switchTab('dictation')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #333;
}

.nav-bar {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #f5576c;
  text-align: center;
}

.nav-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-actions button {
  padding: 0.75rem 1.5rem;
  background: #f093fb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.nav-actions button:hover {
  background: #f5576c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-actions button.active {
  background: #f5576c;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer {
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  text-align: center;
  color: #666;
  margin-top: auto;
}
</style>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
