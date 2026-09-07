import { getDatabaseAsync } from '@/lib/db';
import { HomePageClient } from '@/components/home/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const database = await getDatabaseAsync();
  return <HomePageClient initialData={database} />;
}
