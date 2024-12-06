import { RedeemCodeData } from '../types';

export function renderStatusSvg(data: RedeemCodeData): string {
    const totalCodes = data.codes.length;
    const redeemedCodes = data.codes.filter(code => code.isRedeemed).length;
    const percentage = Math.round((redeemedCodes / totalCodes) * 100);
    
    // 根据进度选择颜色
    const getProgressColor = (percent: number) => {
      if (percent === 100) return '#9CA3AF'; // 全部兑换 - 灰色
      if (percent >= 50) return '#F97316';   // 一半以上 - 橙色
      return '#22C55E';                      // 开始兑换 - 绿色
    };
    
    // 计算文本宽度
    const leftText = data.title;
    const rightText = `${totalCodes - redeemedCodes}/${totalCodes}`;
    const leftWidth = leftText.length * 7 + 10; // 估算左侧文本宽度
    const rightWidth = rightText.length * 7 + 10; // 估算右侧文本宽度
    const totalWidth = leftWidth + rightWidth;
    
    // 获取当前进度的颜色
    const progressColor = getProgressColor(percentage);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="${totalWidth}" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <linearGradient id="smooth" x2="0" y2="100%">
          <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
          <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
  
        <!-- 左侧背景 -->
        <rect rx="3" width="${leftWidth}" height="20" fill="#555"/>
        <!-- 右侧背景 -->
        <rect rx="3" x="${leftWidth}" width="${rightWidth}" height="20" fill="${progressColor}"/>
        <!-- 连接处理 -->
        <rect x="${leftWidth}" width="4" height="20" fill="${progressColor}"/>
        <!-- 渐变覆盖 -->
        <rect rx="3" width="${totalWidth}" height="20" fill="url(#smooth)"/>
        
        <!-- 文本 -->
        <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
          <text x="${leftWidth/2}" y="15" fill="#010101" fill-opacity=".3">${leftText}</text>
          <text x="${leftWidth/2}" y="14">${leftText}</text>
          <text x="${leftWidth + rightWidth/2}" y="15" fill="#010101" fill-opacity=".3">${rightText}</text>
          <text x="${leftWidth + rightWidth/2}" y="14">${rightText}</text>
        </g>
      </svg>`;
  }