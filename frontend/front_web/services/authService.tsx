const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "localhost";
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://${API_HOST}:8000/api`;

export async function loginUser(
  email: string,
  password: string,
  device_id: string | null,
  device_name: string | null,
  remember_device: boolean = false
) {
  try {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Name": device_name || "Unknown device",
        "X-Trust-Device": remember_device ? "true" : "false", // à rendre dynamique plus tard
        "X-Device-Id": device_id || "",
        
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("BACKEND ERROR:", data); // 🔥 très utile
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (err : any) {
    if (err.name === "TypeError") {
      throw new Error("Vous n'êtes pas connecté à Internet");
    }

    throw err;
  }
}


export async function verifyTwoFactor(
  email: string,
  password: string,
  code: string,
  device_name: string | null,
  trust_device: boolean = false
) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Trust-Device": trust_device ? "true" : "false",
      "X-Device-Name": device_name || "Appareil inconnu"
    },
    body: JSON.stringify({
      email,
      password,
      code,
    }),
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (data && typeof data === "object") {
      throw new Error(data.error || data.message || "Invalid 2FA code");
    }
    throw new Error(data || "Invalid 2FA code");
  }

  return data;
}

// Nouvelle version avec first_name et last_name
export async function registerUser({
  email,
  first_name,
  last_name,
  password,
}: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/register-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name,
      last_name,
      password,
    }),
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (data && typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const firstVal = firstKey ? data[firstKey] : null;
      const message = Array.isArray(firstVal) ? firstVal[0] : firstVal;
      throw new Error(message || data.message || data.error || "Register failed");
    }
    throw new Error(data || "Register failed");
  }
  return data;
}

export async function verifyEmailOTP(email: string, code: string) {
  const res = await fetch(`${API_URL}/auth/verify-email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Verification failed");
  }

  return data;
}