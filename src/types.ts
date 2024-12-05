import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 添加一个默认路由处理
router.get('*', () => {
  return new Response('Not Found', { status: 404 });
});

// 确保导出 fetch 处理函数并返回路由结果
export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx),
}; 

export interface RedeemCodeData {
  title: string;
  description: string;
  codes: {
    code: string;
    isRedeemed: boolean;
    redeemedBy?: string;
    redeemedAt?: number;
  }[];
  createdAt: number;
  createdBy: string;
}

export interface Env {
  CODES_KV: KVNamespace;
} 