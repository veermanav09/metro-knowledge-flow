-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, department)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'department', 'engineering')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger that fires when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();