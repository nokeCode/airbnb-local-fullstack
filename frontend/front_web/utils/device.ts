export function getDeviceId() {
  if (typeof window === "undefined") return null;

  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      // fallback si randomUUID n'existe pas
      deviceId = "device-" + Math.random().toString(36).substring(2) + Date.now();
    }

    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

export function getDeviceName() {
  if (typeof window === "undefined") return null;
  return navigator.userAgent;
}

