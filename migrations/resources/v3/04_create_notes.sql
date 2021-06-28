CREATE TABLE IF NOT EXISTS notes (
	id SERIAL,
	note TEXT NOT NULL,
	deadline timestamp WITH time zone NOT NULL,
	"listId" INT NOT NULL,
    "createdAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" timestamp NULL,

	CONSTRAINT notes__fk_listId FOREIGN KEY (
		"listId"
) REFERENCES lists (
		id
) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS notes__idx__listId ON notes ("listId");
CREATE INDEX IF NOT EXISTS notes__idx__note ON notes ("note");

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();