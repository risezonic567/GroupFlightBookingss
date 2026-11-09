const LIMIT = 2
const WINDOW_MS = 60 * 60 * 1000
const ipMap = new Map()

function isLocalIp(ip) {
  return ip === '127.0.0.1' || ip === '::1'
}

function clean(ip) {
  const now = Date.now()
  const timestamps = ipMap.get(ip) || []
  const filtered = timestamps.filter((t) => now - t < WINDOW_MS)
  if (filtered.length) ipMap.set(ip, filtered)
  else ipMap.delete(ip)
}

export function isRateLimited(ip) {
  if (ip === 'unknown' || isLocalIp(ip)) return false
  clean(ip)
  const timestamps = ipMap.get(ip) || []
  return timestamps.length >= LIMIT
}

export function recordSubmission(ip) {
  if (ip === 'unknown' || isLocalIp(ip)) return
  const timestamps = ipMap.get(ip) || []
  timestamps.push(Date.now())
  ipMap.set(ip, timestamps)
}
