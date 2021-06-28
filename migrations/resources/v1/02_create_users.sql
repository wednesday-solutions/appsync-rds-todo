CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL, 
	"userRef" TEXT NOT NULL,
    "createdAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" timestamp NULL
);

CREATE INDEX IF NOT EXISTS users__idx__userRef ON users ("userRef");

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();