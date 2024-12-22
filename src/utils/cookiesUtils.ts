export const setCookie = (name: string, value: string, days?: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(
    value || ""
  )}${expires}; path=/; secure; samesite=strict`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/; secure; samesite=strict`;
};
