
/**
 * Module dependencies
 */

var events = require('events');
var Emitter = require('emitter');
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
    if (!(this instanceof PullToRefresh)) return new PullToRefresh(el, options);
    if (!el) throw new TypeError('PullToRefresh() requires an element');
    Emitter.call(this);
    options = options || {};
    this.el = el;
    var self = this;
    this.child = el.children[0];
    this.text = {
        pull: options.pull || 'Pull to refresh',
        release: options.release || 'Release to refresh',
        loading: options.loading || 'Loading...'
    };

    this.render();
    this.bind();

    setTimeout(function () {
        self.height = self.ptr.offsetHeight;
        self.arrowDelay = self.height / 3 * 2;
    }, 0);

    this.isActivated = false,
    this.isLoading = false;
}

/**
* Inherits from `Emitter.prototype`.
*/

Emitter(PullToRefresh.prototype);

PullToRefresh.prototype.render = function () {
    var div = document.createElement('div');
    div.innerHTML = html;
    div.setAttribute('class', 'pull-to-refresh');
    this.el.insertBefore(div, this.el.firstChild);
    for (var key in classes) this[key] = this.el.querySelector(classes[key]);
    setText(this.release, this.text.release);
    setText(this.loading, this.text.loading);
    setText(this.pull, this.text.pull);
};

PullToRefresh.prototype.bind = function () {
    this.events = events(this.content, this);
    this.events.bind('mousedown', 'ontouchstart');
    this.events.bind('mousemove', 'ontouchmove');
    this.events.bind('touchstart');
    this.events.bind('touchmove');

    this.docEvents = events(document, this);
    this.docEvents.bind('mouseup', 'ontouchend');
    this.docEvents.bind('touchend');
};

PullToRefresh.prototype.unbind = function () {
    this.events.unbind();
    this.docEvents.unbind();
};

PullToRefresh.prototype.ontouchstart = function(e){
    this.complete();
    if (0 === this.el.scrollTop) {
        this.el.scrollTop += 1;
    }
};

PullToRefresh.prototype.ontouchmove = function(e){
    var top = this.el.scrollTop;
    var deg = 180 - (top < -this.height ? 180 : // degrees to move for the arrow (starts at 180° and decreases)
    (top < -this.arrowDelay ? Math.round(180 / (this.height - this.arrowDelay) * (-top - this.arrowDelay))
    : 0));
    if (this.isLoading) return true;
    var s = this.arrow.style;
    s.display = 'block';
    s.webkitTransform = s.MozTransform = s.msTransform = s.OTransform = 'rotate('+ deg + 'deg)';
    this.spinner.style.display = 'none';
    if (-top > this.height) { // release state
        this.release.style.opacity = 1;
        this.pull.style.opacity = 0;
        this.loading.style.opacity = 0;
        this.isActivated = true;
        this.emit('release', e, top, this.height);
    } else if (top > -this.height) { // pull state
        this.release.style.opacity = 0;
        this.pull.style.opacity = 1;
        this.loading.style.opacity = 0;
        this.isActivated = false;
        this.emit('pull', e);
    }
};

PullToRefresh.prototype.ontouchend = function(e){
    var top = this.el.scrollTop;
    if (this.isActivated) { // loading state
        this.isLoading = true;
        this.isActivated = false;
        this.release.style.opacity = 0;
        this.pull.style.opacity = 0;
        this.loading.style.opacity = 1;
        this.arrow.style.display = 'none';
        this.spinner.style.display = 'block';
        this.ptr.style.position = 'static';
        this.emit('loading', e);
    }
};

PullToRefresh.prototype.complete = function () {
    this.ptr.style.position = 'absolute';
    this.ptr.style.height = this.height;
    this.isLoading = false;
};

function setText (el, text) {
    el.innerHTML='';
    el.appendChild(document.createTextNode(text));
}