import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const user = request.cookies.get('user')?.value
  const role = request.cookies.get('role')?.value

  // --- 1️⃣ Halaman publik, bisa diakses siapa pun ---
  if (
    url.pathname === '/' ||
    url.pathname === '/registration' ||
    url.pathname === '/login' ||
    url.pathname === '/unauthorized'
  ) {
    // Kalau user SUDAH login dan buka login/registration, arahkan ke dashboard
    if (user && role && (url.pathname === '/login' || url.pathname === '/registration')) {
      if (role === 'admin') url.pathname = '/admin'
      else if (role === 'user') url.pathname = '/user'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // --- 2️⃣ Kalau belum login, redirect ke halaman utama ---
  if (!user || !role) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // --- 3️⃣ Cek role sesuai route ---
  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  if (url.pathname.startsWith('/user') && role !== 'user') {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  // --- 4️⃣ Kalau semua aman, lanjutkan request ---
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
}
