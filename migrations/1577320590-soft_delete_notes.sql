ALTER TABLE notes
ADD COLUMN deleted BOOLEAN NOT NULL default FALSE;

CREATE INDEX notes_idx_deleted ON notes (deleted);
