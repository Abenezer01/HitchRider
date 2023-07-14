import { type NextRequest, NextResponse } from 'next/server';
import { parseInitData } from '@twa.js/init-data';
// @ts-ignore - It exists, not sure why TS thinks it doesn't
import { validate } from '@twa.js/init-data/validation';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const { initData } = await req.json();
  try {
    validate(initData, process.env.BOT_TOKEN!);
  } catch {
    return NextResponse.json(
      { message: 'Invalid initData passed' },
      { status: 401 }
    );
  }
  const parsedInitData = parseInitData(initData);

  if (parsedInitData.user == undefined) {
    return NextResponse.json(
      { message: 'Cannot find user in initData' },
      { status: 401 }
    );
  }

  const { id, username } = parsedInitData.user;

  const user = await prisma.user.upsert({
    create: {
      chatId: id,
      username,
    },
    update: {
      username,
    },
    where: {
      chatId: id,
    },
  });

  return NextResponse.json({
    ...user,
    chatId: Number(user.chatId),
  });
}
