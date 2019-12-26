ALTER TABLE folders
ADD COLUMN deleted BOOLEAN NOT NULL default FALSE;

CREATE INDEX folders_idx_deleted ON folders (deleted);
