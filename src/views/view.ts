import { commonStyles } from './components/common-styles';
import { RedeemCodeData } from '../types';

export function renderViewPage(id: string, data: RedeemCodeData): string {
    // 生成随机码的函数
    const generateFakeCode = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array(length).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };
  
    // 简单加密真实的兑换码
    const encryptedCodes = data.codes.map(code => ({
      ...code,
      code: btoa(code.code) // 使用 base64 加密
    }));
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="icon" href="/favicon.ico" />
          <title>${data.title} - 兑换码</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            ${commonStyles}
  
            .code-list {
              display: grid;
              gap: 1rem;
            }
  
            .code-item {
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: 0.75rem;
              padding: 1rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
  
            .code-text {
              font-family: ui-monospace, monospace;
              filter: blur(5px);
              transition: filter 0.3s ease;
              user-select: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
            }
  
            .code-text.revealed {
              filter: blur(0);
              user-select: none;
            }
  
            .code-text.redeemed {
              text-decoration: line-through;
              opacity: 0.5;
              filter: none;
            }
  
            .description {
              color: var(--text-secondary);
              margin-bottom: 2rem;
            }
  
            .toast {
              position: fixed;
              bottom: 2rem;
              right: 2rem;
              padding: 1rem 1.5rem;
              border-radius: 0.75rem;
              background: var(--success);
              color: white;
              font-weight: 500;
              display: none;
              animation: slideIn 0.2s ease;
              z-index: 1000;
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
  
            .header-content {
              display: flex;
              align-items: center;
              gap: 1rem;
            }
  
            .status-badge {
              height: 20px;
              vertical-align: middle;
            }
  
            .share-button {
              background: none;
              border: none;
              cursor: pointer;
              padding: 0.5rem;
              color: var(--text-secondary);
            }
  
            .share-button:hover {
              color: var(--text);
            }
  
            .modal {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              align-items: center;
              justify-content: center;
            }
  
            .modal-content {
              background: var(--background);
              padding: 2rem;
              border-radius: 1rem;
              width: 90%;
              max-width: 500px;
            }
  
            .share-text {
              font-family: ui-monospace, monospace;
              background: var(--surface);
              padding: 1rem;
              border-radius: 0.5rem;
              margin: 1rem 0;
              white-space: pre-wrap;
            }
  
            .preview {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
  
            .preview img {
              display: inline-block;
              height: 20px;
              vertical-align: middle;
            }
  
            .markdown-text {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="container">
              <div class="header-content">
                <h1>${data.title}</h1>
                <button class="share-button" onclick="showShareModal()">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          <div class="container">
            <p class="description">${data.description.replace(/\n/g, '<br>')}</p>
  
            <div class="code-list">
              ${encryptedCodes.map((code, index) => `
                <div class="code-item" data-index="${index}" data-real="${code.code}">
                  <span class="code-text ${code.isRedeemed ? 'redeemed' : ''}">${generateFakeCode(12)}</span>
                  ${code.isRedeemed ? 
                    '<button class="btn" disabled>已兑换</button>' : 
                    `<button class="btn btn-primary" onclick="handleCode(${index})">显示</button>`
                  }
                </div>
              `).join('')}
            </div>
          </div>
  
          <div id="toast" class="toast"></div>
  
          <!-- 添加分享模态框 -->
          <div id="shareModal" class="modal">
            <div class="modal-content">
              <h2>分享链接</h2>
              <div class="share-text" id="shareText"></div>
              <button class="btn btn-primary" onclick="copyShareText()">复制（Markdown）</button>
              <button class="btn" onclick="closeShareModal()">关闭</button>
            </div>
          </div>
  
          <script>
            // 解密函数
            function decryptCode(encrypted) {
              try {
                return atob(encrypted);
              } catch (e) {
                return 'ERROR';
              }
            }
  
            async function handleCode(index) {
              try {
                const item = document.querySelector(\`[data-index="\${index}"]\`);
                const codeText = item.querySelector('.code-text');
                const button = item.querySelector('button');
                
                if (!codeText.classList.contains('revealed')) {
                  // 获取并解密真实的兑换码
                  const realCode = decryptCode(item.dataset.real);
                  codeText.textContent = realCode;
                  codeText.classList.add('revealed');
                  button.textContent = '复制';
                } else {
                  const code = codeText.textContent;
                  await navigator.clipboard.writeText(code);
                  
                  const response = await fetch(window.location.pathname + '/redeem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ index })
                  });
  
                  if (!response.ok) {
                    const errorText = await response.text();
                    showToast(errorText);
                    return;
                  }
  
                  button.textContent = '已复制';
                  button.disabled = true;
                  codeText.classList.add('redeemed');
                  showToast('码已复制并标记为已使用');
                }
              } catch (error) {
                showToast('操作失，后重试');
              }
            }
  
            // 每隔一段时间更新未显示的假码
            setInterval(() => {
              document.querySelectorAll('.code-text:not(.revealed):not(.redeemed)').forEach(el => {
                el.textContent = '${generateFakeCode(12)}';
              });
            }, 2000);
  
            function showToast(message) {
              const toast = document.getElementById('toast');
              toast.textContent = message;
              toast.style.display = 'block';
              
              setTimeout(() => {
                toast.style.display = 'none';
              }, 3000);
            }
  
            function showShareModal() {
              const modal = document.getElementById('shareModal');
              const shareText = document.getElementById('shareText');
              const currentUrl = window.location.href;
              const statusUrl = currentUrl + '/status';
              const altText = \`${data.title} 兑换状态\`;
              
              shareText.innerHTML = \`
                <div class="preview">
                  <div>兑换地址：\${currentUrl}</div>
                  <div>兑换状态：<img src="\${statusUrl}" alt="\${altText}" class="status-badge" /></div>
                </div>
                <div class="markdown-text">兑换地址：\${currentUrl}
兑换状态：![\${altText}](\${statusUrl})</div>
              \`;
              modal.style.display = 'flex';
            }
  
            function closeShareModal() {
              const modal = document.getElementById('shareModal');
              modal.style.display = 'none';
            }
  
            async function copyShareText() {
              const markdownText = document.querySelector('.markdown-text').textContent;
              await navigator.clipboard.writeText(markdownText);
              showToast('已复制到剪贴板');
            }
  
            // 点击模态框外部关闭
            window.onclick = function(event) {
              const modal = document.getElementById('shareModal');
              if (event.target === modal) {
                closeShareModal();
              }
            }
          </script>
        </body>
      </html>
    `;
  }