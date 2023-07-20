'use client';
import useSWR from 'swr';
import type { RideAnnouncement } from '@prisma/client';
import Ride from '@/components/RideAnnouncement';

export default function RidesList() {
  const { isLoading, error, data } = useSWR<RideAnnouncement[]>('/api/rides');

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>An error has occurred: {error.message}</p>;
  }
  if (data === undefined) {
    return <p>An unknown error has occurred</p>;
  }
  if (data.length === 0) {
    return <p>No rides found</p>;
  }
  const rides = data.map((ride) => ({
    ...ride,
    time: new Date(ride.time),
  }));

  return (
    <section className="flex flex-col gap-2">
      {rides.map((ride) => (
        <Ride key={ride.id} {...ride} />
      ))}
    </section>
  );
}