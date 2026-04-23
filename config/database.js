const { createClient } = require('@supabase/supabase-js');

// Using the provided Supabase URL and Service Role Key
const supabaseUrl = 'https://xeiuodffucezlxqvmipy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaXVvZGZmdWNlemx4cXZtaXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4NTM0MiwiZXhwIjoyMDkyMTYxMzQyfQ.YGUpJeAlg2FB3R9yBK4w5dvixk_sqB2-rTs9zQHzBGg';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Connected to Supabase PostgreSQL database.');

module.exports = supabase;
