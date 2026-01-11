-- 🚨 ENABLE REALTIME SCRIPT 🚨
-- Run this if the site doesn't update automatically when you create/edit items.

-- 1. Enable Realtime for Courses
ALTER PUBLICATION supabase_realtime ADD TABLE courses;

-- 2. Enable Realtime for Study Materials (just in case)
ALTER PUBLICATION supabase_realtime ADD TABLE study_materials;

-- 3. Enable Realtime for App Settings (Banner/Recruitment)
ALTER PUBLICATION supabase_realtime ADD TABLE app_settings;
