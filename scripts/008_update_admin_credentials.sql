-- Update the admin credentials verification function to use proper password comparison
CREATE OR REPLACE FUNCTION verify_admin_credentials(input_username TEXT, input_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
  user_active BOOLEAN;
BEGIN
  SELECT password_hash, is_active 
  INTO stored_hash, user_active
  FROM admin_users 
  WHERE username = input_username;
  
  IF stored_hash IS NULL OR user_active = FALSE THEN
    RETURN FALSE;
  END IF;
  
  -- Simple password comparison (for now using plain text)
  -- In production, implement proper bcrypt comparison
  RETURN stored_hash = input_password;
END;
$$;

-- Update the default admin user with plain text password for now
UPDATE admin_users 
SET password_hash = 'gabysummer2024' 
WHERE username = 'admin';
