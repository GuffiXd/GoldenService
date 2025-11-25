-- Добавление поля stock в таблицу locks
-- Запустить только если поле еще не существует

ALTER TABLE locks 
ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0 COMMENT 'Количество товара на складе';

-- Обновляем существующие записи: если товар in_stock=true, ставим stock=10
UPDATE locks 
SET stock = 10 
WHERE in_stock = 1 AND (stock IS NULL OR stock = 0);
