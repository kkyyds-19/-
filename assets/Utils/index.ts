/**
 * 常用工具方法
 * - createUINode：创建默认锚点与 UI 图层的节点
 * - randomByRange：返回指定区间的随机整数
 */
import {Layers, Node, UITransform } from 'cc';

/**
 * 创建一个 UI 节点：锚点 (0,1)，图层为 UI_2D
 * @param name 节点名称
 */
export const createUINode = (name:string='') =>{
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0,1)
   node.layer = 1 << Layers.nameToLayer('UI_2D')

  return node

}

/**
 * 返回 [start, end) 区间内的随机整数
 */
export const randomByRange = (start:number,end:number)=>{
  return Math.floor(start + (end - start) * Math.random()) 
}
