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
/* global browser, translate, storageGet, localizePage, storageSet,
   selected, selectedOnce, showHelpSetupPage, setLangAndDirAttributes */

let errorOccurred = false;

const popupAdblockUIServerLogger = new modulesAsGlobal.ewe.telemetry.ServerLogger("adblock_ui");
const popupSentry = modulesAsGlobal.ewe.sentry;

const useFlexDisplayElements = [
  "allowlisted_subsection",
  "disabled_site_title",
  "domain_paused_subsection",
  "hostname",
  "pause_subsection",
];

const betaExtId = "pljaalgmajnlogcgiohkhdmgpomjcihk";

const processError = function (err, stack, message) {
  // the translation messages are hard code in the JS to avoid any dependency
  // on Chrome extension APIs during error handling
  const translateErrorMsg = function (key) {
    const text = {
      error_msg_header: {
        en: "Oops!",
      },
      error_msg_partI: {
        en: "We're sorry, the AdBlock menu had trouble loading.",
      },
      error_msg_reload_partI: {
        en: "Next, try reloading the extension by ",
      },
      error_msg_reload_partII: {
        en: "clicking here.",
      },
      error_msg_help_partI: {
        en: "If that doesn’t work, ",
      },
      error_msg_help_partII: {
        en: "check here for more help.",
      },
    };
    const locale = navigator.language.substring(0, 2);
    const msg = text[key] || {};
    return msg[locale] || msg.en;
  };

  const errorPayload = {};

  errorOccurred = true;
  errorPayload.msg = err.message || message || "no message";
  errorPayload.src = err.source || stack || "no source";
  errorPayload.line = err.lineno || "anywhere";
  errorPayload.col = err.colno || "anywhere";
  errorPayload.err = err.error || "no error";
  if (typeof err === "string") {
    errorPayload.msg = err;
  }

  const errorMsgDiv = document.getElementById("div_status_error");
  if (errorMsgDiv) {
    // send error to Sentry
    const error = new Error(`Popup menu error: ${errorPayload.msg}`);
    error.name = "PopupMenuError";
    error.stack =
      `Popup menu error: ${errorPayload.msg}\n` +
      `at ${errorPayload.src}:${errorPayload.line}:${errorPayload.col}`;
    popupSentry.reportError(error);

    const reloadAnchor = document.getElementById("reload");
    if (browser && browser.runtime && browser.runtime.reload) {
      selectedOnce(reloadAnchor, () => {
        try {
          browser.runtime.reload();
        } catch (e) {
          const reloadMsg = document.getElementById("reload_msg");
          if (reloadMsg) {
            reloadMsg.style.display = "none";
          }
          const thirdMsg = document.getElementById("third_msg");
          if (thirdMsg) {
            thirdMsg.style.display = "block";
          }
        }
      });
    } else {
      reloadAnchor.style.display = "none";
    }

    document.querySelectorAll(".separator").forEach((el) => {
      const elem = el;
      elem.style.display = "none";
    });

    const headerIconsDiv = document.getElementById("header-icons");
    if (headerIconsDiv) {
      headerIconsDiv.style.display = "none";
    }

    const divSlideoutDiv = document.getElementById("div_slideout");
    if (divSlideoutDiv) {
      divSlideoutDiv.style.display = "none";
    }

    document.querySelectorAll("*[i18n_error^='error_msg']").forEach((el) => {
      const elem = el;
      elem.innerText = translateErrorMsg(elem.getAttribute("i18n_error"));
    });

    errorMsgDiv.style.display = "block";
  }
};

// the tab/page object, which contains |id| and |url| of
// the current tab
let pageInfo = null;

const popupMenuCtaClosedKey = "popup_menu_cta_closed";
const showPopupMenuThemesCtaKey = "popup_menu_themes_cta";
const popupMenuFreeDCCtaClosedKey = "popup_menu_free_dc_cta_closed";
const popupMenuDCCtaClosedKey = "popup_menu_dc_cta_closed";
const popupMenuVPNCtaClosedKey = "popup_menu_vpn_cta_closed";

const shown = {};
let itemClicked = false;

const sendMessageWithNoResponse = function (message) {
  void browser.runtime.sendMessage(message);
};

const show = function (elementIds) {
  elementIds.forEach((elementId) => {
    shown[elementId] = true;
  });
};

const closePopup = function () {
  itemClicked = true;
  window.close();
};

// This handles clicks on help icon from More Options and related sub-pages (aka
// those with a modular header). It can be removed when we refactor
// the help page to use subpages and links instead of mini-SPA. See button/header.js
// for call
const checkAndEnableHelp = function () {
  if (document.location.search && document.location.search.includes("showHelp")) {
    showHelpSetupPage();
  }
};

/**
 * Return the text used for the "NEW" badge. Replicates the logic in alias/icon.js
 * @returns The "NEW" badge text
 */
const getNewBadgeText = () => {
  const isFirefox = navigator.userAgent.match(/(?:Firefox)\/([\d.]+)/);
  if (isFirefox) {
    return "💥";
  }

  const text = browser.i18n.getMessage("new_badge");
  if (text.length < 5) {
    return text.toUpperCase();
  }

  return "New".toUpperCase();
};

const start = async function () {
  const userClosedCta = storageGet(popupMenuCtaClosedKey);
  const userClosedFreeDCCta = storageGet(popupMenuFreeDCCtaClosedKey);
  const showThemesCTA = storageGet(showPopupMenuThemesCtaKey);
  const userClosedDCCta = storageGet(popupMenuDCCtaClosedKey);
  const userClosedVPNCta = storageGet(popupMenuVPNCtaClosedKey);

  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete" && typeof setLangAndDirAttributes === "function") {
      setLangAndDirAttributes();
    }
  });

  localizePage();

  // Set menu entries appropriately for the selected tab.
  $(".premium-cta, .separator").hide();

  let tabId;
  if (document.location.search && document.location.search.indexOf("tabId") > 0) {
    const params = new URLSearchParams(document.location.search);
    tabId = params.get("tabId");
    if (tabId === "error") {
      // allows testing of the error handling logic
      throw new Error("anError");
    }
  }

  const info = await browser.runtime.sendMessage({ command: "getCurrentTabInfo", tabId });

  let popupMenuTheme = "default_theme";
  if (info.settings && info.settings.color_themes && info.settings.color_themes.popup_menu) {
    popupMenuTheme = info.settings.color_themes.popup_menu;
  }

  if (info) {
    const currentBadgeText = await browser.action.getBadgeText({ tabId: info.id });
    const newBadgeText = getNewBadgeText();
    let { newBadgeTextReason } = info;
    const isBadgeTextNew = currentBadgeText === newBadgeText;
    if (!isBadgeTextNew) {
      newBadgeTextReason = "";
    }

    const genMsgData = {
      command: "recordGeneralMessage",
      msg: "popup_opened",
      additionalParams: { isBadgeTextNew, reason: newBadgeTextReason },
    };
    popupAdblockUIServerLogger.behavior("popup_opened", {
      isBadgeTextNew,
      reason: newBadgeTextReason,
    });
    sendMessageWithNoResponse(genMsgData);
    sendMessageWithNoResponse({ command: "resetBadgeText" });
    void modulesAsGlobal.messaging.send("adblock:cleanUpSevenDayAlarm");

    if (info && info.errorStr) {
      processError(info.errorStr, info.stack, info.message);
      return;
    }
    $(window).on("beforeunload", () => {
      if (!itemClicked) {
        sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "popup_closed" });
      }
    });

    // Cache response object for later use
    pageInfo = info;
    let parsedHostname = "";
    try {
      pageInfo.url = new URL(info.url);
      parsedHostname = pageInfo.url.hostname.replace(/^www\./, "");
    } catch (err) {
      pageInfo.url = null;
    }

    show(["svg_options"]);
    if (info.paused) {
      parsedHostname = translate("disabled");
      show([
        "hostname",
        "primary_section",
        "div_all_paused_msg",
        "all_paused_subsection",
        "svg_options",
        "help_link",
      ]);
    } else if (info.domainPaused) {
      show([
        "hostname",
        "primary_section",
        "div_domain_paused_msg",
        "domain_paused_subsection",
        "svg_options",
        "help_link",
      ]);
    } else if (info.disabledSite) {
      show([
        "disabled_site_title",
        "disabled_site_separator",
        "disabled_site_section",
        "svg_options",
        "help_link",
      ]);
    } else if (info.whitelisted) {
      show([
        "hostname",
        "primary_section",
        "div_domain_allowlisted_msg",
        "allowlisted_subsection",
        "svg_options",
        "help_link",
      ]);
    } else {
      show(["hostname", "primary_section", "popup_sections", "pause_subsection"]);
    }
    if (parsedHostname) {
      $("#hostname").text(parsedHostname);
    }

    checkAndEnableHelp();

    const disabledOrallowlisted = info.disabledSite || !info.whitelisted;
    const eligibleForUndo = !info.paused && !info.domainPaused && disabledOrallowlisted;
    if (
      eligibleForUndo &&
      info.customFilterCount &&
      browser.runtime.getManifest().manifest_version === 2
      // The 'undo' functionality is only available in MV2 extensions
      // until issue #305 is implemented
    ) {
      show(["div_undo"]);
    }

    if (popupMenuTheme && browser.runtime && browser.runtime.id === betaExtId) {
      $(".header-logo").attr("src", `icons/${popupMenuTheme}/beta_logo.svg`);
    }

    // CTAs
    if (
      !userClosedVPNCta && // VPN CTA
      !info.disabledSite &&
      !info.whitelisted
    ) {
      show(["div_vpn_cta"]);
      popupAdblockUIServerLogger.behavior("vpn_cta", { action: "seen" });
      sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "vpn_cta_seen" });
    } else if (
      // Premium CTAs
      info.showMABEnrollment &&
      userClosedCta &&
      showThemesCTA &&
      userClosedFreeDCCta
    ) {
      show(["div_premium_themes_cta"]);
      $("#div_premium_themes_cta").attr("data-theme-cta", info.popupMenuThemeCTA);
      const theme = info.popupMenuThemeCTA ? info.popupMenuThemeCTA.replace("_theme", "") : "";
      popupAdblockUIServerLogger.behavior("premium_themes_cta", { theme, action: "seen" });
      sendMessageWithNoResponse({
        command: "recordGeneralMessage",
        msg: "premium_themes_cta_seen",
        additionalParams: { theme },
      });
    } else if (info.showMABEnrollment && !userClosedCta && userClosedFreeDCCta) {
      show(["div_myadblock_enrollment_v2"]);
      popupAdblockUIServerLogger.behavior("premium_upsell_cta", { action: "seen" });
    } else if (info.showMABEnrollment && !userClosedFreeDCCta) {
      show(["div_free_dc_cta"]);
      popupAdblockUIServerLogger.behavior("free_dc_cta", { action: "seen" });
      sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "free_dc_cta_seen" });
    } else if (info.showDcCTA && !userClosedDCCta && !info.disabledSite) {
      show(["div_premium_dc_cta"]);
      popupAdblockUIServerLogger.behavior("premium_dc_cta", { action: "seen" });
      sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "premium_dc_cta_seen" });
    }

    if (info.activeLicense === true) {
      $("#premium_status_msg").css("display", "inline-flex");
    }

    if (errorOccurred) {
      return;
    }
    for (const div in shown) {
      if (shown[div]) {
        if (!useFlexDisplayElements.includes(div)) {
          $(`#${div}`).show();
        } else if (shown[div] && useFlexDisplayElements.includes(div)) {
          $(`#${div}`).css("display", "flex");
        }
      }
    }

    if (info.paused || info.domainPaused || info.disabledSite || info.whitelisted) {
      $("#popup_sections").hide();
    }
  }

  // Click handlers
  selected("#btn_unpause_all", async () => {
    popupAdblockUIServerLogger.behavior("resume_adblock");
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "unpause_clicked" });
    await browser.runtime.sendMessage({ command: "adblockIsPaused", newValue: false });
    await browser.runtime.sendMessage({ command: "updateButtonUIAndContextMenus" });
    closePopup();
  });

  selected("#btn_unpause_once", async () => {
    popupAdblockUIServerLogger.behavior("resume_adblock");
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "domain_unpause_clicked" });
    if (pageInfo.url) {
      await browser.runtime.sendMessage({
        command: "removeAllAllowlistRulesForTab",
        tabId: pageInfo.id,
      });
      await browser.runtime.sendMessage({ command: "updateButtonUIAndContextMenus" });
      closePopup();
    }
  });

  selected("#div_myadblock_enrollment_v2", async () => {
    popupAdblockUIServerLogger.behavior("premium_upsell_cta", { action: "clicked" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "myadblock_cta_clicked" });
    await browser.runtime.sendMessage({ command: "openTab", urlToOpen: pageInfo.premiumPayURL });
    closePopup();
  });

  selected("#mab_new_cta_close", (event) => {
    event.stopPropagation();
    popupAdblockUIServerLogger.behavior("premium_upsell_cta", { action: "closed" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "myadblock_cta_closed" });
    $("#div_myadblock_enrollment_v2").slideUp();
    storageSet(popupMenuCtaClosedKey, true);
    storageSet(showPopupMenuThemesCtaKey, true);
  });

  selected("#div_free_dc_cta", async () => {
    storageSet(popupMenuFreeDCCtaClosedKey, true);
    popupAdblockUIServerLogger.behavior("free_dc_cta", { action: "clicked" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "free_dc_cta_clicked" });
    await browser.runtime.sendMessage({
      command: "openTab",
      urlToOpen: "https://getadblock.com/premium/enrollment/distraction-control/",
    });
    closePopup();
  });

  selected("#div_free_dc_cta_close", (event) => {
    event.stopPropagation();
    popupAdblockUIServerLogger.behavior("free_dc_cta", { action: "closed" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "free_dc_cta_closed" });
    $("#div_free_dc_cta").slideUp();
    storageSet(popupMenuFreeDCCtaClosedKey, true);
  });

  selected("#div_vpn_cta", async (event) => {
    event.stopPropagation();
    storageSet(popupMenuVPNCtaClosedKey, true);
    popupAdblockUIServerLogger.behavior("vpn_cta", { action: "clicked" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "vpn_cta_clicked" });
    await browser.runtime.sendMessage({
      command: "openTab",
      urlToOpen: "https://vpn.getadblock.com/?s=ap1",
    });
    closePopup();
  });

  selected("#vpn_cta_close", (event) => {
    event.stopPropagation();
    popupAdblockUIServerLogger.behavior("vpn_cta", { action: "closed" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "vpn_cta_closed" });
    $("#div_vpn_cta").slideUp();
    storageSet(popupMenuVPNCtaClosedKey, true);
  });

  selected("#div_premium_themes_cta", async (event) => {
    event.stopPropagation();
    const theme = info.popupMenuThemeCTA ? info.popupMenuThemeCTA.replace("_theme", "") : "";
    popupAdblockUIServerLogger.behavior("premium_themes_cta", { theme, action: "clicked" });
    sendMessageWithNoResponse({
      command: "recordGeneralMessage",
      msg: "premium_themes_cta_clicked",
      additionalParams: { theme },
    });
    await browser.runtime.sendMessage({
      command: "openTab",
      urlToOpen: browser.runtime.getURL("options.html#mab-themes"),
    });
    closePopup();
  });

  selected("#close-themes-cta", (event) => {
    event.stopPropagation();
    const theme = info.popupMenuThemeCTA ? info.popupMenuThemeCTA.replace("_theme", "") : "";
    popupAdblockUIServerLogger.behavior("premium_themes_cta", { theme, action: "closed" });
    sendMessageWithNoResponse({
      command: "recordGeneralMessage",
      msg: "premium_themes_cta_closed",
      additionalParams: { theme },
    });
    $("#div_premium_themes_cta").slideUp();
    storageSet(showPopupMenuThemesCtaKey, false);
  });

  selected("#div_premium_dc_cta", async (event) => {
    event.stopPropagation();
    storageSet(popupMenuDCCtaClosedKey, true);
    popupAdblockUIServerLogger.behavior("premium_dc_cta", { action: "clicked" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "premium_dc_cta_clicked" });
    await browser.runtime.sendMessage({
      command: "openTab",
      urlToOpen: browser.runtime.getURL("options.html#premiumfilters"),
    });
    closePopup();
  });

  selected("#close-premium-dc-cta", (event) => {
    event.stopPropagation();
    storageSet(popupMenuDCCtaClosedKey, true);
    popupAdblockUIServerLogger.behavior("premium_dc_cta", { action: "closed" });
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "premium_dc_cta_closed" });
    $("#div_premium_dc_cta").slideUp();
  });

  $("#div_vpn_cta")
    .on("mouseenter", () => {
      $("#vpn_cta").text(translate("vpn_cta_msg_hover"));
    })
    .on("mouseleave", () => {
      $("#vpn_cta").text(translate("vpn_cta_msg"));
    });

  $("#div_myadblock_enrollment_v2")
    .on("mouseenter", () => {
      $("#mab_new_cta_text").text(translate("new_cta_hovered_text"));
    })
    .on("mouseleave", () => {
      $("#mab_new_cta_text").text(translate("new_cta_default_text"));
    });

  $("#div_premium_dc_cta")
    .on("mouseenter", () => {
      $("#dc-cta-text").text(translate("check_out_dc"));
    })
    .on("mouseleave", () => {
      $("#dc-cta-text").text(translate("new_premium_feature"));
    });

  $("#div_free_dc_cta")
    .on("mouseenter", () => {
      $("#free-dc-cta-text").text(translate("get_distractioncontrol"));
    })
    .on("mouseleave", () => {
      $("#free-dc-cta-text").text(translate("block_floating_videos"));
    });

  $("#div_premium_themes_cta")
    .on("mouseenter", function handleIn() {
      $("#themes-cta-text").text(translate("check_out_themes"));
      const currentThemeCTA = $(this).attr("data-theme-cta");
      const body = document.querySelector("body");
      body.id = currentThemeCTA;
      body.dataset.theme = currentThemeCTA;

      let logoFileName = "logo.svg";
      if (browser.runtime && browser.runtime.id === betaExtId) {
        logoFileName = "beta_logo.svg";
      }
      $(".header-logo").attr("src", `icons/${currentThemeCTA}/${logoFileName}`);
      // eslint-disable-next-line prefer-arrow-callback
    })
    .on("mouseleave", function handleOut() {
      $("#themes-cta-text").text(translate("adblock_looked_like_this"));
      const body = document.querySelector("body");
      body.id = popupMenuTheme;
      body.dataset.theme = popupMenuTheme;

      let logoFileName = "logo.svg";
      if (browser.runtime && browser.runtime.id === betaExtId) {
        logoFileName = "beta_logo.svg";
      }
      $(".header-logo").attr("src", `icons/${popupMenuTheme}/${logoFileName}`);
    });
}; // end of start

start().catch((err) => {
  processError(err);
});
