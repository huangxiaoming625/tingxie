// 数据验证工具函数
function validateUnit(unit) {
  return unit && typeof unit.name === 'string' && unit.name.trim() !== '' &&
    typeof unit.grade === 'number' && unit.grade >= 1 && unit.grade <= 6 &&
    (unit.semester === 1 || unit.semester === 2) &&
    typeof unit.order === 'number' && unit.order > 0
}

function validateLesson(lesson) {
  return lesson && typeof lesson.unitId === 'string' && lesson.unitId.trim() !== '' &&
    typeof lesson.name === 'string' && lesson.name.trim() !== '' &&
    typeof lesson.order === 'number' && lesson.order > 0
}

function validateWord(word) {
  return word && typeof word.lessonId === 'string' && word.lessonId.trim() !== '' &&
    typeof word.content === 'string' && word.content.trim() !== '' &&
    (word.difficulty >= 1 && word.difficulty <= 5)
}

function validateRecord(record) {
  return record && (typeof record.lessonId === 'string' || Array.isArray(record.lessonId)) &&
    Array.isArray(record.wordIds) && record.wordIds.length > 0 &&
    record.settings && typeof record.settings.wordCount === 'number' &&
    typeof record.settings.baseInterval === 'number'
}

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
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取数据失败:', key, error)
    alert('获取数据失败，请检查浏览器存储权限')
    return []
  }
}

/**
 * 保存数据到localStorage
 */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('保存数据失败:', key, error)
    alert('存储失败，请检查浏览器存储权限')
    return false
  }
}

// 单元管理
export const unitStorage = {
  getAll() {
    return getData(DB_KEYS.UNITS)
  },

  add(unit) {
    if (!validateUnit(unit)) {
      console.error('单元数据验证失败:', unit)
      alert('单元数据格式不正确')
      return null
    }

    const units = this.getAll()
    const newUnit = {
      ...unit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    units.push(newUnit)
    if (saveData(DB_KEYS.UNITS, units)) {
      return newUnit
    }
    return null
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
      if (saveData(DB_KEYS.UNITS, units)) {
        return units[index]
      }
    }
    return null
  },

  delete(id) {
    const units = this.getAll().filter(u => u.id !== id)
    return saveData(DB_KEYS.UNITS, units)
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
    if (!validateLesson(lesson)) {
      console.error('课程数据验证失败:', lesson)
      alert('课程数据格式不正确')
      return null
    }

    const lessons = this.getAll()
    const newLesson = {
      ...lesson,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    lessons.push(newLesson)
    if (saveData(DB_KEYS.LESSONS, lessons)) {
      return newLesson
    }
    return null
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
      if (saveData(DB_KEYS.LESSONS, lessons)) {
        return lessons[index]
      }
    }
    return null
  },

  delete(id) {
    const lessons = this.getAll().filter(l => l.id !== id)
    return saveData(DB_KEYS.LESSONS, lessons)
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
    if (!validateWord(word)) {
      console.error('词语数据验证失败:', word)
      alert('词语数据格式不正确')
      return null
    }

    const words = this.getAll()
    const newWord = {
      ...word,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    words.push(newWord)
    if (saveData(DB_KEYS.WORDS, words)) {
      return newWord
    }
    return null
  },

  addBatch(wordList) {
    const validWords = wordList.filter(word => {
      if (!validateWord(word)) {
        console.error('词语数据验证失败:', word)
        return false
      }
      return true
    })

    if (validWords.length === 0) {
      alert('没有有效的词语数据')
      return []
    }

    const words = this.getAll()
    const newWords = validWords.map(word => ({
      ...word,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    words.push(...newWords)
    if (saveData(DB_KEYS.WORDS, words)) {
      if (validWords.length < wordList.length) {
        alert(`部分词语验证失败，已添加 ${validWords.length} 个词语`)
      }
      return newWords
    }
    return []
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
      if (saveData(DB_KEYS.WORDS, words)) {
        return words[index]
      }
    }
    return null
  },

  delete(id) {
    const words = this.getAll().filter(w => w.id !== id)
    return saveData(DB_KEYS.WORDS, words)
  },

  deleteByLessonId(lessonId) {
    const words = this.getAll().filter(w => w.lessonId !== lessonId)
    return saveData(DB_KEYS.WORDS, words)
  }
}

// 听写记录管理
export const recordStorage = {
  getAll() {
    return getData(DB_KEYS.RECORDS)
  },

  add(record) {
    if (!validateRecord(record)) {
      console.error('听写记录数据验证失败:', record)
      alert('听写记录数据格式不正确')
      return null
    }

    const records = this.getAll()
    const newRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    records.push(newRecord)
    if (saveData(DB_KEYS.RECORDS, records)) {
      return newRecord
    }
    return null
  },

  update(id, updates) {
    const records = this.getAll()
    const index = records.findIndex(r => r.id === id)
    if (index !== -1) {
      records[index] = {
        ...records[index],
        ...updates
      }
      if (saveData(DB_KEYS.RECORDS, records)) {
        return records[index]
      }
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
