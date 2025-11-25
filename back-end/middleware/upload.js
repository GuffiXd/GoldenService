// Простой middleware для загрузки файлов без multer
// В production рекомендуется использовать multer или подобные библиотеки

const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

// Создаём папку uploads если её нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const simpleUpload = (req, res, next) => {
  // Если нет файла, просто продолжаем
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }

  // Пока упрощённая версия - файлы будут обрабатываться позже
  // Для полноценной работы нужно установить multer:
  // npm install multer
  
  next();
};

module.exports = simpleUpload;
