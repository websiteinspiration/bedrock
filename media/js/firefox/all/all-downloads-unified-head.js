/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(){
    'use strict';

    function isSupported() {
        return 'querySelector' in document &&
               'querySelectorAll' in document &&
               'addEventListener' in window &&
               'classList' in document.createElement('div');
    }

    if (isSupported()) {
        document.getElementsByTagName('html')[0].classList.add('is-supported');
    }

})();
