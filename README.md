# ErrorSnap

A lightweight JavaScript error tracking library to capture and report runtime errors, unhandled promise rejections, and useful contextual breadcrumbs like user actions, navigation events, console logs, and network requests.

## ✨ Features

- ✅ Global error capturing (`window.onerror`, `unhandledrejection`)
- ✅ Breadcrumbs for user actions (clicks, navigation, console, fetch)
- ✅ Manual error reporting
- ✅ Custom user context
- ✅ Simple API, framework-agnostic (vanilla JS)

## 🚀 Installation

Just import the library in your project.

```bash
npm install errorsnap
# or
yarn add errorsnap
```

Then in your code:

```javascript
import ErrorSnap from 'errorsnap';
```

## 🛠️ Usage

### 1. Initialize ErrorSnap

```javascript
import ErrorSnap from 'errorsnap';

ErrorSnap.init({
  endpoint: 'https://your-api.com/error-report', // required
  maxBreadcrumbs: 50, // optional (default: 30)
});
```

### 2. Set user info (optional)

Attach user context to all error reports.

```javascript
ErrorSnap.setUser({
  id: '12345',
  name: 'John Doe',
  email: 'john@example.com',
});
```

### 3. Manually notify errors

Report manual or caught errors programmatically.

```javascript
try {
  // your risky code
} catch (error) {
  ErrorSnap.notify(error);
}
```

### 4. Automatic breadcrumbs

ErrorSnap automatically tracks:
- ✅ Click events
- ✅ Navigation changes (pushState, popState)
- ✅ Console errors and warnings
- ✅ Network requests (`fetch`)

These breadcrumbs are included with every error report to give context.

---

## 🧩 Error Report Payload

Example payload sent to your API:

```json
{
  "type": "error",
  "message": "Uncaught TypeError: Cannot read properties of undefined",
  "source": "app.js",
  "lineno": 42,
  "colno": 13,
  "stack": "TypeError: ...",
  "user": {
    "id": "12345",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "breadcrumbs": [
    { "type": "click", "message": "Clicked on #submit-button" },
    { "type": "navigation", "message": "Navigated to /dashboard" },
    { "type": "console", "message": "Console error: Something went wrong" }
  ]
}
```

---

## 🧩 API

### `init(options)`
Initialize ErrorSnap with configuration.

| Option             | Type     | Description |
|--------------------|----------|-------------|
| `endpoint`         | `string` | **Required.** API endpoint to send error reports. |
| `maxBreadcrumbs`   | `number` | Optional. Max number of breadcrumbs to store (default: 20). |

### `setUser(userInfo)`
Attach user information to error reports.

```javascript
ErrorSnap.setUser({ id: '123', name: 'Jane', email: 'jane@example.com' });
```

### `notify(error)`
Manually notify an error.

```javascript
ErrorSnap.notify(new Error('Manual error'));
```

### `addBreadcrumb(breadcrumb)`
Manually add a custom breadcrumb.

```javascript
ErrorSnap.addBreadcrumb({ type: 'custom', message: 'User did something special' });
```

---

## 🏗️ Development

If you want to develop or test ErrorSnap locally:

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local test project:
   ```bash
   npm run dev
   ```

---

## 📄 License

MIT License — free to use and modify.

---

## 💡 Roadmap

- [ ] Support batching of error reports
- [ ] Support source maps for stack trace mapping
- [ ] Session tracking
- [ ] Replay user sessions (optional)

---

## 🤝 Contributions

Contributions are welcome!  
Feel free to open issues or submit PRs 🚀