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
/* global browser, License, localizePage, determineUserLanguage, getStorageCookie, setStorageCookie,
   THIRTY_MINUTES_IN_MILLISECONDS, setLangAndDirAttributes, storageSet, storageGet, ewe,
   initializeProxies, ServerMessages, sendTypeMessage, settings:true, */

const userSeenNewPFPageKey = "options_menu_pf_key";
let userSeenNewPFPage = storageGet(userSeenNewPFPageKey);

const ServerLogger = new ewe.telemetry.ServerLogger("adblock_ui");

function showNewIcon() {
  $("#pfIcon").fadeOut();
  $("#new-pf-icon").fadeIn();
  $("#pf-menu-item").addClass("newItem");
}

function showPFIcon() {
  $("#pfIcon").fadeIn();
  $("#new-pf-icon").fadeOut();
  $("#pf-menu-item").removeClass("newItem");
}

function hideBothIcons() {
  $("#pfIcon").fadeOut();
  $("#new-pf-icon").fadeOut();
  $("#pf-menu-item").removeClass("newItem");
}

function checkWindowWidth() {
  const currentWidth = $(window).width();
  const minimumWindowWidthFullMenu = 871;
  if (!userSeenNewPFPage) {
    showNewIcon();
  } else if (currentWidth <= minimumWindowWidthFullMenu) {
    if (!userSeenNewPFPage) {
      showNewIcon();
    } else {
      showPFIcon();
    }
  } else {
    hideBothIcons();
  }
}

function shouldShowDCNewIcon() {
  if (!userSeenNewPFPage) {
    window.addEventListener("resize", checkWindowWidth);
    checkWindowWidth();
  }
}

function checkPFNewIcon(tabID) {
  if (tabID === "#premium-filters") {
    userSeenNewPFPage = true;
    storageSet(userSeenNewPFPageKey, userSeenNewPFPage);
    checkWindowWidth();
  }
}

// Output an array of all tab ids in HTML
function allTabIDs() {
  return $(".tablink")
    .map(function getTabId() {
      return $(this).attr("href");
    })
    .get();
}

// Inputs:
//    - tabID -- string (tab ID to activate)
// Output:
//    - tabID -- string (valid tab ID to activate)
function validateTabID(tabID) {
  if (!tabID || !allTabIDs().includes(tabID)) {
    return "#general";
  }
  return tabID;
}

// Load tab panel script in the document when the tab is
// activated for the first time.
// Inputs: $activeTabPanel -- jQuery Object
function loadTabPanelScript($activeTabPanel) {
  const activePanelID = $activeTabPanel.attr("id");
  const scriptToLoad = `adblock-options-${activePanelID}.js`;
  const scriptTag = document.createElement("script");
  const alreadyLoaded = $(`script[src='${scriptToLoad}']`).length > 0;

  if (alreadyLoaded) {
    return;
  } // don't load the same script twice

  // Don't use $().append(scriptTag) because CSP blocks eval
  scriptTag.src = scriptToLoad;
  document.body.appendChild(scriptTag);
}

// Display tabs and panel based on the current active tab
// Inputs: $activeTab - active tab jQuery object
function displayActiveTab($activeTab) {
  const $activeTabPanel = $($activeTab.attr("href"));
  loadTabPanelScript($activeTabPanel);
  $activeTabPanel.show();
  if (document.readyState === "complete") {
    setLangAndDirAttributes();
  }
}

function activateTab(tabHref) {
  const tabID = validateTabID(tabHref);
  const $activeTab = $(`.tablink[href='${tabID}']`);
  const $allTabs = $(".tablink");
  const $allTabPanels = $(".tab");

  $allTabs.removeClass("active");
  $allTabPanels.hide();

  $activeTab.addClass("active");

  setStorageCookie("active_tab", $activeTab.attr("href"), THIRTY_MINUTES_IN_MILLISECONDS);

  displayActiveTab($activeTab);

  checkPFNewIcon(tabID);
}

// displayMABFeedbackCTA checks if the user has set their language to english and
// displays the feedback call to action on Premium related options pages:
//
// Premium
// Premium - Themes
// Premium - Image Swap
// Premium - Sync
const displayMABFeedbackCTA = function () {
  const lang = determineUserLanguage();
  if (lang === "en" || lang.startsWith("en")) {
    $("footer.myadblock_feedback_footer").css("display", "flex");
    const $feedbackButton = $(".mab-feedback-button, #support-feedback-button");
    $feedbackButton.on("click", async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      let url = "https://portal.productboard.com/getadblock/4-adblock-extension";
      if (await License.isActiveLicense()) {
        url = "https://portal.productboard.com/getadblock/5-adblock-extension-premium";
      }
      browser.tabs.create({ url });
      $feedbackButton.trigger("blur");
    });
  }
};

const hideAdvancedOptionsWhenNeeded = function () {
  if (!settings.show_advanced_options) {
    $(".advanced").hide();
  }
};

/**
 * Display the login CTA if the user is not logged in.
 * If the user is logged in, hide the CTA.
 * @returns {Promise<void>}
 */
async function displayUserAccountLoginCTA() {
  const user = await ewe.account.getProfile();
  const loginCTAButtons = $(".user-account-login-cta");

  // Dynamically update the login URL to include the premium status.
  // This is used to determine if the user should see the successful activation page
  const loginUrl = await sendTypeMessage("app.get", {
    what: "ctalink",
    link: "premium-manage",
    queryParams: {
      source: "options",
    },
  });
  loginCTAButtons.attr("href", loginUrl);

  if (user && user.email) {
    loginCTAButtons.hide();
  } else {
    loginCTAButtons.show();
  }
}

// Load all HTML templates in respective tab panels
// and translate strings on load completion
function loadTabPanelsHTML() {
  const $tabPanels = $("#tab-content .tab");
  let tabsLoaded = 1; // track the tabs that are loaded
  $.each($tabPanels, (i, panel) => {
    const $panel = $(panel);
    const panelID = $(panel).attr("id");

    const panelHTML = `adblock-options-${panelID}.html`;
    $panel.load(panelHTML, () => {
      localizePage();
      document.documentElement.classList.add(
        `manifest-v${browser.runtime.getManifest().manifest_version}`,
      );
      tabsLoaded += 1;
      if (tabsLoaded >= $tabPanels.length) {
        // all tabs have been loaded and localized - call
        // any post processing handlers here.
        displayMABFeedbackCTA();
        shouldShowDCNewIcon();
        hideAdvancedOptionsWhenNeeded();
        displayUserAccountLoginCTA();
      }
    });
  });
}

// Get active tab ID from cookie or URL hash and activate tab
// and display the tabs and tabel accordingly
function activateTabOnPageLoad() {
  // Set active tab from cookie
  let activeTabID = getStorageCookie("active_tab");

  // Set active tab from hash (has priority over cookie)
  if (window.location && window.location.hash) {
    [activeTabID] = window.location.hash.split("_");
  }
  activateTab(activeTabID);
}

function getFormattedTabName() {
  return $(".tablink.active span").parent().attr("href").replace("#", "").replace(/-/g, "_");
}

const tabNameMap = new Map([
  ["stats_tabs", "stats"],
  ["general", "general"],
  ["filters", "filter_lists"],
  ["customize", "customize"],
  ["support", "support"],
  ["mab", "premium"],
  ["mab_themes", "themes"],
  ["mab_image_swap", "image_swap"],
  ["premium_filters", "premium_filters"],
]);

$(async () => {
  await initializeProxies();
  // 1. load all the tab panels templates in respective panel DIVs
  loadTabPanelsHTML();

  // 2. hide the 'Premium' tab, if the Registry or Group Policy has requested it
  // Note: this check is done here to minimize the chance of the user
  //       seeing the Options menu change when the 'Premium' item is removed
  if (License.shouldShowPremiumCTA() === false) {
    $('#sidebar-tabs a[href="#mab"]').parent().hide();
  }

  // 3. Activate tab on page load with cookie, URL hash or default tabID
  activateTabOnPageLoad();

  // 4. Activate tab when clicked
  $(".tablink").on("click", function tabLinkClicked() {
    const tabID = $(this).attr("href");
    activateTab(tabID);
    const tabName = getFormattedTabName();
    ServerMessages.recordGeneralMessage(`options_page_tab_clicked_${tabName}`);
    ServerLogger.behavior("options_page_tab", { tab: tabNameMap.get(tabName), action: "clicked" });
  });
  const openedTabName = getFormattedTabName();
  ServerMessages.recordGeneralMessage(`options_page_opened_tab_${openedTabName}`);
  ServerLogger.behavior("options_page_tab", {
    tab: tabNameMap.get(openedTabName),
    action: "opened",
  });

  // 5. Display CTA - a future library update will support
  // automatically injecting the CTA HTML as well.
  displayMABFeedbackCTA();
});
