import { useState } from 'react';
import { supabase } from '@/integrations-supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_TRIPS } from '@/lib/mockData';

export default function DemoCreateTrip() {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('demo-user');
  const [tripData, setTripData] = useState<any>(MOCK_TRIPS[0]);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    const { error } = await supabase.from('ai_trips').insert([
      {
        title,
        user_id: userId,
        trip_data: tripData,
      },
    ]);
    if (error) setStatus('Error: ' + error.message);
    else setStatus('Trip created! Refresh home to see it.');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-10 p-6 border rounded-lg bg-card flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold mb-2">Demo: Create Trip in Supabase</h2>
      <label className="font-body text-sm">Trip Title</label>
      <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Trip Title" />
      <label className="font-body text-sm">User ID</label>
      <Input value={userId} onChange={e => setUserId(e.target.value)} required placeholder="User ID" />
      <Button type="submit" className="bg-accent text-accent-foreground">Create Trip</Button>
      {status && <p className="text-sm mt-2">{status}</p>}
      <p className="text-xs text-muted-foreground">This uses the first mock trip as a template. Edit the code for more fields.</p>
    </form>
  );
}
