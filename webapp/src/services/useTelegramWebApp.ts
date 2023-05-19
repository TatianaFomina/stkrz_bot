declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        sendData: (data: string) => void;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
          };
        };
        MainButton: MainButton;
        BackButton: BackButton;
        HapticFeedback: HapticFeedback;
      };
    };
  }
}

interface MainButton {
  text: string;
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
  setParams: (params: { is_active: boolean }) => void;
  showProgress: () => void;
  hideProgress: () => void;
}

interface BackButton {
  show: () => void;
  hide: () => VoidFunction;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
}

type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';

interface HapticFeedback {
  impactOccurred: (style: HapticImpactStyle) => void;
}

const tgWebApp = window.Telegram?.WebApp;

export function useTelegramWebApp(): UseTelegramWebApp {
  const queryId = tgWebApp?.initDataUnsafe.query_id;
  const userId = tgWebApp?.initDataUnsafe?.user?.id;

  /**
   * Informs the Telegram app that the Web App is ready to be displayed.
   */
  function ready(): void {
    tgWebApp?.ready();
  }

  /**
   * Closes Web App
   */
  function close(): void {
    tgWebApp?.close();
  }

  /**
   * Tells that an impact occurred. The Telegram app may play the appropriate haptics based on style value passed.
   * @param style - haptic style
   */
  function impactOccurred(style: HapticImpactStyle): void {
    tgWebApp?.HapticFeedback.impactOccurred(style);
  }

  return {
    queryId,
    userId,
    ready,
    close,
    impactOccurred,
  };
}

interface UseTelegramWebApp {
  queryId: string | undefined;
  userId: number | undefined;
  ready: () => void;
  close: () => void;
  impactOccurred: (style: HapticImpactStyle) => void;
}

export function useTelegramWebAppMainButton(): {
  showMainButton: () => void;
  hideMainButton: () => void;
  setMainButtonText: (text: string) => void;
  addMainButtonClickHandler: (cb: () => void) => void;
  removeMainButtonClickHandler: (cb: () => void) => void;
  setMainButtonActive: (isActive: boolean) => void;
  showProgress: () => void;
  hideProgress: () => void;
} {
  /**
   * Shows main Web App button
   */
  function showMainButton(): void {
    tgWebApp?.MainButton.show();
  }

  /**
   * Hides main Web App button
   */
  function hideMainButton(): void {
    tgWebApp?.MainButton.hide();
  }

  /**
   * Sets main Web App button text
   * @param text - new text
   */
  function setMainButtonText(text: string): void {
    if (tgWebApp === undefined) {
      return;
    }

    tgWebApp.MainButton.text = text;
  }

  /**
   * Adds main Web App button click callback
   * @param cb - function to be executed on main button click
   */
  function addMainButtonClickHandler(cb: () => void): void {
    tgWebApp?.MainButton.onClick(cb);
  }

  /**
   * Removes main Web App button click callback
   * @param cb - function to stop being executed on main button click
   */
  function removeMainButtonClickHandler(cb: () => void): void {
    tgWebApp?.MainButton.offClick(cb);
  }

  /**
   * Sets main Web App button active state
   * @param isActive - new active state
   */
  function setMainButtonActive(isActive: boolean): void {
    tgWebApp?.MainButton.setParams({
      is_active: isActive,
    });
  }

  function showProgress(): void {
    tgWebApp?.MainButton.showProgress();
  }

  function hideProgress(): void {
    tgWebApp?.MainButton.hideProgress();
  }

  return {
    showMainButton,
    hideMainButton,
    setMainButtonText,
    addMainButtonClickHandler,
    removeMainButtonClickHandler,
    setMainButtonActive,
    showProgress,
    hideProgress,
  };
}

export function useTelegramWebAppBackButton(): {
  showBackButton: () => void;
  hideBackButton: () => void;
  addBackButtonClickHandler: (cb: () => void) => void;
  removeBackButtonClickHandler: (cb: () => void) => void;
} {
  /**
   * Shows back Web App button
   */
  function showBackButton(): void {
    tgWebApp?.BackButton.show();
  }

  /**
   * Hides back Web App button
   */
  function hideBackButton(): void {
    tgWebApp?.BackButton.hide();
  }

  /**
   * Adds back Web App button click callback
   * @param cb - function to be executed on back button click
   */
  function addBackButtonClickHandler(cb: () => void): void {
    tgWebApp?.BackButton.onClick(cb);
  }

  /**
   * Removes back Web App button click callback
   * @param cb - function to stop being executed on back button click
   */
  function removeBackButtonClickHandler(cb: () => void): void {
    tgWebApp?.BackButton.offClick(cb);
  }
  return {
    showBackButton,
    hideBackButton,
    addBackButtonClickHandler,
    removeBackButtonClickHandler,
  };
}
