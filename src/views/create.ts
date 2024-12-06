import { commonStyles } from './components/common-styles';

export function renderCreatePage(): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="/favicon.ico" />
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
      <textarea id="description" name="description" 
        placeholder="输入兑换码描述" 
        style="white-space: pre-wrap;"
      ></textarea>
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