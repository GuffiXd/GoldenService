# Инструкция по настройке админ-панели

## ✅ Что уже сделано

### Frontend
1. **ProductManagement** - страница управления товарами
   - Добавление новых товаров
   - Редактирование существующих товаров
   - Удаление товаров
   - Загрузка изображений
   - Управление остатками

2. **OrderManagement** - страница управления заказами
   - Просмотр всех заказов
   - Изменение статуса заказа
   - Просмотр деталей заказа
   - Удаление заказов

3. **AdminLayout** - обновленное меню
   - Дашборд
   - Пользователи
   - Товары (новое)
   - Заказы (новое)

### Backend
1. **API эндпоинты для товаров:**
   - `POST /api/admin/locks` - создание товара
   - `PUT /api/admin/locks/:id` - обновление товара
   - `DELETE /api/admin/locks/:id` - удаление товара

2. **API эндпоинты для заказов:**
   - `GET /api/admin/orders` - получение всех заказов
   - `PUT /api/admin/orders/:id/status` - обновление статуса
   - `DELETE /api/admin/orders/:id` - удаление заказа

3. **Модель Lock обновлена:**
   - Добавлено поле `stock` для отслеживания остатков

## 📦 Установка multer для загрузки изображений (рекомендуется)

Для полноценной работы загрузки изображений установите multer:

```bash
cd back-end
npm install multer
```

Затем обновите файл `back-end/routes/AdminRoutes.js`:

```javascript
const multer = require("multer");
const path = require("path");

// Настройка multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Только изображения разрешены!"));
  }
});

// Обновите роуты:
router.post("/locks", upload.single("image"), AdminController.createLock);
router.put("/locks/:id", upload.single("image"), AdminController.updateLock);
```

## 🗄️ Обновление базы данных

После запуска сервера поле `stock` будет автоматически добавлено в таблицу `locks` благодаря `sequelize.sync({ alter: true })`.

Если нужно добавить вручную:

```sql
ALTER TABLE locks ADD COLUMN stock INT DEFAULT 0 COMMENT 'Количество товара на складе';
```

## 🚀 Запуск

1. **Backend:**
```bash
cd back-end
npm run dev
```

2. **Frontend:**
```bash
cd front-end
npm run dev
```

3. **Доступ к админ-панели:**
   - URL: http://localhost:5173/admin
   - Требуется вход под аккаунтом с ролью `admin`

## 📝 Примечания

- Папка `back-end/uploads` создана и готова для загрузки файлов
- Изображения доступны по адресу: `http://localhost:5000/uploads/filename.jpg`
- Все роуты админ-панели защищены middleware аутентификации и проверки роли

## 🔐 Создание админа

Если еще нет админского аккаунта:

```bash
cd back-end
node createAdmin.js
```

Или вручную в БД:
```sql
UPDATE users SET role = 'admin' WHERE email = 'ваш@email.com';
```
