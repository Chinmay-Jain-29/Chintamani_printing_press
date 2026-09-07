import { getDatabase } from '@/lib/db';
import { HomePageClient } from '@/components/home/HomePageClient';

export default function HomePage() {
  const database = getDatabase();
  return <HomePageClient initialData={database} />;
}
