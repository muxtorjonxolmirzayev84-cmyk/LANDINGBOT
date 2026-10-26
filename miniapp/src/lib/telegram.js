// Telegram WebApp bilan ishlash uchun yordamchilar
export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
export const isTelegram = Boolean(tg && tg.initData);
export const initData = tg?.initData || '';

export function versionAtLeast(version) {
  try {
    return Boolean(tg?.isVersionAtLeast?.(version));
  } catch {
    return false;
  }
}

const safe = (fn) => {
  try {
    fn();
  } catch {
    /* eski Telegram versiyalari */
  }
};

export function setupTelegram() {
  if (!tg) return;
  safe(() => tg.ready());
  if (!isTelegram) return;
  safe(() => tg.expand());
  if (versionAtLeast('6.9')) {
    safe(() => tg.setHeaderColor('#ffffff'));
    safe(() => tg.setBackgroundColor('#ffffff'));
  }
  if (versionAtLeast('7.10')) safe(() => tg.setBottomBarColor('#ffffff'));
  if (versionAtLeast('7.7')) safe(() => tg.disableVerticalSwipes());
}

export function getTgUser() {
  return tg?.initDataUnsafe?.user || null;
}

export function haptic(style = 'light') {
  if (isTelegram && versionAtLeast('6.1')) safe(() => tg.HapticFeedback.impactOccurred(style));
}

export function hapticNotify(type = 'success') {
  if (isTelegram && versionAtLeast('6.1')) safe(() => tg.HapticFeedback.notificationOccurred(type));
}

export function closeApp() {
  if (isTelegram) safe(() => tg.close());
}

/** Telegram'ning "Orqaga" tugmasini boshqaradi */
export function bindBackButton(visible, handler) {
  if (!isTelegram || !versionAtLeast('6.1')) return () => {};
  safe(() => {
    if (visible) {
      tg.BackButton.onClick(handler);
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  });
  return () => safe(() => tg.BackButton.offClick(handler));
}

export const canRequestContact = isTelegram && versionAtLeast('6.9');

/** Telegram orqali telefon raqamini so'raydi */
export function requestPhone() {
  return new Promise((resolve) => {
    if (!canRequestContact) return resolve(null);
    try {
      tg.requestContact((shared, response) => {
        if (!shared) return resolve(null);
        const phone = response?.responseUnsafe?.contact?.phone_number || null;
        resolve(phone ? (String(phone).startsWith('+') ? phone : `+${phone}`) : null);
      });
    } catch {
      resolve(null);
    }
  });
}

/** Joriy joylashuvni aniqlaydi (Telegram LocationManager yoki brauzer orqali) */
export function getLocation() {
  return new Promise((resolve, reject) => {
    const viaBrowser = () => {
      if (!navigator.geolocation) {
        reject(new Error("Qurilmangiz joylashuvni aniqlay olmadi. Manzilni qo'lda yozing."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => reject(new Error("Joylashuvga ruxsat berilmadi. Manzilni qo'lda yozing.")),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    };

    const lm = tg?.LocationManager;
    if (isTelegram && lm && versionAtLeast('8.0')) {
      const run = () => {
        if (!lm.isLocationAvailable) return viaBrowser();
        lm.getLocation((data) => {
          if (data) return resolve({ latitude: data.latitude, longitude: data.longitude });
          if (lm.isAccessRequested && !lm.isAccessGranted) {
            reject(new Error("Joylashuvga ruxsat berilmagan. Telegram sozlamalaridan ruxsat bering yoki manzilni yozing."));
          } else {
            viaBrowser();
          }
        });
      };
      try {
        if (lm.isInited) run();
        else lm.init(run);
      } catch {
        viaBrowser();
      }
    } else {
      viaBrowser();
    }
  });
}
