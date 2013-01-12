
/**
 * Module dependencies
 */

var events = require('events');
var html = require('./template');
var classes = {
    content : '.wrap',
    ptr     : '.pull-to-refresh',
    arrow   : '.arrow',
    spinner : '.spinner',
    pull    : '.pull',
    release : '.release',
    loading : '.loading'
};

/**
 * Expose `PullToRefresh`
 */

module.exports = PullToRefresh;


function PullToRefresh (el, options) {
    if (!(this instanceof PullToRefresh)) return new PullToRefresh(el);
    if (!el) throw new TypeError('PullToRefresh() requires an element');
    this.el = el;
    this.el.innerHTML = html;
    //this.child = el.children[0];
    this.messages = {
        pull: options.pull || 'Pull to refresh',
        release: options.release || 'Release to refresh',
        loading: options.loading || 'Loading...'
    };

    for (var key in classes) this[key] = el.querySelector(classes[key]);
}

PullToRefresh.prototype.bind = function () {
    this.events = events(this.child, this);
    this.events.bind('mousedown', 'ontouchstart');
    this.events.bind('mousemove', 'ontouchmove');
    this.events.bind('touchstart');
    this.events.bind('touchmove');

    this.docEvents = events(document, this);
    this.docEvents.bind('mouseup', 'ontouchend');
    this.docEvents.bind('touchend');
};
/*PullToRefresh.prototype.render = function () {
    document.querySelector();
};*/
PullToRefresh.prototype.unbind = function () {
    this.events.unbind();
    this.docEvents.unbind();
};

PullToRefresh.prototype.ontouchstart = function(e){

};

PullToRefresh.prototype.ontouchmove = function(e){

};

PullToRefresh.prototype.ontouchend = function(e){

};



PullToRefresh.prototype.pullMsg = function (message) {
    this.messages.pull = message;
};

PullToRefresh.prototype.releaseMsg = function (message) {
    this.messages.release = message;
};

PullToRefresh.prototype.loadingMsg = function (message) {
    this.messages.loading = message;
};

