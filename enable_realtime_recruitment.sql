-- 🚨 ENABLE FULL REALTIME SCRIPT 🚨
-- Updates publication to include recruitment tables.

-- 1. Recruitment Questions (Exam)
ALTER PUBLICATION supabase_realtime ADD TABLE recruitment_questions;

-- 2. Recruitment Results (History)
ALTER PUBLICATION supabase_realtime ADD TABLE recruitment_results;

-- 3. Ensure previous ones are also added (idempotent-ish check not needed, plain add works or errors if exists, ignoring errors is fine usually, but let's just run adds)
-- If these fail it means they are already added, which is fine.
