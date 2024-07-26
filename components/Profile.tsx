'use client';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function UserProfile() {
  const { t } = useTranslation(['profile', 'common']);
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const {user:userData} = window.Telegram.WebApp.initDataUnsafe;
      setUser(userData);
      if (userData) {
        axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUserProfilePhotos`, {
          params: { user_id: userData.id }
        })
        .then(response => {
          const photos = response.data.result.photos;
          if (photos.length > 0) {
            const largestPhoto = photos[0][0];
            setPhotoUrl(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${largestPhoto.file_path}`);
          } else {
            console.log('No profile photo available.');
          }
        })
        .catch(error => {
          console.error('Error fetching user profile photo:', error);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <p>{t('loading', { ns: 'common' })}</p>;
  }

  if (!user) {
    return <p>{t('noUser', { ns: 'common' })}</p>;
  }

  const classes = 'w-full border-2 rounded-xl p-2 px-4 font-normal bg-tg-bg';

  return (
    <div className="flex flex-col items-center gap-8 pt-6 mx-8">
      <div className="flex flex-col items-center w-full gap-8 bg-tg-bg p-8 rounded-xl border-2 border-grey-400">
        <h1 className="font-semibold">{t('title')}</h1>
        <img
          src={photoUrl || 'path-to-default-image.jpg'}
          alt="User Photo"
          className="rounded-full w-1/2 mx-auto"
        />
        <div className="flex flex-row justify-evenly w-full">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="font-bold text-sm">{t('rides')}</h1>
            <p className="text-sm">200</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="font-bold text-sm">{t('announcements')}</h1>
            <p className="text-sm">50</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="font-bold text-sm">{t('requests')}</h1>
            <p className="text-sm">10</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-8 py-8 rounded-xl">
        <div className="flex items-center gap-2 w-full font-semibold">
          <div className="w-36">{t('name')}: </div>
          <div className={classes}>
            {(user.first_name ?? '') + ' ' + (user.last_name ?? '')}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full font-semibold">
          <div className="w-36">{t('username')}:</div>
          <div className={classes}>@{user.username ?? ''}</div>
        </div>
        <div className="flex items-center gap-2 w-full font-semibold">
          <div className="w-36">{t('car info')}:</div>
          <div className={classes}>TODO</div>
        </div>
      </div>
    </div>
  );
}
