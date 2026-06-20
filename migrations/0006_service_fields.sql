ALTER TABLE services ADD COLUMN description text;
ALTER TABLE services ADD COLUMN min_weight real DEFAULT 0;
ALTER TABLE services ADD COLUMN is_active integer DEFAULT 1;
ALTER TABLE services ADD COLUMN sort_order real DEFAULT 0;
