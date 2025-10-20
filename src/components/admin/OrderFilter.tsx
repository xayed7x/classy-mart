"use client";

import { useRouter, useSearchParams } from 'next/navigation';

const statuses = ['all', 'pending', 'shipped', 'delivered', 'cancelled'];

const OrderFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'pending';

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === 'all') {
      router.push('/admin/orders');
    } else {
      router.push(`/admin/orders?status=${newStatus}`);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
        Filter by status:
      </label>
      <select
        id="status-filter"
        name="status-filter"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        onChange={handleFilterChange}
        value={currentStatus}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderFilter;
