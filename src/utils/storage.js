// 本地存储工具类 - 使用 localStorage 简化实现

const DB_KEYS = {
  UNITS: 'tingxie_units',
  LESSONS: 'tingxie_lessons',
  WORDS: 'tingxie_words',
  RECORDS: 'tingxie_records'
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 从localStorage获取数据
 */
function getData(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

/**
 * 保存数据到localStorage
 */
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// 单元管理
export const unitStorage = {
  getAll() {
    return getData(DB_KEYS.UNITS)
  },

  add(unit) {
    const units = this.getAll()
    const newUnit = {
      ...unit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    units.push(newUnit)
    saveData(DB_KEYS.UNITS, units)
    return newUnit
  },

  update(id, updates) {
    const units = this.getAll()
    const index = units.findIndex(u => u.id === id)
    if (index !== -1) {
      units[index] = {
        ...units[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveData(DB_KEYS.UNITS, units)
      return units[index]
    }
    return null
  },

  delete(id) {
    const units = this.getAll().filter(u => u.id !== id)
    saveData(DB_KEYS.UNITS, units)
  },

  getByGradeAndSemester(grade, semester) {
    return this.getAll().filter(u => u.grade === grade && u.semester === semester)
  }
}

// 课程管理
export const lessonStorage = {
  getAll() {
    return getData(DB_KEYS.LESSONS)
  },

  getByUnitId(unitId) {
    return this.getAll().filter(l => l.unitId === unitId)
  },

  add(lesson) {
    const lessons = this.getAll()
    const newLesson = {
      ...lesson,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    lessons.push(newLesson)
    saveData(DB_KEYS.LESSONS, lessons)
    return newLesson
  },

  update(id, updates) {
    const lessons = this.getAll()
    const index = lessons.findIndex(l => l.id === id)
    if (index !== -1) {
      lessons[index] = {
        ...lessons[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveData(DB_KEYS.LESSONS, lessons)
      return lessons[index]
    }
    return null
  },

  delete(id) {
    const lessons = this.getAll().filter(l => l.id !== id)
    saveData(DB_KEYS.LESSONS, lessons)
  }
}

// 词语管理
export const wordStorage = {
  getAll() {
    return getData(DB_KEYS.WORDS)
  },

  getByLessonId(lessonId) {
    return this.getAll().filter(w => w.lessonId === lessonId)
  },

  add(word) {
    const words = this.getAll()
    const newWord = {
      ...word,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    words.push(newWord)
    saveData(DB_KEYS.WORDS, words)
    return newWord
  },

  addBatch(wordList) {
    const words = this.getAll()
    const newWords = wordList.map(word => ({
      ...word,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    words.push(...newWords)
    saveData(DB_KEYS.WORDS, words)
    return newWords
  },

  update(id, updates) {
    const words = this.getAll()
    const index = words.findIndex(w => w.id === id)
    if (index !== -1) {
      words[index] = {
        ...words[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveData(DB_KEYS.WORDS, words)
      return words[index]
    }
    return null
  },

  delete(id) {
    const words = this.getAll().filter(w => w.id !== id)
    saveData(DB_KEYS.WORDS, words)
  },

  deleteByLessonId(lessonId) {
    const words = this.getAll().filter(w => w.lessonId !== lessonId)
    saveData(DB_KEYS.WORDS, words)
  }
}

// 听写记录管理
export const recordStorage = {
  getAll() {
    return getData(DB_KEYS.RECORDS)
  },

  add(record) {
    const records = this.getAll()
    const newRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    records.push(newRecord)
    saveData(DB_KEYS.RECORDS, records)
    return newRecord
  },

  update(id, updates) {
    const records = this.getAll()
    const index = records.findIndex(r => r.id === id)
    if (index !== -1) {
      records[index] = {
        ...records[index],
        ...updates
      }
      saveData(DB_KEYS.RECORDS, records)
      return records[index]
    }
    return null
  }
}

// 初始化示例数据
export function initSampleData() {
  const units = unitStorage.getAll()
  if (units.length === 0) {
    // 添加示例单元
    const unit1 = unitStorage.add({
      name: '第一单元',
      grade: 1,
      semester: 1,
      order: 1
    })

    const unit2 = unitStorage.add({
      name: '第二单元',
      grade: 1,
      semester: 1,
      order: 2
    })

    // 添加示例课程
    const lesson1 = lessonStorage.add({
      unitId: unit1.id,
      name: '《春夏秋冬》',
      order: 1
    })

    const lesson2 = lessonStorage.add({
      unitId: unit1.id,
      name: '《姓氏歌》',
      order: 2
    })

    const lesson3 = lessonStorage.add({
      unitId: unit2.id,
      name: '《小青蛙》',
      order: 1
    })

    // 添加示例词语
    wordStorage.addBatch([
      { lessonId: lesson1.id, content: '春天', difficulty: 1 },
      { lessonId: lesson1.id, content: '冬天', difficulty: 1 },
      { lessonId: lesson1.id, content: '花朵', difficulty: 2 },
      { lessonId: lesson1.id, content: '飞鸟', difficulty: 2 },
      { lessonId: lesson1.id, content: '风雨', difficulty: 3 },
      { lessonId: lesson2.id, content: '姓氏', difficulty: 3 },
      { lessonId: lesson2.id, content: '什么', difficulty: 2 },
      { lessonId: lesson2.id, content: '双手', difficulty: 2 },
      { lessonId: lesson2.id, content: '中国', difficulty: 3 },
      { lessonId: lesson3.id, content: '青蛙', difficulty: 3 },
      { lessonId: lesson3.id, content: '天气', difficulty: 2 },
      { lessonId: lesson3.id, content: '眼睛', difficulty: 3 },
      { lessonId: lesson3.id, content: '生病', difficulty: 4 },
      { lessonId: lesson3.id, content: '害虫', difficulty: 4 }
    ])
  }
}
