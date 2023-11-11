import { type Ref, computed } from 'vue';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        onEvent: (eventName: string, cb: () => void) => void;
        offEvent: (eventName: string, cb: () => void) => void;
        sendData: (data: string) => void;
        setHeaderColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        switchInlineQuery: (query?: string) => Promise<void>;
        platform: Platform;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: string;
            language_code: string;
          };
        };
        themeParams: {
          secondary_bg_color: string;
        };
        MainButton: MainButton;
        BackButton: BackButton;
        HapticFeedback: HapticFeedback;
        viewportStableHeight: number;
      };
    };
  }
}

export type Platform = 'macos' | 'ios' | 'android' | 'web' | 'unknown';

interface MainButton {
  text: string;
  color: string;
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
  setParams: (params: { is_active: boolean; color?: string }) => void;
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

const viewportChangesCallbacks: Array<() => void> = [];

export function useTelegramWebApp(): UseTelegramWebApp {
  const queryId = tgWebApp?.initDataUnsafe.query_id;
  const userId = tgWebApp?.initDataUnsafe?.user?.id;
  const language = tgWebApp?.initDataUnsafe.user?.language_code;
  const platform = tgWebApp?.platform;

  /**
   * Informs the Telegram app that the Web App is ready to be displayed.
   */
  function ready(): void {
    tgWebApp?.ready();
    tgWebApp?.expand();

    tgWebApp?.setHeaderColor(tgWebApp?.themeParams.secondary_bg_color);
    tgWebApp?.enableClosingConfirmation();
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

  /**
   * Occurs when the visible section of the Mini App is changed.
   * @param cb - callback to trigger on viewport change
   */
  function onViewportChange(cb: () => void): void {
    // Clear old listeners
    viewportChangesCallbacks.forEach(item => tgWebApp?.offEvent('viewportChanged', item));
    viewportChangesCallbacks.length = 1;

    // Assign new one
    viewportChangesCallbacks.push(cb);
    tgWebApp?.onEvent('viewportChanged', cb);
  }

  /**
   * Returns the height of the visible area of the Mini App in its last stable state.
   */
  function getViewportHeight(): number | undefined {
    return tgWebApp?.viewportStableHeight;
  }

  /**
   * True if mobile client hosts webapp
   */
  const isMobileClient = computed(() => platform === 'ios' || platform === 'android');

  /**
   * A method that inserts the bot's username and the specified inline query in the current chat's input field.
   * @param query - query to be inserted
   */
  async function switchInlineQuery(query?: string): Promise<void> {
    await tgWebApp?.switchInlineQuery(query);
  }

  return {
    queryId,
    userId,
    language,
    platform,
    isMobileClient,
    ready,
    close,
    impactOccurred,
    onViewportChange,
    getViewportHeight,
    switchInlineQuery,
  };
}

interface UseTelegramWebApp {
  queryId: string | undefined;
  userId: string | undefined;
  language: string | undefined;
  platform: Platform | undefined;
  isMobileClient: Ref<boolean>;
  ready: () => void;
  close: () => void;
  impactOccurred: (style: HapticImpactStyle) => void;
  onViewportChange: (cb: () => void) => void;
  getViewportHeight: () => number | undefined;
  switchInlineQuery: (query?: string) => Promise<void>;
}

let mainButtonCallbacks: Array<() => void> = [];

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
  const defaultColor = tgWebApp?.MainButton.color;
  const disabledColor = '#a7a7a7';

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
    // Remove old handlers
    mainButtonCallbacks.forEach(item => tgWebApp?.MainButton.offClick(item));
    mainButtonCallbacks.length = 0;

    // Add new handler
    mainButtonCallbacks.push(cb);
    tgWebApp?.MainButton.onClick(cb);
  }

  /**
   * Removes main Web App button click callback
   * @param cb - function to stop being executed on main button click
   */
  function removeMainButtonClickHandler(cb: () => void): void {
    mainButtonCallbacks = mainButtonCallbacks.filter(item => item !== cb);
    tgWebApp?.MainButton.offClick(cb);
  }

  /**
   * Sets main Web App button active state
   * @param isActive - new active state
   */
  function setMainButtonActive(isActive: boolean): void {
    tgWebApp?.MainButton.setParams({
      is_active: isActive,
      color: isActive ? defaultColor : disabledColor,
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
