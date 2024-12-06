import { commonStyles } from './components/common-styles';

export function renderHomePage(): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/favicon.ico" />
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
            <p>轻量级创建和管理您的兑换码</p>
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