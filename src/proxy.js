import { NextResponse } from 'next/server'

export function proxy(request) {
  const url = request.nextUrl.clone()
  const user = request.cookies.get('user')?.value
  const role = request.cookies.get('role')?.value

  // Kalau sudah login dan mau ke login page, arahkan ke dashboard sesuai role
  if ((url.pathname === '/' || url.pathname === '/login') && user && role) {
    if (role === 'admin') url.pathname = '/admin'
    else if (role === 'user') url.pathname = '/user'
    return NextResponse.redirect(url)
  }

  // Kalau belum login, blok akses ke halaman tertentu
  if (!user || !role) {
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/user')) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Role check
  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  if (url.pathname.startsWith('/user') && role !== 'user') {
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/user/:path*', '/admin/:path*'],
}
