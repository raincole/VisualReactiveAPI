function isAncestor(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./lib/utilities.ts" />

var Webview = (function () {
    function Webview() {
    }
    Webview.init = function () {
        Webview.widget = $('body').children()[0];
        var collection = document.querySelector('[vrac-collection]');
        var viewTemplate = document.querySelector('template[vrac-view]');
        if (collection && viewTemplate) {
            var view = viewTemplate['content'].cloneNode(true);
            collection.appendChild(view);
        }

        Webview.elements = $('[id^=VRAC],[class^=VRAC]').toArray();
    };

    Webview.userElementFromElement = function (element) {
        return element ? {
            uid: Webview.findUID(element),
            clientRect: element.getBoundingClientRect()
        } : null;
    };

    Webview.elementDetailFromElement = function (element) {
        return element ? {
            uid: Webview.findUID(element),
            isPlaceholder: $(element).attr("vrac-placeholder") !== undefined ? true : false,
            events: ['click', 'change', 'keypress'],
            attributes: ['value', 'innerHTML']
        } : null;
    };

    Webview.findUID = function (element) {
        var uid;
        var id = $(element).attr('id');
        if (id.indexOf('VRAC') === 0) {
            uid = '#' + id;
        } else {
            $(element).attr('class').split(/\s+/).forEach(function (klass) {
                if (klass.indexOf('VRAC') !== 0)
                    uid = '.' + klass;
            });
        }
        return uid;
    };

    Webview.offsetUserElement = function (userElement) {
        return {
            uid: userElement.uid,
            clientRect: Webview.offsetClientRect(userElement.clientRect, Webview.widget.getBoundingClientRect())
        };
    };

    Webview.offsetClientRect = function (clientRect, rootClientRect) {
        return {
            width: clientRect.width,
            height: clientRect.height,
            top: clientRect.top - rootClientRect.top,
            bottom: clientRect.bottom - rootClientRect.top,
            left: clientRect.left - rootClientRect.left,
            right: clientRect.right - rootClientRect.left
        };
    };

    Webview.startSelecting = function () {
        Webview.selecting = true;
        $(Webview.widget).on('mousemove', function (event) {
            var element = Webview.getCurrentElement();
            Webview.setSelectingMask(element);
        });
    };

    Webview.stopSelecting = function () {
        Webview.selecting = false;
        $(Webview.widget).off('mousemove');
        $(Webview.widget).off('mouseleave');
    };

    Webview.clearSelection = function () {
        Webview.setSelectingMask(null);
    };

    Webview.getCurrentElementDetail = function () {
        return Webview.elementDetailFromElement(Webview.getCurrentElement());
    };

    Webview.getCurrentElement = function () {
        var element = null;
        Webview.elements.forEach(function (elem) {
            if (Webview.contains(elem.getBoundingClientRect(), Webview.mouseX, Webview.mouseY)) {
                if (!element || !isAncestor(elem, element)) {
                    element = elem;
                }
            }
        });
        return element;
    };

    Webview.contains = function (clientRect, x, y) {
        return x >= clientRect.left && x <= clientRect.right && y >= clientRect.top && y <= clientRect.bottom;
    };

    Webview.setSelectingMask = function (element) {
        var selectingClass = 'vrac-agate-selecting';

        $(Webview.selectingMask).remove();
        $('.' + selectingClass).removeClass(selectingClass);

        if (element) {
            $(element).addClass(selectingClass);

            var $selectingMask = $('<div>');
            var clientRect = element.getBoundingClientRect();
            $('body').append($selectingMask);
            $selectingMask.css({
                position: 'absolute',
                top: clientRect.top - 4,
                left: clientRect.left - 4,
                width: clientRect.width + 8,
                height: clientRect.height + 8,
                borderRadius: 4,
                backgroundColor: 'rgb(67, 127, 174)',
                opacity: 0.5
            });
            $selectingMask.on('mouseleave', function (event) {
                if (Webview.selecting)
                    Webview.clearSelection();
            });
            Webview.selectingMask = $selectingMask.get(0);
        }
    };
    Webview.selecting = false;
    return Webview;
})();

var VRAC = VRAC || {};
VRAC.Webview = Webview;

$(document).on('mousemove', function (event) {
    Webview.mouseX = event.clientX;
    Webview.mouseY = event.clientY;
});

Webview.init();
Webview.startSelecting();
