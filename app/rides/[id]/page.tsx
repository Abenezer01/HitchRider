'use client';
import { useParams } from 'next/navigation';
import { MainButton } from '@/lib/components/telegram';
import useSWR from 'swr';
import type { RideAnnouncement } from '@prisma/client';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useTonConnectUI } from '@tonconnect/ui-react';

export default function RidePage() {
  const params = useParams();
  const router = useRouter();
  const [tonUi, setTonUiOptions] = useTonConnectUI();
  const { data, isLoading, error } = useSWR<RideAnnouncement>(
    '/api/rides/' + params.id
  );
  if (typeof window === 'undefined') {
    // Useless SSR
    return <p>Loading...</p>;
  }
  // const { userData } = useSWR<User>('/api/user');
  const { user } = window.Telegram.WebApp.initDataUnsafe;
  const { initData, showAlert, showConfirm, openTelegramLink } =
    window.Telegram.WebApp;

  if (isLoading) {
    return (
      <>
        <Header />
        <main>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <main>
        <Header />
        <p>An error occurred: {error.message}</p>
      </main>
    );
  }

  if (data === undefined) {
    return (
      <main>
        <Header />
        <p>An unknown error occurred</p>
      </main>
    );
  }

  const ride = {
    ...data,
    time: new Date(data.time),
    userChatId: Number(data.userChatId),
  };

  const { id, from, to, time, passengers, price, carInfo, userChatId } = ride;

  async function confirmDeleting(confirmed: boolean) {
    if (!confirmed) return;
    const res = await fetch(
      `/api/rides/${id}?initData=${encodeURIComponent(initData)}`,
      {
        method: 'DELETE',
      }
    );
    if (!res.ok) {
      const err = await res.json();
      showAlert(`Failed to delete ride: ${err.message}`);
      return;
    }
    router.back();
  }

  async function contactDriver() {
    const res = await fetch('/api/user/' + userChatId);
    const { username } = await res.json();
    openTelegramLink('https://t.me/' + username);
  }

  async function payDriver() {
    const res = await fetch('/api/user/' + userChatId);
    const { tonAddress } = await res.json();
    tonUi.sendTransaction({
      messages: [
        {
          address: tonAddress,
          amount: (price * passengers).toString(),
        },
      ],
      // Valid for 5 minutes
      validUntil: new Date().valueOf() + 5 * 60 * 1000,
    });
  }

  const chatID = user?.id;
  const classes = 'flex justify-between';
  return (
    <>
      <Header />
      <main className="p-4 flex flex-col gap-4">
        <div className="text-center font-medium border-b-4">Ride Info</div>
        <div className="flex flex-col gap-4 px-4">
          <div className={classes}>
            <h3 className="font-bold">From:</h3>
            <p>{from}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">To:</h3>
            <p>{to}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">Available Seats:</h3>
            <p>{passengers}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">Price per seat:</h3>
            <p>{price || 'Free'}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">Day:</h3>
            <p>{time.toLocaleDateString()}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">Leaves at:</h3>
            <p>{time.toLocaleTimeString(undefined, { timeStyle: 'short' })}</p>
          </div>
          <div className={classes}>
            <h3 className="font-bold">Car Info:</h3>
            <p>{carInfo}</p>
          </div>
        </div>
        {price > 0 && chatID !== userChatId ? (
          <button onClick={payDriver} className="rounded-lg p-2">
            Pay the driver
          </button>
        ) : (
          ''
        )}
        {/* recurrence && (
            <>
              <h3 className="font-bold">Recurrence:</h3>
              <p>{recurrence.type}</p>
            </>
          ) */}
        {chatID === userChatId ? (
          <MainButton
            text="Delete ride"
            color="#ff0000"
            onClick={() => {
              showConfirm(
                'Are you sure you want to delete this ride?',
                confirmDeleting
              );
            }}
          />
        ) : (
          <MainButton text="Contact the driver" onClick={contactDriver} />
        )}
      </main>
    </>
  );
}
