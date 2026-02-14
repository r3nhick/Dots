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
/* global License, ServerMessages, getFormattedTabName */

const premiumPaymentAdblockUiServerLogger = new modulesAsGlobal.ewe.telemetry.ServerLogger(
  "adblock_ui",
);

const premiumTabNameMap = new Map([
  ["mab", "premium"],
  ["mab_themes", "themes"],
  ["mab_image_swap", "image_swap"],
  ["premium_filters", "premium_filters"],
]);

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
const MABPayment = (function mabPayment() {
  return {
    // Called to generate the correct info necessary to display/hide/use the CTA in the template
    // Input:
    // page:string - name of script of origin and should match the suffix in the CTA ids
    initialize(page) {
      return {
        id: `locked-user-pay-section-${page}`,
        linkId: `get-it-now-${page}`,
        url: License.MAB_CONFIG.payURL,
      };
    },
    // Called if the user hasn't paid and MAB is locked
    // Input:
    // payInfo:object - the object returned by initialize()
    // Returns:object - the object with functions handling the logic for Sync CTAs
    freeUserLogic(payInfo) {
      const $paySection = $(`#${payInfo.id}`);
      const $payLink = $(`#${payInfo.linkId}`);
      $payLink.attr("href", payInfo.url);
      $paySection.show();
    },
    // Called if the user is active and Premium is unlocked
    // Input:
    // payInfo:object - the object returned by initialize()
    paidUserLogic(payInfo) {
      const $paySection = $(`#${payInfo.id}`);
      $paySection.hide();
      $(".mab-feature.locked").removeClass("locked").addClass("hover-shadow");
      $(".theme-wrapper.locked").removeClass("locked");
      $(".overlay-icon").text("check");
    },
    // When the Options page loads we show the premium upsell on the
    // General, Filter Lists and Customize tabs if the user is not premium
    displayUpsellCTA: async () => {
      if (!License || !(await License.shouldShowMyAdBlockEnrollment())) {
        return;
      }

      $(".upsell-cta").show();
      ServerMessages.recordGeneralMessage("options_page_upsell_seen");
    },
    userClickedUpsellCTA: () => {
      ServerMessages.recordGeneralMessage("options_page_upsell_clicked");
    },
    userClickedPremiumCTA: () => {
      const openedTabName = getFormattedTabName();
      premiumPaymentAdblockUiServerLogger.behavior("options_page_tab_premium_cta", {
        tab: premiumTabNameMap.get(openedTabName),
        action: "clicked",
      });
      ServerMessages.recordGeneralMessage(`options_page_premium_cta_clicked_${openedTabName}`);
    },
  };
})();
