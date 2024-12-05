const commonStyles = `
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
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    background: var(--surface);
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.15s ease;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-family: inherit;
    background: var(--surface);
    color: var(--text);
    transition: border-color 0.15s ease;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }
  }
`;

export function renderHomePage(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>兑换码分发系统</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          ${commonStyles}
          
          .hero {
            text-align: center;
            padding: 4rem 0;
          }

          .hero h1 {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text);
          }

          .hero p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
          }

          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
          }

          .feature-card {
            padding: 2rem;
            border-radius: 1rem;
            background: var(--surface);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .feature-card h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--text);
          }

          .feature-card p {
            color: var(--text-secondary);
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>兑换码分发系统</h1>
          </div>
        </div>
        
        <div class="container">
          <div class="hero">
            <h1>简单便捷的兑换码分发平台</h1>
            <p>轻创建和管理您的兑换码</p>
            <a href="/create" class="btn btn-primary">开始分发兑换码</a>
          </div>

          <div class="features">
            <div class="feature-card">
              <h3>便捷创建</h3>
              <p>快速批量创建兑换码，支持自定义描述和标题</p>
            </div>
            <div class="feature-card">
              <h3>安全可靠</h3>
              <p>兑换码默认隐藏，仅在需要时显示，避免泄露</p>
            </div>
            <div class="feature-card">
              <h3>实时追踪</h3>
              <p>实时监控兑换码使用情况，避免重复使用</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function renderCreatePage(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>创建兑换码</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          ${commonStyles}

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
          }

          .btn-back {
            color: var(--text-secondary);
            text-decoration: none;
          }

          .btn-back:hover {
            color: var(--text);
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>创建兑换码</h1>
          </div>
        </div>

        <div class="container">
          <div class="card">
            <form method="POST">
              <div class="form-group">
                <label for="title">标题</label>
                <input id="title" name="title" placeholder="输入兑换码标题" required>
              </div>

              <div class="form-group">
                <label for="description">描述</label>
                <textarea id="description" name="description" placeholder="输入兑换码描述"></textarea>
              </div>

              <div class="form-group">
                <label for="codes">兑换码列表</label>
                <textarea id="codes" name="codes" placeholder="每行输入一个兑换码" required></textarea>
              </div>

              <div class="form-footer">
                <a href="/" class="btn-back">返回首页</a>
                <button type="submit" class="btn btn-primary">创建</button>
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  `;
}

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
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>${data.title}</h1>
          </div>
        </div>

        <div class="container">
          <p class="description">${data.description}</p>

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
                showToast('兑换码已复制并标记为已使用');
              }
            } catch (error) {
              showToast('操作失败，请稍后重试');
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
        </script>
      </body>
    </html>
  `;
}