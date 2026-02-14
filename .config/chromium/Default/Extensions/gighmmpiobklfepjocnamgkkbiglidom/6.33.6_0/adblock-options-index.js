/*
 * This file is part of AdBlock  <https://getadblock.com/>,
 * Copyright (C) 2013-present  Adblock, Inc.
 *
 * AdBlock is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * AdBlock is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdBlock.  If not, see <http://www.gnu.org/licenses/>.
 */

/* For ESLint: List any global identifiers used in this file below */
/* global browser, translate, FilterListUtil, activateTab,
   CustomFilterListUploadUtil, localizePage, storageSet, debounced, determineUserLanguage,
   setLangAndDirAttributes, License, ewe, licenseNotifier, initializeProxies,
   settingsNotifier, initializeSettings, initializeLicense,
   initializeChannels, settings, initializePrefs, SubscriptionAdapter,
   initializeLocalDataCollection, initializePremiumPort,
   initializeSubscriptionsProxy, initializeFiltersProxy,
   connectUIPort, initializeSubscriptionsProxy, initializeFiltersProxy

    */

const PREMIUM_FILTER_URL_LIST = [
  "https://easylist-downloads.adblockplus.org/adblock_premium.txt",
  "https://easylist-downloads.adblockplus.org/v3/full/adblock_premium.txt",
  "https://easylist-downloads.adblockplus.org/cookie-filter-list.txt",
  "https://easylist-downloads.adblockplus.org/v3/full/cookie-filter-list.txt",
];

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
function isPremiumFilterListURL(url) {
  return PREMIUM_FILTER_URL_LIST.includes(url);
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
function send(command, args) {
  const updatedArgs = Object.assign({}, { command }, args);
  return browser.runtime.sendMessage(updatedArgs);
}

function sendTypeMessage(type, args) {
  const updatedArgs = Object.assign({}, { type }, args);
  return browser.runtime.sendMessage(updatedArgs);
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
const isSelectorFilter = function (text) {
  // This returns true for both hiding rules as hiding allowlist rules
  // This means that you'll first have to check if something is an excluded rule
  // before checking this, if the difference matters.
  // returns false for comment rules (rules that start with !)
  return /^[^!]*#@?#./.test(text);
};

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
const premiumFiltersCtaKey = "premium-filters-cta-clicked";

const info = {};
let autoReloadingPage;

const language = determineUserLanguage();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let delayedSubscriptionSelection = null;

let initializedProxies;
window.initializeProxies = () => {
  if (initializedProxies) {
    return initializedProxies;
  }
  const getApp = new Promise((resolve) => {
    sendTypeMessage("app.get", { what: "application" }).then((application) => {
      info.application = application;
      resolve();
    });
  });
  initializedProxies = Promise.all([
    getApp,
    initializeSettings(),
    initializeLicense(),
    initializeChannels(),
    initializePrefs(),
    initializeLocalDataCollection(),
    initializeSubscriptionsProxy(),
    initializeFiltersProxy(),
    initializePremiumPort(),
  ]);
  return initializedProxies;
};

function displayVersionNumber() {
  const currentVersion = browser.runtime.getManifest().version;
  $("#extension_version_number").text(`v${currentVersion}`);
}

function displayTranslationCredit() {
  if (language === "en" || language.startsWith("en")) {
    return;
  }
  const translators = [];

  $.getJSON(browser.runtime.getURL("translators.json"), (response) => {
    let matchFound = false;
    const langSubstring = language.substring(0, 2);
    let langEnd = "";
    if (language.length >= 5) {
      langEnd = language.substring(3, 5).toLowerCase();
    }
    for (const id in response) {
      const idEqualToLang = id === language || id === language.toLowerCase();
      const idEqualToLangSubstring =
        id.substring(0, 2) === langSubstring || id.substring(0, 2) === langSubstring.toLowerCase();

      // if matching id hasn't been found and id matches lang
      if (
        !matchFound &&
        (idEqualToLang || idEqualToLangSubstring) &&
        (id.length <= 3 || (id.length >= 5 && langEnd === id.substring(3, 5).toLowerCase()))
      ) {
        matchFound = true;

        // Check if this language is professionally translated
        const professionalLang = response[id].professional;
        for (const translator in response[id].translators) {
          // If the language is not professionally translated, or if this translator
          // is a professional, then add the name to the list of credits
          if (!professionalLang || response[id].translators[translator].professional) {
            const name = response[id].translators[translator].credit;
            translators.push(` ${name}`);
          }
        }
      }
    }

    const $translatorsCreditBubble = $(".translation_credits");
    if (translators.length > 0) {
      const $translatorCreditDiv = $("<div></div>");
      const $translatorNamesDiv = $("<div></div>");

      $translatorCreditDiv.addClass("speech-bubble-content").text(translate("translator_credit2"));
      $translatorNamesDiv.addClass("speech-bubble-content").text(translators.toString());
      $translatorsCreditBubble
        .empty()
        .addClass("speech-bubble")
        .removeClass("do-not-display")
        .append($translatorCreditDiv)
        .append($translatorNamesDiv);
    } else {
      $translatorsCreditBubble.addClass("do-not-display").empty();
    }
  });
}

function startSubscriptionSelection(title, url) {
  const list = document.getElementById("language_select");
  const noFilterListUtil = typeof FilterListUtil === "undefined" || FilterListUtil === null;
  const customFilterUtilUndefined = typeof CustomFilterListUploadUtil === "undefined";

  let noCustomFilterListUploadUtil;
  if (customFilterUtilUndefined) {
    noCustomFilterListUploadUtil = true;
  } else {
    noCustomFilterListUploadUtil = CustomFilterListUploadUtil === null;
  }

  if (!list || noFilterListUtil || noCustomFilterListUploadUtil) {
    activateTab("#filters");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delayedSubscriptionSelection = [title, url];
    return;
  }
  const translatedMsg = translate("subscribeconfirm", title);
  // eslint-disable-next-line no-alert
  if (window.confirm(translatedMsg)) {
    const existingFilterList = FilterListUtil.checkUrlForExistingFilterList(url);

    if (existingFilterList) {
      CustomFilterListUploadUtil.updateExistingFilterList(existingFilterList);
    } else if (/^https?:\/\/[^<]+$/.test(url)) {
      CustomFilterListUploadUtil.performUpload(url, `url:${url}`, title);
    } else {
      // eslint-disable-next-line no-alert
      alert(translate("failedtofetchfilter"));
    }
    // show the link icon for the new filter list, if the advance setting is set and the
    // show links button has been clicked (not visible)
    if (settings.show_advanced_options && $("#btnShowLinks").is(":visible") === false) {
      $(".filter-list-link").fadeIn("slow");
    }
  }
}

function setSelectedThemeColor() {
  let optionsTheme = "default_theme";
  if (settings && settings.color_themes && settings.color_themes.options_page) {
    optionsTheme = settings.color_themes.options_page;
  }

  // default_theme applied in html and does not need to be set
  if (optionsTheme !== "default_theme") {
    const body = document.querySelector("body");
    body.id = optionsTheme;
    body.dataset.theme = optionsTheme.replace("_theme", "");
  }

  $("#sidebar-adblock-logo").attr("src", `icons/${optionsTheme}/logo.svg`);
}

// Update Acceptable Ads UI in the General tab. To be called
// when there is a change in the AA and AA Privacy subscriptions
// Inputs: - checkAA: Bool, true if we must check AA
//         - checkAAprivacy: Bool, true if we must check AA privacy
const updateAcceptableAdsUIFN = function (checkAA, checkAAprivacy) {
  const $aaInput = $("input#acceptable_ads");
  const $aaPrivacyInput = $("input#acceptable_ads_privacy");
  const $aaPrivacyHelper = $("#aa-privacy-helper");
  const $aaYellowBanner = $("#acceptable_ads_info");

  if (!checkAA && !checkAAprivacy) {
    $aaInput.prop("checked", false);
    $aaPrivacyInput.prop("checked", false);
    $aaYellowBanner.slideDown();
    $aaPrivacyHelper.slideUp();
  } else if (checkAA && checkAAprivacy) {
    $aaInput.removeClass("feature").prop("checked", true).addClass("feature");
    $aaPrivacyInput.prop("checked", true);
    $aaYellowBanner.slideUp();
    if (navigator.doNotTrack === "1") {
      $aaPrivacyHelper.slideUp();
    } else {
      $aaPrivacyHelper.slideDown();
    }
  } else if (checkAA && !checkAAprivacy) {
    $aaInput.prop("checked", true);
    $aaPrivacyInput.prop("checked", false);
    $aaYellowBanner.slideUp();
    $aaPrivacyHelper.slideUp();
  }
};

const debounceWaitTime = 1000; // time in ms before
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const updateAcceptableAdsUI = debounced(debounceWaitTime, updateAcceptableAdsUIFN);

/**
 * Updates the visibility of social icons based on subscribed filter lists.
 *
 * Will set an according class name to the `<body>` element.
 */
async function updateSocialIconsVisibility() {
  const socialIconsStateClassName = "no-social-icons";
  const antiSocialListIds = ["antisocial", "annoyances", "fb_notifications"];

  const lists = await SubscriptionAdapter.getSubscriptionsMinusText();
  const hasAntiSocialSubscriptions = Object.keys(lists).some((id) =>
    antiSocialListIds.includes(id),
  );

  document.body.classList.toggle(socialIconsStateClassName, hasAntiSocialSubscriptions);
}

/**
 * Displays the user account management buttons based on authentication status.
 */
async function displayUserAccount() {
  const user = await ewe.account.getProfile();
  const loginBtn = $("#user-account-login");
  const manageBtn = $("#user-account-manage");

  // Dynamically update the login URL to include the premium status.
  // This is used to determine if the user should see the successful activation page
  const loginUrl = await sendTypeMessage("app.get", {
    what: "ctalink",
    link: "premium-manage",
    queryParams: {
      source: "options",
    },
  });
  loginBtn.attr("href", loginUrl);
  manageBtn.attr("href", loginUrl);

  if (user && user.email) {
    loginBtn.hide();
    manageBtn.show();
  } else {
    loginBtn.show();
    manageBtn.hide();
  }
}

$(async () => {
  await initializeProxies();

  storageSet(License.pageReloadedOnSettingChangeKey, false);

  const onSettingsChanged = function (name, currentValue) {
    if (name === "color_themes") {
      const optionsTheme = currentValue.options_page;
      const body = document.querySelector("body");
      body.id = optionsTheme;
      body.dataset.theme = optionsTheme.replace("_theme", "");
      $("#sidebar-adblock-logo").attr("src", `icons/${currentValue.options_page}/logo.svg`);
    }
  };

  settingsNotifier.on("settings.changed", onSettingsChanged);
  licenseNotifier.on("license.updated", () => {
    displayUserAccount();
  });

  setSelectedThemeColor();
  displayVersionNumber();
  localizePage();
  displayTranslationCredit();
  updateSocialIconsVisibility();
  displayUserAccount();
});

window.onbeforeunload = function leavingOptionsPage() {
  if (autoReloadingPage) {
    storageSet(License.pageReloadedOnSettingChangeKey, true);
  }
  storageSet(License.userSawSyncCTAKey, true);
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete" && typeof setLangAndDirAttributes === "function") {
    setLangAndDirAttributes();
  }
});

// delay opening of the port due to a race condition
// the delay allows the confirmation message to the user to function correctly
// when the options page is already open
window.setTimeout(() => {
  connectUIPort(({ addUIListener, postUIMessage }) => {
    addUIListener((message) => {
      if (message.type === "app.respond" && message.action === "addSubscription") {
        const subscription = message.args[0];
        startSubscriptionSelection(subscription.title, subscription.url);
      }
    });
    postUIMessage({
      type: "app.listen",
      filter: ["addSubscription"],
    });
  });
}, 250);
