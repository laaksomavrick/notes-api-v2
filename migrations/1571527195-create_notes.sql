CREATE TABLE IF NOT EXISTS notes (
    id serial PRIMARY KEY,
    user_id INTEGER NOT NULL,
    folder_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (folder_id) REFERENCES folders (id)
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1;

CREATE INDEX notes_idx_user_id ON notes (user_id);
CREATE INDEX notes_idx_folder_id ON notes (folder_id);

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
