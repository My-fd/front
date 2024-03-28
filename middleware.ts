
export { default } from 'next-auth/middleware'

export const config = { matcher: ['/ads/my', '/profile', '/notice', '/messages', '/protected/:path*'] }
