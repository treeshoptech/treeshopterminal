import { NextResponse } from 'next/server';

const APPROVED_EMAILS = [
  'office@fltreeshop.com',
  'lockin@treeshop.app',
  'test@test.com', // For testing
];

export async function POST(request: Request) {
  const { email } = await request.json();

  const isApproved = APPROVED_EMAILS.includes(email.toLowerCase());

  return NextResponse.json({ isApproved });
}
