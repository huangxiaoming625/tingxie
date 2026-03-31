// 图像处理器 - 简化版本
// 实际项目中应该使用 Tesseract.js 或云端 OCR API

/**
 * 图像处理工具类
 */
export class ImageProcessor {
  /**
   * 从图片中识别红色/蓝色荧光笔标记的词语
   * @param {File|string} image - 图片文件或 URL
   * @returns {Promise<string[]>} 识别到的词语列表
   */
  async recognizeWordsFromImage(image) {
    // 简化实现：模拟识别过程
    return new Promise((resolve, reject) => {
      // 模拟图像处理延迟
      setTimeout(() => {
        // 这里应该是复杂的 OCR 识别逻辑
        // 包括：
        // 1. 图像预处理（去噪、增强对比度）
        // 2. 颜色区域检测（红色/蓝色荧光笔）
        // 3. 文字识别（OCR）
        // 4. 词语提取

        // 模拟识别结果
        const mockResults = [
          '春天',
          '冬天',
          '花朵',
          '飞鸟',
          '风雨'
        ]

        console.log('模拟识别完成，结果:', mockResults)
        resolve(mockResults)
      }, 2000)
    })
  }

  /**
   * 读取图片文件到 base64
   * @param {File} file - 图片文件
   * @returns {Promise<string>} base64 编码的图片
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * 图片压缩和优化
   * @param {string} imageDataUrl - 原始图片 data URL
   * @param {number} [maxWidth=800] - 最大宽度
   * @param {number} [quality=0.8] - 质量
   * @returns {Promise<string>} 优化后的图片
   */
  async optimizeImage(imageDataUrl, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = imageDataUrl
    })
  }

  /**
   * 检测图像中的颜色区域
   * @param {HTMLImageElement} img - 图片对象
   * @param {string[]} targetColors - 目标颜色（hex格式）
   * @param {number} tolerance - 颜色容差
   * @returns {Object[]} 检测到的区域
   */
  detectColorRegions(img, targetColors = ['#FF0000', '#0000FF'], tolerance = 30) {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const regions = []

    // 颜色检测逻辑简化处理
    // 实际项目中应该使用更复杂的区域检测算法
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      for (const color of targetColors) {
        const [tr, tg, tb] = this.hexToRgb(color)
        if (this.colorMatch(r, g, b, tr, tg, tb, tolerance)) {
          const x = (i / 4) % canvas.width
          const y = Math.floor((i / 4) / canvas.width)

          // 简化：只记录位置，不进行区域合并
          regions.push({ x, y, color })
          break
        }
      }
    }

    return regions
  }

  /**
   * 颜色匹配检测
   */
  colorMatch(r, g, b, tr, tg, tb, tolerance) {
    const rDiff = Math.abs(r - tr)
    const gDiff = Math.abs(g - tg)
    const bDiff = Math.abs(b - tb)

    return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance
  }

  /**
   * 十六进制颜色转 RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }
}

export const imageProcessor = new ImageProcessor()
