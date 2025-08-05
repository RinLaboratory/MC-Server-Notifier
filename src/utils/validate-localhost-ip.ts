export function validateLocalhostIp(host: string): boolean {
  const normalized = host.trim().toLowerCase();

  // IPv6 loopback (::1)
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

  // IPv4 loopback (127.0.0.0/8) (172.0.0.0/8) (0.0.0.0/8)
  const ipv4Loopback = /^(127|172|0)(?:\.(?:\d{1,3})){3}$/;
  if (ipv4Loopback.test(normalized)) return true;

  return false;
}
