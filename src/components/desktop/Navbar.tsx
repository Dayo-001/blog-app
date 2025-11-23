"use client";
import Link from "next/link";
import { useSession } from "@/src/app/hooks/sessionContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Navbar() {
  const { error, user, loading, logout } = useSession();

  return (
    <nav className="flex justify-between items-center bg-gray-200 border-b px-8 py-3 shadow-sm h-20">
      <Link href="/" className="flex items-center h-full">
        <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
          <Image
            src="/images/logo.png"
            alt="My Blog Logo"
            width={56}
            height={56}
            className="object-cover h-full w-full"
            priority
          />
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {loading ? (
          <Spinner className="animate-spin text-blue-500" />
        ) : user ? (
          <>
            <Link
              href="/dashboard"
              className="font-semibold text-gray-700 hover:text-blue-700 transition px-4 py-2 rounded bg-gray-50 hover:bg-blue-50"
            >
              Dashboard
            </Link>

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200 overflow-hidden">
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
              className="px-4 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium border border-red-200 transition hover:cursor-pointer"
              disabled={loading}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button className="px-4 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium border border-blue-200 transition hover:cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="px-4 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-medium border border-green-200 transition">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </nav>
  );
}
