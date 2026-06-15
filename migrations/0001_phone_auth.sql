/* Apply phone-based auth:

1. Add phone column to users
2. Copy email data to phone (if any)
3. Drop email column and index
4. Create phone index
*/

--> statement-breakpoint
ALTER TABLE users ADD COLUMN phone text;--> statement-breakpoint
UPDATE users SET phone = email WHERE phone IS NULL;--> statement-breakpoint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS users_email_idx;--> statement-breakpoint
CREATE UNIQUE INDEX users_phone_idx ON users (phone);--> statement-breakpoint
ALTER TABLE users DROP COLUMN email;
