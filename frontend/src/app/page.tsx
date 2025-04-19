import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/pelican7-it/pelican7-eHR"
            target="_blank"
            rel="noopener noreferrer"
          >
            By Pelican7 IT
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Pelican7 e-HR System
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <Link
          href="/login"
          className="card group rounded-lg border border-transparent px-5 py-4 m-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            로그인{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">
            직원 계정으로 로그인하여 e-HR 시스템에 접속하세요.
          </p>
        </Link>

        <Link
          href="/register"
          className="card group rounded-lg border border-transparent px-5 py-4 m-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            회원가입{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">
            관리자의 승인 후 e-HR 시스템 계정을 생성할 수 있습니다.
          </p>
        </Link>

        <Link
          href="/about"
          className="card group rounded-lg border border-transparent px-5 py-4 m-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            시스템 소개{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">
            e-HR 시스템에 대한 소개와 주요 기능을 확인하세요.
          </p>
        </Link>
      </div>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        &copy; 2025 Pelican7 IT. All rights reserved.
      </footer>
    </main>
  );
}
