CREATE TABLE IF NOT EXISTS notes (
	id SERIAL,
	note TEXT NOT NULL,
	deadline timestamp WITH time zone NOT NULL,
	list_id INT NOT NULL,
	done SMALLINT NOT NULL DEFAULT 0,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL,

	CONSTRAINT notes__fk_list_id FOREIGN KEY (
		list_id
) REFERENCES lists (
		id
) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS notes__idx__list_id ON notes (list_id);
CREATE INDEX IF NOT EXISTS notes__idx__note ON notes ("note");

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();