import {Account} from "./lib/account/account";
import {StorageKeys} from "./lib/storage/storage-keys";
import {TranslateManager} from "./lib/util/translate-manager";

export const Settings: any =
{
    IONIC_APP_ID:           "",
    IONIC_API_KEY:          "",

    WS_S4_URL:              "",
    WS_S4_USER:             "",
    WS_S4_PASSWORD:         "",

    WS_S5_URL:              "",
    WS_S5_SSL_URL:          "",
    WS_S5_USER:             "",
    WS_S5_PASSWORD:         "",

    APP_VERSION:            -1,

    AD_ORDERS:              "",

    GOOGLE_ANALYTICS_ID:    ""
};

export const DefaultLocalSettings: any =
{
    [StorageKeys.FIRST_LAUNCH]: true,
    [StorageKeys.TODAY_LUNCH_ENABLED]: false,
    [StorageKeys.TODAY_LUNCH_TIME]: "10:00",
    [StorageKeys.TODAY_LUNCH_ALERT_OPTIONS]: {
        sound: true,
        vibrate: true
    },
    [StorageKeys.ORDERS_STORED]: [],
    [StorageKeys.BILLING_REMOVE_ADS]: false,
    [StorageKeys.LOCAL_ACCOUNTS_LIST]: [
        new Account("Uživatel 1"),
        new Account("Uživatel 2"),
        new Account("Uživatel 3"),
        new Account("Uživatel 4"),
        new Account("Uživatel 5")
    ],
    [StorageKeys.LOCAL_ACCOUNTS_ACTIVE]: 0,
    [StorageKeys.LANGUAGE]: TranslateManager.Languages.Czech
};
