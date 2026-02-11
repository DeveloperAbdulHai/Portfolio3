
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugefsjmdizjqyelipuks.supabase.co';
// Use the provided publishable key
const supabaseKey = 'sb_publishable_xGIZD8Bu0QYGKnppaH_AxQ_yg-9PidK';

export const supabase = createClient(supabaseUrl, supabaseKey);
