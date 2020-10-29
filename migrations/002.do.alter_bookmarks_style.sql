CREATE TYPE bookmarks_category AS ENUM (
    'Education',
    'Forum',
    'News',
    'Video Sharing',
    'Blog'
);

ALTER TABLE bookmarks
  ADD COLUMN
    style bookmarks_category;