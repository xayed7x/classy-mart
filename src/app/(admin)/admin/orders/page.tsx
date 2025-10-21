import { Suspense } from 'react';
import AdminOrdersClient from './AdminOrdersClient';
import { AdminOrdersSkeleton } from '@/components/admin/AdminOrdersSkeleton';

export const dynamic = 'force-dynamic';

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<AdminOrdersSkeleton />}>
      <AdminOrdersClient />
    </Suspense>
  );
}