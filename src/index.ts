/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { renderHomePage, renderCreatePage, renderViewPage } from './templates';
import { RedeemCodeData, Env } from './types';

function generateRandomId(): string {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 检查 IP 限制的函数
async function checkIPLimit(env: Env, ip: string, action: 'create' | 'redeem'): Promise<boolean> {
	const key = `limit:${action}:${ip}`;
	const lastAction = await env.CODES_KV.get(key);
	
	if (lastAction) {
		const lastTime = parseInt(lastAction);
		const now = Date.now();
		// 检查是否在 5 分钟内
		if (now - lastTime < 5 * 60 * 1000) {
			return false;
		}
	}
	
	// 更新最后操作时间
	await env.CODES_KV.put(key, Date.now().toString(), { expirationTtl: 300 }); // 5分钟后自动过期
	return true;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname;

	// 调试路由 - KV 数据管理
	if (path.startsWith('/_debug/kv')) {
		try {
			// 列出所有 KV 数据
			if (path === '/_debug/kv' && request.method === 'GET') {
				const list = await env.CODES_KV.list();
				const allData = [];
				
				for (const key of list.keys) {
					const value = await env.CODES_KV.get(key.name);
					allData.push({
						key: key.name,
						value: value ? JSON.parse(value) : null,
						metadata: key.metadata,
						expiration: key.expiration
					});
				}

				return new Response(`
					<!DOCTYPE html>
					<html>
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>KV Debug Console</title>
							<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
							<style>
								:root {
									--primary: #0ea5e9;
									--primary-dark: #0284c7;
									--danger: #ef4444;
									--danger-dark: #dc2626;
									--success: #22c55e;
									--background: #f8fafc;
									--surface: #ffffff;
									--text: #0f172a;
									--text-secondary: #64748b;
									--border: #e2e8f0;
								}

								* {
									margin: 0;
									padding: 0;
									box-sizing: border-box;
								}

								body {
									font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
									background: var(--background);
									color: var(--text);
									line-height: 1.5;
								}

								.header {
									background: var(--surface);
									border-bottom: 1px solid var(--border);
									padding: 1.5rem;
									position: sticky;
									top: 0;
									z-index: 10;
								}

								.container {
									max-width: 1200px;
									margin: 0 auto;
									padding: 2rem;
								}

								.header-content {
									max-width: 1200px;
									margin: 0 auto;
									display: flex;
									justify-content: space-between;
									align-items: center;
								}

								h1 {
									font-size: 1.5rem;
									font-weight: 600;
									color: var(--text);
								}

								.stats {
									font-size: 0.875rem;
									color: var(--text-secondary);
								}

								.card {
									background: var(--surface);
									border-radius: 1rem;
									box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
									margin-bottom: 1.5rem;
									overflow: hidden;
									transition: all 0.2s ease;
								}

								.card:hover {
									box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
									transform: translateY(-2px);
								}

								.card-header {
									padding: 1.25rem;
									border-bottom: 1px solid var(--border);
									display: flex;
									justify-content: space-between;
									align-items: center;
								}

								.key-name {
									font-weight: 500;
									color: var(--primary);
									display: flex;
									align-items: center;
									gap: 0.5rem;
								}

								.key-badge {
									background: #f0f9ff;
									color: var(--primary);
									padding: 0.25rem 0.5rem;
									border-radius: 0.375rem;
									font-size: 0.75rem;
									font-weight: 500;
								}

								.card-content {
									padding: 1.25rem;
								}

								.meta-info {
									display: flex;
									gap: 1rem;
									margin-bottom: 1rem;
									font-size: 0.875rem;
									color: var(--text-secondary);
								}

								.meta-item {
									display: flex;
									align-items: center;
									gap: 0.25rem;
								}

								pre {
									background: #f8fafc;
									padding: 1rem;
									border-radius: 0.5rem;
									overflow-x: auto;
									font-size: 0.875rem;
									line-height: 1.7;
									border: 1px solid var(--border);
								}

								code {
									font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
								}

								.actions {
									display: flex;
									gap: 0.5rem;
								}

								button {
									padding: 0.5rem 1rem;
									border-radius: 0.5rem;
									border: none;
									font-size: 0.875rem;
									font-weight: 500;
									cursor: pointer;
									transition: all 0.15s ease;
									display: inline-flex;
									align-items: center;
									gap: 0.5rem;
								}

								.btn-primary {
									background: var(--primary);
									color: white;
								}

								.btn-primary:hover {
									background: var(--primary-dark);
								}

								.btn-danger {
									background: var(--danger);
									color: white;
								}

								.btn-danger:hover {
									background: var(--danger-dark);
								}

								.empty-state {
									text-align: center;
									padding: 4rem 2rem;
									color: var(--text-secondary);
								}

								.toast {
									position: fixed;
									bottom: 2rem;
									right: 2rem;
									padding: 1rem 1.5rem;
									border-radius: 0.75rem;
									color: white;
									font-weight: 500;
									box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
									display: none;
									animation: slideIn 0.2s ease;
									z-index: 50;
								}

								.toast.success {
									background: var(--success);
								}

								.toast.error {
									background: var(--danger);
								}

								@keyframes slideIn {
									from {
										transform: translateY(1rem);
										opacity: 0;
									}
									to {
										transform: translateY(0);
										opacity: 1;
									}
								}

								@media (max-width: 640px) {
									.container {
										padding: 1rem;
									}

									.header {
										padding: 1rem;
									}

									.card-header {
										flex-direction: column;
										align-items: flex-start;
										gap: 0.75rem;
									}

									.actions {
										width: 100%;
										justify-content: flex-end;
									}
								}
							</style>
						</head>
						<body>
							<header class="header">
								<div class="header-content">
									<h1>KV Debug Console</h1>
									<div class="stats">
										Total Keys: ${allData.length}
									</div>
								</div>
							</header>

							<div class="container">
								${allData.length === 0 ? `
									<div class="empty-state">
										<p>No KV data available</p>
									</div>
								` : allData.map(item => `
									<div class="card">
										<div class="card-header">
											<div class="key-name">
												${item.key}
												<span class="key-badge">KV</span>
											</div>
											<div class="actions">
												<button class="btn-primary" onclick="copyToClipboard('${item.key}')">
													Copy Key
												</button>
												<button class="btn-danger" onclick="deleteKey('${item.key}')">
													Delete
												</button>
											</div>
										</div>
										<div class="card-content">
											<div class="meta-info">
												${item.expiration ? `
													<div class="meta-item">
														Expires: ${new Date(item.expiration * 1000).toLocaleString()}
													</div>
												` : ''}
												<div class="meta-item">
													Size: ${JSON.stringify(item.value).length} bytes
												</div>
											</div>
											<pre><code>${JSON.stringify(item.value, null, 2)}</code></pre>
										</div>
									</div>
								`).join('')}
							</div>

							<div id="toast" class="toast"></div>

							<script>
								async function deleteKey(key) {
									if (!confirm('确定要删除这个键吗？')) return;
									
									try {
										const response = await fetch('/_debug/kv/' + encodeURIComponent(key), {
											method: 'DELETE'
										});
										
										if (response.ok) {
											showToast('删除成功', 'success');
											setTimeout(() => location.reload(), 1000);
										} else {
											const error = await response.text();
											showToast('删除失败: ' + error, 'error');
										}
									} catch (error) {
										showToast('操作失败: ' + error, 'error');
									}
								}

								async function copyToClipboard(text) {
									try {
										await navigator.clipboard.writeText(text);
										showToast('已复制到剪贴板', 'success');
									} catch (error) {
										showToast('复制失败', 'error');
									}
								}

								function showToast(message, type = 'success') {
									const toast = document.getElementById('toast');
									toast.textContent = message;
									toast.className = 'toast ' + type;
									toast.style.display = 'block';
									
									setTimeout(() => {
										toast.style.display = 'none';
									}, 3000);
								}
							</script>
						</body>
					</html>
				`, {
					headers: { 'Content-Type': 'text/html;charset=UTF-8' }
				});
			}

			// 删除特定键
			if (path.startsWith('/_debug/kv/') && request.method === 'DELETE') {
				const key = decodeURIComponent(path.replace('/_debug/kv/', ''));
				await env.CODES_KV.delete(key);
				return new Response('Key deleted successfully', {
					headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
				});
			}

			// 获取特定键的数据
			if (path.startsWith('/_debug/kv/') && request.method === 'GET') {
				const key = decodeURIComponent(path.replace('/_debug/kv/', ''));
				const value = await env.CODES_KV.get(key);
				
				if (value === null) {
					return new Response(JSON.stringify({ error: 'Key not found' }), {
						status: 404,
						headers: { 'Content-Type': 'application/json' }
					});
				}

				return new Response(JSON.stringify({
					key,
					value: JSON.parse(value)
				}, null, 2), {
					headers: { 'Content-Type': 'application/json' }
				});
			}
		} catch (error) {
			console.error('KV debug error:', error);
			return new Response(JSON.stringify({ 
				error: 'Error accessing KV',
				details: error.message 
			}), { 
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	// 获取用户 IP
	const ip = request.headers.get('cf-connecting-ip') || 
		request.headers.get('x-real-ip') || 
		'0.0.0.0';

	// 首页路由
	if (path === '/' && request.method === 'GET') {
		return new Response(renderHomePage(), {
			headers: { 'Content-Type': 'text/html' },
		});
	}

	// 创建页面路由
	if (path === '/create' && request.method === 'GET') {
		return new Response(renderCreatePage(), {
			headers: { 'Content-Type': 'text/html' },
		});
	}

	// 创建处理路由
	if (path === '/create' && request.method === 'POST') {
		try {
			// 检查 IP 限制
			if (!await checkIPLimit(env, ip, 'create')) {
				return new Response('操作太频繁，请等待5分钟后再试', { 
					status: 429,
					headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
				});
			}

			const formData = await request.formData();
			const title = formData.get('title')?.toString() || '';
			const description = formData.get('description')?.toString() || '';
			const codesText = formData.get('codes')?.toString() || '';
			
			if (!title || !codesText) {
				return new Response('标题和兑换码不能为空', { 
					status: 400,
					headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
				});
			}
			
			const codes = codesText
				.split('\n')
				.filter(code => code.trim())
				.map(code => ({
					code: code.trim(),
					isRedeemed: false
				}));
			
			const urlId = generateRandomId();
			const data: RedeemCodeData = {
				title,
				description,
				codes,
				createdAt: Date.now(),
				createdBy: ip // 记录创建者IP
			};
			
			await env.CODES_KV.put(urlId, JSON.stringify(data));
			
			const redirectUrl = new URL(`/${urlId}`, request.url).toString();
			return new Response(null, {
				status: 302,
				headers: {
					'Location': redirectUrl,
					'Content-Type': 'text/plain;charset=UTF-8'
				}
			});
		} catch (error) {
			console.error('Create error:', error);
			return new Response('处理请求时出错', { 
				status: 500,
				headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
			});
		}
	}

	// 兑换处��路由
	if (path.endsWith('/redeem') && request.method === 'POST') {
		try {
			// 检查 IP 限制
			if (!await checkIPLimit(env, ip, 'redeem')) {
				return new Response('操作太频繁，请等待5分钟后再试', { 
					status: 429,
					headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
				});
			}

			const id = path.split('/')[1];
			const data = await env.CODES_KV.get(id);
			if (!data) {
				return new Response('Not Found', { status: 404 });
			}
			
			const codeData: RedeemCodeData = JSON.parse(data);
			const body = await request.json();
			const index = body.index;
			
			if (index >= 0 && index < codeData.codes.length) {
				codeData.codes[index].isRedeemed = true;
				codeData.codes[index].redeemedBy = ip; // 记录兑换者IP
				codeData.codes[index].redeemedAt = Date.now(); // 记录兑换时间
				await env.CODES_KV.put(id, JSON.stringify(codeData));
				return new Response('OK');
			}
			
			return new Response('Invalid Index', { status: 400 });
		} catch (error) {
			return new Response('Error processing request', { status: 500 });
		}
	}

	// 查看页面路由
	if (path.length > 1 && request.method === 'GET') {
		try {
			const id = path.slice(1);
			const data = await env.CODES_KV.get(id);
			if (!data) {
				return new Response('Not Found', { status: 404 });
			}
			
			return new Response(renderViewPage(id, JSON.parse(data)), {
				headers: { 'Content-Type': 'text/html' },
			});
		} catch (error) {
			return new Response('Error processing request', { status: 500 });
		}
	}

	// 404 处理
	return new Response('Not Found', { status: 404 });
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleRequest(request, env);
	}
};
