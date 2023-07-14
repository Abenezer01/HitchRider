'use client';
import { useParams } from 'next/navigation';
import { BackButton } from '@/lib/components/telegram';
import useSWR from 'swr';
import type { RideAnnouncement } from '@prisma/client';

export default function RidePage() {
  const params = useParams();
  const { data, isLoading, error } = useSWR<RideAnnouncement>(
    '/api/rides/' + params.id
  );

  if (isLoading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>An error occurred: {error.message}</p>
      </main>
    );
  }

  if (data === undefined) {
    return (
      <main>
        <p>An unknown error occurred</p>
      </main>
    );
  }

  const ride = { ...data, time: new Date(data.time) };

  const { id, from, to, time, passengers, carInfo } = ride;
  return (
    <main className="p-2">
      <BackButton />
      <p>Ride #{id}</p>
      <h3 className="font-bold">From:</h3>
      <p>{from}</p>
      <h3 className="font-bold">To:</h3>
      <p>{to}</p>
      <h3 className="font-bold">Available seats:</h3>
      <p>{passengers}</p>
      {/* <h3 className="font-bold">Price per seat:</h3>
      <p>{price || 'Free'}</p> */}
      <h3 className="font-bold">Day:</h3>
      <p>{time.toLocaleDateString()}</p>
      <h3 className="font-bold">Leaves at:</h3>
      <p>{time.toLocaleTimeString()}</p>
      <h3 className="font-bold">Car info:</h3>
      <p>{carInfo}</p>
      {/* recurrence && (
        <>
          <h3 className="font-bold">Recurrence:</h3>
          <p>{recurrence.type}</p>
        </>
      ) */}
    </main>
  );
}
