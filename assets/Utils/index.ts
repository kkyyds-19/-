/**
 * 常用工具方法
 * - createUINode：创建默认锚点与 UI 图层的节点
 * - randomByRange：返回指定区间的随机整数
 * - randomByLen：生成指定长度的随机数字字符串
 */
import { Layers, Node, SpriteFrame, UITransform } from 'cc'

/**
 * 创建一个 UI 节点：锚点 (0,1)，图层为 UI_2D
 * @param name 节点名称
 */
export const createUINode = (name = '') => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')

  return node
}

/**
 * 生成指定长度的随机数字字符串
 * @param len 指定的字符串长度
 * @returns 包含随机数字的字符串
 * @example randomByLen(4) -> "5821"
 */
export const randomByLen = (len: number) =>
  Array.from({ length: len }).reduce<string>((total: string) => total + Math.floor(Math.random() * 10), '')

/**
 * 返回 [start, end) 区间内的随机整数
 */
export const randomByRange = (start: number, end: number) => {
  return Math.floor(start + (end - start) * Math.random())
}

const reg = /\((\d+)\)/
const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1] || '0')

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
  spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
