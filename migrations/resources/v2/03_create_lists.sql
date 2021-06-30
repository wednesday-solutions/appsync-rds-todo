CREATE TABLE IF NOT EXISTS lists (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	user_id INT NOT NULL,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL,
	CONSTRAINT lists__fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS list__idx__name ON lists (name);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON lists
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();