import dynamic from 'next/dynamic';

export const MainButton = dynamic(
  async () => (await import('@twa-dev/sdk/react')).MainButton,
  { ssr: false, loading: () => <div>Loading MainButton...</div> }
);

export const BackButton = dynamic(
  async () => (await import('@twa-dev/sdk/react')).BackButton,
  { ssr: false, loading: () => <div>Loading BackButton...</div> }
);
