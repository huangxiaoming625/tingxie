// 数据类型定义

/**
 * @typedef {Object} Unit
 * @property {string} id - 单元ID
 * @property {string} name - 单元名称
 * @property {number} grade - 年级
 * @property {1|2} semester - 学期
 * @property {number} order - 排序
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id - 课程ID
 * @property {string} unitId - 所属单元ID
 * @property {string} name - 课程名称
 * @property {number} order - 排序
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */

/**
 * @typedef {Object} Word
 * @property {string} id - 词语ID
 * @property {string} lessonId - 所属课程ID
 * @property {string} content - 词语内容
 * @property {string} [pinyin] - 拼音
 * @property {string} [meaning] - 释义
 * @property {1|2|3|4|5} difficulty - 难度等级
 * @property {string} [sourceImage] - 来源图片
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */

/**
 * @typedef {Object} DictationRecord
 * @property {string} id - 记录ID
 * @property {string} lessonId - 课程ID
 * @property {string[]} wordIds - 词语ID列表
 * @property {Object} settings - 听写设置
 * @property {number} settings.wordCount - 词语数量
 * @property {number} settings.baseInterval - 基础间隔（秒）
 * @property {Object[]} [results] - 听写结果
 * @property {string} results[].wordId - 词语ID
 * @property {boolean} results[].isCorrect - 是否正确
 * @property {Date} [completedAt] - 完成时间
 * @property {Date} createdAt - 创建时间
 */

/**
 * @typedef {Object} AppState
 * @property {Unit[]} units - 单元列表
 * @property {Lesson[]} lessons - 课程列表
 * @property {Word[]} words - 词语列表
 * @property {DictationRecord[]} records - 听写记录
 */
