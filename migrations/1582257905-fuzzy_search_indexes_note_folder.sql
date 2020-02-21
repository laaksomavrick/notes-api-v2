CREATE INDEX notes_idx_content_fuzzy_search
ON notes
USING GIN(lower(content) gin_trgm_ops);

CREATE INDEX folders_idx_name_fuzzy_search
ON folders
USING GIN(lower(name) gin_trgm_ops);
