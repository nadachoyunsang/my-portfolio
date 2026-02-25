INSERT INTO site_content (key, value) VALUES
  ('default_grid_size', 'md')
ON CONFLICT (key) DO NOTHING;
