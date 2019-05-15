/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(){
    'use strict';

    var form = document.getElementById('product-select-form');
    var productSelect = document.getElementById('select-product');
    var versionSelect = document.querySelectorAll('.c-selection-version select');
    var languageSelect = document.querySelectorAll('.c-selection-language select');
    var platformSelect = document.querySelectorAll('.c-selection-platform select');
    var downloadInfo = document.querySelector('.c-download');
    var downloadInfoProduct = document.getElementById('download-info-product');
    var downloadInfoPlatform = document.getElementById('download-info-platform');
    var downloadInfoLanguage = document.getElementById('download-info-language');
    var downloadInfoButton = document.getElementById('download-button-primary');

    var FirefoxDownloader = {};

    /**
     * Set the currently selected product. The data-attribute on the <form> is
     * used to display the appropriate options for each individual product item.
     * @param {String} product `id`.
     */
    FirefoxDownloader.setProductSelection = function(id) {
        form.setAttribute('data-current', id);
    };

    /**
     * Get the currently selected product.
     * @returns {Object} product `id` and `label`.
     */
    FirefoxDownloader.getProductSelection = function() {
        return {
            'id': productSelect.options[productSelect.selectedIndex].value,
            'label': productSelect.options[productSelect.selectedIndex].innerText
        };
    };

    /**
     * Get the currently selected ESR product.
     * @param {String} `product`.
     * @returns {Object} product `id` and `label`.
     */
    FirefoxDownloader.getVersionSelection = function(product) {
        var currentOptions = document.querySelector('.c-selection-options[data-product="' + product.id + '"]');
        var currentVersion = currentOptions.querySelector('.c-selection-version select');

        return {
            'id': currentVersion.options[currentVersion.selectedIndex].value,
            'label': currentVersion.options[currentVersion.selectedIndex].innerText
        };
    };


    /**
     * Set the platform for all products.
     * @param {String} platform `id`.
     */
    FirefoxDownloader.setPlatformSelection = function(id) {
        // set the platform for each product platform drop down.
        for (var i = 0; i < platformSelect.length; i++) {
            var platforms = platformSelect[i].options;

            // go through the list of available platforms for a product.
            for (var j = 0; j < platforms.length; j++) {

                // only update if there's a match.
                if (platforms[j].value === id) {
                    platforms[j].selected = 'selected';
                    break;
                }
            }
        }
    };

    /**
     * Get platform based on user agent via window.site.platform.
     * @param {String} platform.
     * @returns {String} OS.
     */
    FirefoxDownloader.getPlatform = function(platform) {
        var system;

        /**
         * Note: we can't accurately detect 64bit arch via user agent
         * alone, so we assume most people want the fastest version.
         */
        switch(platform) {
        case 'windows':
            system = 'win64';
            break;
        case 'linux':
            system = 'linux64';
            break;
        case 'osx':
            system = 'osx';
            break;
        default:
            system = false;
        }

        return system;
    };

    /**
     * Get the currently selected platform for a given product.
     * @param {String} `product`.
     * @returns {Object} platform `id` and platform `label`.
     */
    FirefoxDownloader.getPlatformSelection = function(product) {
        var currentOptions = document.querySelector('.c-selection-options[data-product="' + product.id + '"]');
        var currentPlatform = currentOptions.querySelector('.c-selection-platform select');

        return {
            'id': currentPlatform.options[currentPlatform.selectedIndex].value,
            'label': currentPlatform.options[currentPlatform.selectedIndex].innerText
        };
    };

    /**
     * Set the language for all products.
     * @param {String} language `id`.
     */
    FirefoxDownloader.setLanguageSelection = function(id) {
        // set the language for each product language drop down.
        for (var i = 0; i < languageSelect.length; i++) {
            var languages = languageSelect[i].options;

            // go through the list of available languages for a product.
            for (var j = 0; j < languages.length; j++) {

                // only update if there's a match.
                if (languages[j].value === id) {
                    languages[j].selected = 'selected';
                    break;
                }
            }
        }
    };

    /**
     * Get the currently selected language for a given product.
     * @param {String} `product`.
     * @returns {Object} language `id` and language `label`.
     */
    FirefoxDownloader.getLanguageSelection = function(product) {
        var currentOptions = document.querySelector('.c-selection-options[data-product="' + product.id + '"]');
        var currentLanguage = currentOptions.querySelector('.c-selection-language select');

        return {
            'id': currentLanguage.options[currentLanguage.selectedIndex].value,
            'label': currentLanguage.options[currentLanguage.selectedIndex].innerText
        };
    };

    /**
     * Get the current language of the page.
     * @param {String} `localeCode` (optional).
     * @returns {String} page language.
     */
    FirefoxDownloader.getPageLanguage = function(localeCode) {
        var lang = localeCode || document.getElementsByTagName('html')[0].getAttribute('lang');

        if (lang) {
            // bedrock uses `en` for `en-US` pages to mark content as region neutral.
            lang = lang === 'en' ? 'en-US' : lang;
            return lang;
        }

        return false;
    };

    /**
     * Get the download link for a chosen product, platform and language.
     * @param {String} product id.
     * @param {String} platform id.
     * @param {String} language id.
     * @returns {String} download URL.
     */
    FirefoxDownloader.getDownloadLink = function(product, platform, language) {
        try {
            var productList = document.querySelector('.c-locale-list[data-product="' + product + '"]');
            var languageBuild = productList.querySelector('.c-locale-list-item[data-language="' + language + '"]');
            var platformLink = languageBuild.querySelector('.c-download-list > li > a[data-download-version="' + platform + '"]');

            if (platformLink) {
                return platformLink.href;
            } else {
                return new Error('platformLink is ' + platformLink);
            }
        } catch(e) {
            return e;
        }
    };

    /**
     * Set download button to a given url and update GTM attributes.
     * @param {String} url.
     * @param {Object} product.
     * @param {Object} platform.
     * @param {Object} language.
     */
    FirefoxDownloader.setDownloadLink = function(url, product, platform, language) {
        downloadInfoButton.href = url;
        downloadInfoButton.setAttribute('data-display-name', product.label);
        downloadInfoButton.setAttribute('data-download-version', platform.id);
        downloadInfoButton.setAttribute('data-language-version', language.id);

        if ((/^android/).test(platform.id)) {
            downloadInfoButton.setAttribute('data-download-os', 'Android');
        } else {
            downloadInfoButton.setAttribute('data-download-os', 'Desktop');
        }
    };

    /**
     * Display form error message and show fallback locale list.
     * @param {Object} instance of `Error`.
     */
    FirefoxDownloader.onError = function(e) {
        // show form error and hide download button.
        downloadInfo.classList.add('has-error');

        // show the fallback list of locales.
        document.getElementById('all-downloads').classList.add('is-fallback');

        if (e instanceof Error) {
            window.dataLayer.push({
                'event': 'in-page-interaction',
                'eAction': 'download error',
                'eLabel': e.name + e.message
            });
        }
    };

    /**
     * Make sure download link is from a trusted domain.
     * @param {String} url.
     * @returns {Boolean}.
     */
    FirefoxDownloader.isValidURL = function(url) {
        var bouncerURL = /^https:\/\/download.mozilla.org/;
        return typeof url === 'string' && (bouncerURL).test(url);
    };

    /**
     * Generate the download URL for the form button, based on the current for selection.
     */
    FirefoxDownloader.generateDownloadURL = function() {
        var product = FirefoxDownloader.getProductSelection();
        var platform = FirefoxDownloader.getPlatformSelection(product);
        var language = FirefoxDownloader.getLanguageSelection(product);
        var version = FirefoxDownloader.getVersionSelection(product);

        // Use `version.id` as ESR can sometimes offer 2 builds simultaneously.
        var download = FirefoxDownloader.getDownloadLink(version.id, platform.id, language.id);

        if (FirefoxDownloader.isValidURL(download)) {
            FirefoxDownloader.setDownloadLink(download, product, platform, language);
            FirefoxDownloader.setDownloadInfo(product.label, platform.label, language.label);

            // Remove error message is previously shown.
            if (downloadInfo.classList.contains('has-error')) {
                downloadInfo.classList.remove('has-error');
            }
        } else {
            FirefoxDownloader.onError(download);
        }
    };

    /**
     * Set the form info for what the current selection will download.
     */
    FirefoxDownloader.setDownloadInfo = function(product, platform, language) {
        downloadInfoProduct.innerText = product;
        downloadInfoPlatform.innerText = platform;
        downloadInfoLanguage.innerText = language;
    };

    /**
     * Product input <select> handler.
     * @param {Object} event object.
     */
    FirefoxDownloader.onProductChange = function(e) {
        FirefoxDownloader.setProductSelection(e.target.value);
        FirefoxDownloader.generateDownloadURL();
    };

    /**
     * Product ESR input <select> handler.
     * @param {Object} event object.
     */
    FirefoxDownloader.onVersionChange = function() {
        FirefoxDownloader.generateDownloadURL();
    };

    /**
     * Platform input <select> handler.
     * @param {Object} event object.
     */
    FirefoxDownloader.onPlatformChange = function(e) {
        FirefoxDownloader.setPlatformSelection(e.target.value);
        FirefoxDownloader.generateDownloadURL();
    };

    /**
     * Language input <select> handler.
     * @param {Object} event object.
     */
    FirefoxDownloader.onLanguageChange = function(e) {
        FirefoxDownloader.setLanguageSelection(e.target.value);
        FirefoxDownloader.generateDownloadURL();
    };

    /**
     * Enable form inputs, bind event handlers, and show the product options.
     */
    FirefoxDownloader.enableForm = function() {
        productSelect.addEventListener('change', FirefoxDownloader.onProductChange, false);
        productSelect.removeAttribute('disabled');

        for (var i = 0; i < platformSelect.length; i++) {
            platformSelect[i].addEventListener('change', FirefoxDownloader.onPlatformChange, false);
            platformSelect[i].removeAttribute('disabled');
        }

        for (var j = 0; j < languageSelect.length; j++) {
            languageSelect[j].addEventListener('change', FirefoxDownloader.onLanguageChange, false);
            languageSelect[j].removeAttribute('disabled');
        }

        for (var k = 0; k < versionSelect.length; k++) {
            versionSelect[k].addEventListener('change', FirefoxDownloader.onVersionChange, false);
            versionSelect[k].removeAttribute('disabled');
        }

        // show product options.
        downloadInfo.classList.remove('hidden');
    };

    /**
     * Initialize the form and show the default selection.
     */
    FirefoxDownloader.init = function() {
        var pageLang = FirefoxDownloader.getPageLanguage();
        var product = FirefoxDownloader.getProductSelection();
        var platform = FirefoxDownloader.getPlatform(window.site.platform);

        if (platform) {
            FirefoxDownloader.setPlatformSelection(platform);
        }

        if (pageLang && product.id && product.label) {
            FirefoxDownloader.setProductSelection(product.id);
            FirefoxDownloader.setLanguageSelection(pageLang);
            FirefoxDownloader.generateDownloadURL();
            FirefoxDownloader.enableForm();
        } else {
            FirefoxDownloader.onError();
        }
    };

    window.Mozilla.FirefoxDownloader = FirefoxDownloader;

})();
