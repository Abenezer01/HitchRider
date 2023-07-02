import type { Ride } from '@/lib/api/rides';
import Link from 'next/link';

export default function Ride({
  id,
  from,
  to,
  time,
  price,
  seats,
  recurrence,
}: Ride) {
  return (
    <Link
      href={`/rides/${id}`}
      className="grid grid-cols-2 p-3 rounded-lg border border-gray-200 shadow bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
    >
      <h3 className="font-bold">From:</h3>
      <p>{from}</p>
      <h3 className="font-bold">To:</h3>
      <p>{to}</p>
      <h3 className="font-bold">Available seats:</h3>
      <p>{seats}</p>
      <h3 className="font-bold">Price per seat:</h3>
      <p>{price}</p>
      <h3 className="font-bold">Day:</h3>
      <p>{time.toLocaleDateString()}</p>
      <h3 className="font-bold">Leaves at:</h3>
      <p>{time.toLocaleTimeString()}</p>
      {recurrence && (
        <>
          <h3 className="font-bold">Recurrence:</h3>
          <p>{recurrence.type}</p>
        </>
      )}
    </Link>
  );
}
