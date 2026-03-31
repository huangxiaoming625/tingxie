// 文字转语音 (TTS) 工具类

/**
 * 文字转语音引擎
 */
export class TTS {
  constructor() {
    this.synth = window.speechSynthesis
    this.voices = []
    this.init()
  }

  /**
   * 初始化语音引擎
   */
  init() {
    // 预加载语音列表
    if (this.synth.getVoices().length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices()
      }
    } else {
      this.voices = this.synth.getVoices()
    }
  }

  /**
   * 获取可用的语音列表
   */
  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.includes('zh'))
  }

  /**
   * 播报文本
   * @param {string} text - 要播报的文本
   * @param {Object} options - 配置选项
   * @param {number} [options.rate=1] - 语速 (0.1-10)
   * @param {number} [options.pitch=1] - 音高 (0-2)
   * @param {number} [options.volume=1] - 音量 (0-1)
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // 取消当前正在播放的语音
      this.synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // 配置参数
      utterance.lang = 'zh-CN'
      utterance.rate = options.rate || 0.9  // 稍微慢一点，适合小学生
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      // 查找中文语音
      const chineseVoices = this.voices.filter(voice => voice.lang === 'zh-CN')
      if (chineseVoices.length > 0) {
        utterance.voice = chineseVoices[0]
      }

      // 事件处理
      utterance.onend = () => {
        resolve()
      }

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.synth.speak(utterance)
    })
  }

  /**
   * 停止当前语音
   */
  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  /**
   * 检查浏览器支持情况
   */
  static isSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  }
}

/**
 * 创建单例实例
 */
export const tts = new TTS()
