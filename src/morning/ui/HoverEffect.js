// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Touch / Desktop element hover handling.
 * Adds / Removes "hover" class to element on touch(start|end) / mouse(over|out) events.
 *
 */

goog.provide('morning.ui.HoverEffect');

goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('morning.mobile');
goog.require('morning.events');

/**
 * Touch / Desktop element hover handling
 *
 * @param {Element} element
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 * @deprecated
 */
morning.ui.HoverEffect = function(element)
{
    goog.base(this);

    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);

    /**
     * @private
     */
    this.element_ = element;

    if (morning.mobile.isTouchDevice())
    {
        morning.events.listenPointerEvent(this.handler_, element,
            goog.events.EventType.POINTERDOWN, this.handleTouchEvents_);


        morning.events.listenPointerEvent(this.handler_, element,
            goog.events.EventType.POINTERUP, this.handleTouchEvents_);
    }
    else
    {
        this.handler_.listen(element, [
            goog.events.EventType.MOUSEOVER,
            goog.events.EventType.MOUSEOUT
        ], this.handleMouseEvents_);

    }

};
goog.inherits(morning.ui.HoverEffect, goog.events.EventTarget);

/**
 * Creates hover effect for specified element
 *
 * @param {Element} el
 * @return {morning.ui.HoverEffect}
 */
morning.ui.HoverEffect.attach = function(el)
{
    return new morning.ui.HoverEffect(el);
};

/**
 * Disposes element
 */
morning.ui.HoverEffect.prototype.dispose = function()
{
    goog.dispose(this.handler_);
    this.handler_ = null;
    this.element_ = null;
};

/**
 * @return {Element}
 */
morning.ui.HoverEffect.prototype.getElement = function()
{
    return this.element_;
};

/**
 * Handles touch events
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.ui.HoverEffect.prototype.handleTouchEvents_ = function(e)
{
    this.setHover_(e.type == goog.events.EventType.POINTERDOWN ||
        e.type == goog.events.EventType.TOUCHSTART);
};

/**
 * Handles mouse events
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.ui.HoverEffect.prototype.handleMouseEvents_ = function(e)
{
    var currentTarget = /** @type {Node} */ (e.currentTarget);
    var relatedTarget = /** @type {Node} */ (e.relatedTarget);
    if (!e.relatedTarget || goog.dom.contains(currentTarget, relatedTarget))
    {
        return;
    }

    this.setHover_(e.type == 'mouseover');
};

/**
 * Sets hover state
 *
 * @param {boolean} isHover
 * @private
 */
morning.ui.HoverEffect.prototype.setHover_ = function(isHover)
{
    goog.dom.classlist.enable(this.element_, 'hover', isHover);
    if (isHover)
    {
        this.dispatchEvent(goog.ui.Component.EventType.HIGHLIGHT);
    }
    else
    {
        this.dispatchEvent(goog.ui.Component.EventType.UNHIGHLIGHT);
    }
};
