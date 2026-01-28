# DivKit Learning

Learn DivKit with multi-page apps, shared variables, and real-time updates.

## 🚀 Quick Start

### 1. Install

```bash
npm install @divkitframework/divkit
npm install vite --save-dev
```

### 2. Project Structure

```
your-project/
├── index.html
├── index.js
├── package.json
└── pages/
    ├── variables.json
    ├── home.json
    ├── profile.json
    └── settings.json
```

### 3. Run

```bash
npm run dev
```

Open `http://localhost:5173/`

---

## 📝 How to Use

### Update Variables in Console

Open DevTools (F12) and try these commands:

```javascript
// Change user name
updateUserName('John Smith')

// Change email
updateGlobalVariable('user_email', 'john@example.com')

// Change status
updateGlobalVariable('membership_status', 'Gold Member')

// Toggle dark mode
toggleDarkMode()

// Toggle notifications
toggleNotifications()

// Fetch from API (simulated)
fetchAndUpdateUserData()
```

### What Happens:

✅ UI updates **immediately** (no page reload)
✅ Changes **persist** when you navigate between pages
✅ All pages share the **same variables**

---

## 🎯 Key Concepts

### 1. Global Variables Controller

```javascript
import { createGlobalVariablesController, createVariable } from '@divkitframework/divkit';

const controller = createGlobalVariablesController();
const variable = createVariable('user_name', 'string', 'John');
controller.setVariable(variable);
```

### 2. Update Variables

```javascript
// Get and update
const variable = controller.getVariable('user_name');
variable.setValue('Jane');
```

### 3. Use in JSON

```json
{
    "type": "text",
    "text": "@{user_name}"
}
```

---



---

## 📱 Cross-Platform

### Web
```javascript
const controller = createGlobalVariablesController();
controller.getVariable('user_name').setValue('Jane');
```
## Future Reference
### Android (Kotlin)
```kotlin
val variableController = DivVariableController()
variableController.putOrUpdate(Variable.StringVariable("user_name", "Jane"))
```

### iOS (Swift)
```swift
let variableStorage = DivVariableStorage()
variableStorage.set(variable: "user_name", value: "Jane")
```



## 🔗 Resources

- [DivKit Official Docs](https://divkit.tech/)
- [DivKit GitHub](https://github.com/divkit/divkit)
- [DivKit Playground](https://divkit.tech/playground)

---

## 📄 License

MIT

---

## 💡 Tips

- Here used **multiple JSON files** 
- Use **globalVariablesController** for shared state
- **Batch WebSocket updates** for high-frequency data
- Keep variables for **UI state** (not large datasets)
