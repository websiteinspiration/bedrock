/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(Mozilla){
    'use strict';

    var helpIcon = document.getElementById('icon-browser-help');
    var browserHelpContent = document.getElementById('browser-help');

    Mozilla.FirefoxDownloader.init();

    helpIcon.addEventListener('click', function(e) {
        e.preventDefault();

        Mzp.Modal.createModal(this, browserHelpContent, {
            title: helpIcon.textContent,
            className: 'browser-help-modal'
        });

        window.dataLayer.push({
            'event': 'in-page-interaction',
            'eAction': 'link click',
            'eLabel': 'Get Help'
        });
    }, false);

})(window.Mozilla);
