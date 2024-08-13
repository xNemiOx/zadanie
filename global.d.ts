declare global {
    interface Window {
      yandexCaptchaCallback: (token: string) => void;
    }
  }