export const commonStyles = `
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