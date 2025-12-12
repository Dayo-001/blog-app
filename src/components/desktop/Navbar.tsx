"use client";
import Link from "next/link";
import { useSession } from "@/src/app/hooks/sessionContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

export default function Navbar() {
  const { error, user, loading, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-200 border-b px-4 sm:px-8 py-3 shadow-sm">
      <div className="flex justify-between items-center h-16">
        <Link href="/" className="flex items-center h-full">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <Image
              src="/images/logo.png"
              alt="TechToniq Logo"
              width={56}
              height={56}
              className="object-cover h-full w-full"
              priority
            />
          </div>
          <span className="ml-3 text-lg sm:text-2xl font-extrabold text-gray-900">
            TechToniq
          </span>
        </Link>

        <button
          className="sm:hidden p-2 rounded focus:outline-none"
          onClick={() => setMenuOpen((state) => !state)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
        </button>

        <div className="hidden sm:flex items-center gap-4">
          {loading ? (
            <Spinner className="animate-spin text-blue-500" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="font-semibold text-gray-700 hover:text-blue-700 transition px-3 py-2 rounded bg-gray-50 hover:bg-blue-50 text-sm sm:text-base"
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base sm:text-lg border border-blue-200 overflow-hidden">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : user.name ? (
                  user.name[0].toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <Button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium border border-red-200 transition hover:cursor-pointer text-sm sm:text-base"
                disabled={loading}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium border border-blue-200 transition hover:cursor-pointer text-sm sm:text-base">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="px-3 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-medium border border-green-200 transition text-sm sm:text-base">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-2 mt-2">
          {loading ? (
            <Spinner className="animate-spin text-blue-500 mx-auto" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="font-semibold text-gray-700 hover:text-blue-700 transition px-3 py-2 rounded bg-gray-50 hover:bg-blue-50 text-base"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200 overflow-hidden mx-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? "User"}
                    className="w-full h-full object-cover"
                  />
                ) : user.name ? (
                  user.name[0].toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium border border-red-200 transition hover:cursor-pointer text-base mx-3"
                disabled={loading}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium border border-blue-200 transition hover:cursor-pointer text-base mx-3">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                <Button className="px-3 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-medium border border-green-200 transition text-base mx-3">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      )}

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </nav>
  );
}
