'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // این خطا را فقط برای توسعه در کنسول نشان می‌دهد
    // برای محیط تولید می‌توانید آن را کاملاً حذف کنید
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">اوه! مشکلی پیش آمد</h1>
      <p className="text-lg mb-6">متأسفیم، خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-amber-600 text-white rounded-lg"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
