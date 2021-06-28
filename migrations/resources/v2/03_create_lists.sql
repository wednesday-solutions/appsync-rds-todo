CREATE TABLE IF NOT EXISTS lists (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	"userId" INT NOT NULL,
    "createdAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" timestamp NULL,
	CONSTRAINT lists__fk_userId FOREIGN KEY ("userId") REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS list__idx__name ON lists (name);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON lists
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();