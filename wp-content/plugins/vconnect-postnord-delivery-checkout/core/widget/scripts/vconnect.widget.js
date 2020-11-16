; var vcAinoWidgetVersion = '2.9.5.0.0';
; /**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 * @private
 */
; (function ($, window, document, undefined) {
    window.inherits = function (childCtor, parentCtor) {
        /* @constructor */
        function tempCtor() { }
        tempCtor.prototype = parentCtor.prototype;
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        /* @override */
        childCtor.prototype.constructor = childCtor;
    }
    String.prototype.insertString = function (start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
})(jQuery, window, document);

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

; /**
 * @file jquery.translate.js
 * @brief jQuery plugin to translate text in the client side.
 * @author Manuel Fernandes
 * @site
 * @version 0.9
 * @license MIT license <http://www.opensource.org/licenses/MIT>
 *
 * translate.js is a jQuery plugin to translate text in the client side.
 *
 */

(function ($) {
    $.fn.translate = function (options) {

        var that = this; //a reference to ourselves

        var settings = {
            css: "trn",
            lang: "en"/*,
      t: {
        "translate": {
          pt: "tradução",
          br: "tradução"
        }
      }*/
        };
        settings = $.extend(settings, options || {});
        if (settings.css.lastIndexOf(".", 0) !== 0)   //doesn't start with '.'
            settings.css = "." + settings.css;

        var t = settings.t;

        //public methods
        this.lang = function (l) {
            if (l) {
                settings.lang = l;
                this.translate(settings);  //translate everything
            }

            return settings.lang;
        };


        this.get = function (index) {
            var res = index;

            try {
                res = t[index][settings.lang];
            }
            catch (err) {
                //not found, return index
                return index;
            }

            if (res)
                return res;
            else
                return index;
        };

        this.g = this.get;

        //main
        this.find(settings.css).each(function (i) {
            var $this = $(this);

            var trn_key = $this.attr("data-trn-key");
            if (!trn_key) {
                if ($this.is('input')) {
                    if($this.attr('type') == 'text'){
                        trn_key = $this.attr('placeholder');
                    }
                    else {
                        trn_key = $this.val();
                    }
                }
                else {
                    trn_key = $this.html();
                }

                $this.attr("data-trn-key", trn_key);   //store key for next time
            }

            if ($this.is('input')) {
                if ($this.attr('type') == 'text' && $this.attr('placeholder')) {
                    $this.attr('placeholder', that.get(trn_key));
                }
                else {
                    $this.val(that.get(trn_key));
                }
            }
            else {
                $this.html(that.get(trn_key));
            }
        });
        return this;
    };
})(jQuery);
; /**
 * @name MarkerWithLabel for V3
 * @version 1.1.10 [April 8, 2014]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3
 *  <code>google.maps.Marker</code> class.
 *  <p>
 *  MarkerWithLabel allows you to define markers with associated labels. As you would expect,
 *  if the marker is draggable, so too will be the label. In addition, a marker with a label
 *  responds to all mouse events in the same manner as a regular marker. It also fires mouse
 *  events and "property changed" events just as a regular marker would. Version 1.1 adds
 *  support for the raiseOnDrag feature introduced in API V3.3.
 *  <p>
 *  If you drag a marker by its label, you can cancel the drag and return the marker to its
 *  original position by pressing the <code>Esc</code> key. This doesn't work if you drag the marker
 *  itself because this feature is not (yet) supported in the <code>google.maps.Marker</code> class.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global document,google */


/**
 * This constructor creates a label and associates it with a marker.
 * It is for the private use of the MarkerWithLabel class.
 * @constructor
 * @param {Marker} marker The marker with which the label is to be associated.
 * @param {string} crossURL The URL of the cross image =.
 * @param {string} handCursor The URL of the hand cursor.
 * @private
 */
; (function ($, window, document, undefined) {
    window.InitializeMarkerWithLabel = function () {
        function MarkerLabel_(marker, crossURL, handCursorURL) {
            this.marker_ = marker;
            this.handCursorURL_ = marker.handCursorURL;

            this.labelDiv_ = document.createElement("div");
            this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

            // Get the DIV for the "X" to be displayed when the marker is raised.
            this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
        }

        if (typeof google !== "undefined") {
            inherits(MarkerLabel_, google.maps.OverlayView);
        }

        /**
         * Returns the DIV for the cross used when dragging a marker when the
         * raiseOnDrag parameter set to true. One cross is shared with all markers.
         * @param {string} crossURL The URL of the cross image =.
         * @private
         */
        MarkerLabel_.getSharedCross = function (crossURL) {
            var div;
            if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
                div = document.createElement("img");
                div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
                // Hopefully Google never changes the standard "X" attributes:
                div.style.marginLeft = "-8px";
                div.style.marginTop = "-9px";
                div.src = crossURL;
                MarkerLabel_.getSharedCross.crossDiv = div;
            }
            return MarkerLabel_.getSharedCross.crossDiv;
        };

        /**
         * Adds the DIV representing the label to the DOM. This method is called
         * automatically when the marker's <code>setMap</code> method is called.
         * @private
         */
        MarkerLabel_.prototype.onAdd = function () {
            var me = this;
            var cMouseIsDown = false;
            var cDraggingLabel = false;
            var cSavedZIndex;
            var cLatOffset, cLngOffset;
            var cIgnoreClick;
            var cRaiseEnabled;
            var cStartPosition;
            var cStartCenter;
            // Constants:
            var cRaiseOffset = 20;
            var cDraggingCursor = "url(" + this.handCursorURL_ + ")";

            // Stops all processing of an event.
            //
            var cAbortEvent = function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };

            var cStopBounce = function () {
                me.marker_.setAnimation(null);
            };

            this.getPanes().markerLayer.appendChild(this.labelDiv_);
            // One cross is shared with all markers, so only add it once:
            if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
                this.getPanes().markerLayer.appendChild(this.crossDiv_);
                MarkerLabel_.getSharedCross.processed = true;
            }

            this.listeners_ = [
                google.maps.event.addDomListener(this.labelDiv_, "mouseover", function (e) {
                    if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                        this.style.cursor = "pointer";
                        google.maps.event.trigger(me.marker_, "mouseover", e);
                    }
                }),
                google.maps.event.addDomListener(this.labelDiv_, "mouseout", function (e) {
                    if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
                        this.style.cursor = me.marker_.getCursor();
                        google.maps.event.trigger(me.marker_, "mouseout", e);
                    }
                }),
                google.maps.event.addDomListener(this.labelDiv_, "mousedown", function (e) {
                    cDraggingLabel = false;
                    if (me.marker_.getDraggable()) {
                        cMouseIsDown = true;
                        this.style.cursor = cDraggingCursor;
                    }
                    if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                        google.maps.event.trigger(me.marker_, "mousedown", e);
                        cAbortEvent(e); // Prevent map pan when starting a drag on a label
                    }
                }),
                google.maps.event.addDomListener(document, "mouseup", function (mEvent) {
                    var position;
                    if (cMouseIsDown) {
                        cMouseIsDown = false;
                        me.eventDiv_.style.cursor = "pointer";
                        google.maps.event.trigger(me.marker_, "mouseup", mEvent);
                    }
                    if (cDraggingLabel) {
                        if (cRaiseEnabled) { // Lower the marker & label
                            position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
                            position.y += cRaiseOffset;
                            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                            // This is not the same bouncing style as when the marker portion is dragged,
                            // but it will have to do:
                            try { // Will fail if running Google Maps API earlier than V3.3
                                me.marker_.setAnimation(google.maps.Animation.BOUNCE);
                                setTimeout(cStopBounce, 1406);
                            } catch (e) { }
                        }
                        me.crossDiv_.style.display = "none";
                        me.marker_.setZIndex(cSavedZIndex);
                        cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
                        cDraggingLabel = false;
                        mEvent.latLng = me.marker_.getPosition();
                        google.maps.event.trigger(me.marker_, "dragend", mEvent);
                    }
                }),
                google.maps.event.addListener(me.marker_.getMap(), "mousemove", function (mEvent) {
                    var position;
                    if (cMouseIsDown) {
                        if (cDraggingLabel) {
                            // Change the reported location from the mouse position to the marker position:
                            mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
                            position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
                            if (cRaiseEnabled) {
                                me.crossDiv_.style.left = position.x + "px";
                                me.crossDiv_.style.top = position.y + "px";
                                me.crossDiv_.style.display = "";
                                position.y -= cRaiseOffset;
                            }
                            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                            if (cRaiseEnabled) { // Don't raise the veil; this hack needed to make MSIE act properly
                                me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
                            }
                            google.maps.event.trigger(me.marker_, "drag", mEvent);
                        } else {
                            // Calculate offsets from the click point to the marker position:
                            cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
                            cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
                            cSavedZIndex = me.marker_.getZIndex();
                            cStartPosition = me.marker_.getPosition();
                            cStartCenter = me.marker_.getMap().getCenter();
                            cRaiseEnabled = me.marker_.get("raiseOnDrag");
                            cDraggingLabel = true;
                            me.marker_.setZIndex(1000000); // Moves the marker & label to the foreground during a drag
                            mEvent.latLng = me.marker_.getPosition();
                            google.maps.event.trigger(me.marker_, "dragstart", mEvent);
                        }
                    }
                }),
                google.maps.event.addDomListener(document, "keydown", function (e) {
                    if (cDraggingLabel) {
                        if (e.keyCode === 27) { // Esc key
                            cRaiseEnabled = false;
                            me.marker_.setPosition(cStartPosition);
                            me.marker_.getMap().setCenter(cStartCenter);
                            google.maps.event.trigger(document, "mouseup", e);
                        }
                    }
                }),
                google.maps.event.addDomListener(this.labelDiv_, "click", function (e) {
                    if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                        if (cIgnoreClick) { // Ignore the click reported when a label drag ends
                            cIgnoreClick = false;
                        } else {
                            google.maps.event.trigger(me.marker_, "click", e);
                            cAbortEvent(e); // Prevent click from being passed on to map
                        }
                    }
                }),
                google.maps.event.addDomListener(this.labelDiv_, "dblclick", function (e) {
                    if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                        google.maps.event.trigger(me.marker_, "dblclick", e);
                        cAbortEvent(e); // Prevent map zoom when double-clicking on a label
                    }
                }),
                google.maps.event.addListener(this.marker_, "dragstart", function (mEvent) {
                    if (!cDraggingLabel) {
                        cRaiseEnabled = this.get("raiseOnDrag");
                    }
                }),
                google.maps.event.addListener(this.marker_, "drag", function (mEvent) {
                    if (!cDraggingLabel) {
                        if (cRaiseEnabled) {
                            me.setPosition(cRaiseOffset);
                            // During a drag, the marker's z-index is temporarily set to 1000000 to
                            // ensure it appears above all other markers. Also set the label's z-index
                            // to 1000000 (plus or minus 1 depending on whether the label is supposed
                            // to be above or below the marker).
                            me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
                        }
                    }
                }),
                google.maps.event.addListener(this.marker_, "dragend", function (mEvent) {
                    if (!cDraggingLabel) {
                        if (cRaiseEnabled) {
                            me.setPosition(0); // Also restores z-index of label
                        }
                    }
                }),
                google.maps.event.addListener(this.marker_, "position_changed", function () {
                    me.setPosition();
                }),
                google.maps.event.addListener(this.marker_, "zindex_changed", function () {
                    me.setZIndex();
                }),
                google.maps.event.addListener(this.marker_, "visible_changed", function () {
                    me.setVisible();
                }),
                google.maps.event.addListener(this.marker_, "labelvisible_changed", function () {
                    me.setVisible();
                }),
                google.maps.event.addListener(this.marker_, "title_changed", function () {
                    me.setTitle();
                }),
                google.maps.event.addListener(this.marker_, "labelcontent_changed", function () {
                    me.setContent();
                }),
                google.maps.event.addListener(this.marker_, "labelanchor_changed", function () {
                    me.setAnchor();
                }),
                google.maps.event.addListener(this.marker_, "labelclass_changed", function () {
                    me.setStyles();
                }),
                google.maps.event.addListener(this.marker_, "labelstyle_changed", function () {
                    me.setStyles();
                })
            ];
        };

        /**
         * Removes the DIV for the label from the DOM. It also removes all event handlers.
         * This method is called automatically when the marker's <code>setMap(null)</code>
         * method is called.
         * @private
         */
        MarkerLabel_.prototype.onRemove = function () {
            var i;
            this.labelDiv_.parentNode.removeChild(this.labelDiv_);

            // Remove event listeners:
            for (i = 0; i < this.listeners_.length; i++) {
                google.maps.event.removeListener(this.listeners_[i]);
            }
        };

        /**
         * Draws the label on the map.
         * @private
         */
        MarkerLabel_.prototype.draw = function () {
            this.setContent();
            this.setTitle();
            this.setStyles();
        };

        /**
         * Sets the content of the label.
         * The content can be plain text or an HTML DOM node.
         * @private
         */
        MarkerLabel_.prototype.setContent = function () {
            var content = this.marker_.get("labelContent");
            if (typeof content.nodeType === "undefined") {
                this.labelDiv_.innerHTML = content;
            } else {
                this.labelDiv_.innerHTML = ""; // Remove current content
                this.labelDiv_.appendChild(content);
            }
        };

        /**
         * Sets the content of the tool tip for the label. It is
         * always set to be the same as for the marker itself.
         * @private
         */
        MarkerLabel_.prototype.setTitle = function () {
            this.labelDiv_.title = this.marker_.getTitle() || "";
        };

        /**
         * Sets the style of the label by setting the style sheet and applying
         * other specific styles requested.
         * @private
         */
        MarkerLabel_.prototype.setStyles = function () {
            var i, labelStyle;

            // Apply style values from the style sheet defined in the labelClass parameter:
            this.labelDiv_.className = this.marker_.get("labelClass");

            // Clear existing inline style values:
            this.labelDiv_.style.cssText = "";
            // Apply style values defined in the labelStyle parameter:
            labelStyle = this.marker_.get("labelStyle");
            for (i in labelStyle) {
                if (labelStyle.hasOwnProperty(i)) {
                    this.labelDiv_.style[i] = labelStyle[i];
                }
            }
            this.setMandatoryStyles();
        };

        /**
         * Sets the mandatory styles to the DIV representing the label as well as to the
         * associated event DIV. This includes setting the DIV position, z-index, and visibility.
         * @private
         */
        MarkerLabel_.prototype.setMandatoryStyles = function () {
            this.labelDiv_.style.position = "absolute";
            this.labelDiv_.style.overflow = "hidden";
            // Make sure the opacity setting causes the desired effect on MSIE:
            if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
                this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
                this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
            }

            this.setAnchor();
            this.setPosition(); // This also updates z-index, if necessary.
            this.setVisible();
        };

        /**
         * Sets the anchor point of the label.
         * @private
         */
        MarkerLabel_.prototype.setAnchor = function () {
            var anchor = this.marker_.get("labelAnchor");
            this.labelDiv_.style.marginLeft = -anchor.x + "px";
            this.labelDiv_.style.marginTop = -anchor.y + "px";
        };

        /**
         * Sets the position of the label. The z-index is also updated, if necessary.
         * @private
         */
        MarkerLabel_.prototype.setPosition = function (yOffset) {
            var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
            if (typeof yOffset === "undefined") {
                yOffset = 0;
            }
            this.labelDiv_.style.left = Math.round(position.x) + "px";
            this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";

            this.setZIndex();
        };

        /**
         * Sets the z-index of the label. If the marker's z-index property has not been defined, the z-index
         * of the label is set to the vertical coordinate of the label. This is in keeping with the default
         * stacking order for Google Maps: markers to the south are in front of markers to the north.
         * @private
         */
        MarkerLabel_.prototype.setZIndex = function () {
            var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
            if (typeof this.marker_.getZIndex() === "undefined") {
                this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
            } else {
                this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
            }
        };

        /**
         * Sets the visibility of the label. The label is visible only if the marker itself is
         * visible (i.e., its visible property is true) and the labelVisible property is true.
         * @private
         */
        MarkerLabel_.prototype.setVisible = function () {
            if (this.marker_.get("labelVisible")) {
                this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
            } else {
                this.labelDiv_.style.display = "none";
            }
        };

        /**
         * @name MarkerWithLabelOptions
         * @class This class represents the optional parameter passed to the {@link MarkerWithLabel} constructor.
         *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
         *  of the properties listed below. To change any of these additional properties after the labeled
         *  marker has been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
         *  <p>
         *  When any of these properties changes, a property changed event is fired. The names of these
         *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
         *  For example, if the content of the label changes, a <code>labelcontent_changed</code> event
         *  is fired.
         *  <p>
         * @property {string|Node} [labelContent] The content of the label (plain text or an HTML DOM node).
         * @property {Point} [labelAnchor] By default, a label is drawn with its anchor point at (0,0) so
         *  that its top left corner is positioned at the anchor point of the associated marker. Use this
         *  property to change the anchor point of the label. For example, to center a 50px-wide label
         *  beneath a marker, specify a <code>labelAnchor</code> of <code>google.maps.Point(25, 0)</code>.
         *  (Note: x-values increase to the right and y-values increase to the top.)
         * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
         *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
         *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
         *  <code>marginTop</code> are ignored; these styles are for internal use only.
         * @property {Object} [labelStyle] An object literal whose properties define specific CSS
         *  style values to be applied to the label. Style values defined here override those that may
         *  be defined in the <code>labelClass</code> style sheet. If this property is changed after the
         *  label has been created, all previously set styles (except those defined in the style sheet)
         *  are removed from the label before the new style values are applied.
         *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
         *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
         *  <code>marginTop</code> are ignored; these styles are for internal use only.
         * @property {boolean} [labelInBackground] A flag indicating whether a label that overlaps its
         *  associated marker should appear in the background (i.e., in a plane below the marker).
         *  The default is <code>false</code>, which causes the label to appear in the foreground.
         * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
         *  The default is <code>true</code>. Note that even if <code>labelVisible</code> is
         *  <code>true</code>, the label will <i>not</i> be visible unless the associated marker is also
         *  visible (i.e., unless the marker's <code>visible</code> property is <code>true</code>).
         * @property {boolean} [raiseOnDrag] A flag indicating whether the label and marker are to be
         *  raised when the marker is dragged. The default is <code>true</code>. If a draggable marker is
         *  being created and a version of Google Maps API earlier than V3.3 is being used, this property
         *  must be set to <code>false</code>.
         * @property {boolean} [optimized] A flag indicating whether rendering is to be optimized for the
         *  marker. <b>Important: The optimized rendering technique is not supported by MarkerWithLabel,
         *  so the value of this parameter is always forced to <code>false</code>.
         * @property {string} [crossImage="http://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"]
         *  The URL of the cross image to be displayed while dragging a marker.
         * @property {string} [handCursor="http://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"]
         *  The URL of the cursor to be displayed while dragging a marker.
         */
        /**
         * Creates a MarkerWithLabel with the options specified in {@link MarkerWithLabelOptions}.
         * @constructor
         * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
         */
        window.MarkerWithLabel = function (opt_options) {
            opt_options = opt_options || {};
            opt_options.labelContent = opt_options.labelContent || "";
            opt_options.labelAnchor = opt_options.labelAnchor || new google.maps.Point(0, 0);
            opt_options.labelClass = opt_options.labelClass || "markerLabels";
            opt_options.labelStyle = opt_options.labelStyle || {};
            opt_options.labelInBackground = opt_options.labelInBackground || false;
            if (typeof opt_options.labelVisible === "undefined") {
                opt_options.labelVisible = true;
            }
            if (typeof opt_options.raiseOnDrag === "undefined") {
                opt_options.raiseOnDrag = true;
            }
            if (typeof opt_options.clickable === "undefined") {
                opt_options.clickable = true;
            }
            if (typeof opt_options.draggable === "undefined") {
                opt_options.draggable = false;
            }
            if (typeof opt_options.optimized === "undefined") {
                opt_options.optimized = false;
            }
            opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
            opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
            opt_options.optimized = false; // Optimized rendering is not supported

            this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor); // Bind the label to the marker

            // Call the parent constructor. It calls Marker.setValues to initialize, so all
            // the new parameters are conveniently saved and can be accessed with get/set.
            // Marker.set triggers a property changed event (called "propertyname_changed")
            // that the marker label listens for in order to react to state changes.
            google.maps.Marker.apply(this, arguments);
        }

        inherits(MarkerWithLabel, google.maps.Marker);

        /**
         * Overrides the standard Marker setMap function.
         * @param {Map} theMap The map to which the marker is to be added.
         * @private
         */
        MarkerWithLabel.prototype.setMap = function (theMap) {

            // Call the inherited function...
            google.maps.Marker.prototype.setMap.apply(this, arguments);

            // ... then deal with the label:
            this.label.setMap(theMap);
        };
    }
})(jQuery, window, document);
; (function defineMustache(global, factory) { if (typeof exports === "object" && exports && typeof exports.nodeName !== "string") { factory(exports) } else if (typeof define === "function" && define.amd) { define(["exports"], factory) } else { global.Mustache = {}; factory(global.Mustache) } })(this, function mustacheFactory(mustache) { var objectToString = Object.prototype.toString; var isArray = Array.isArray || function isArrayPolyfill(object) { return objectToString.call(object) === "[object Array]" }; function isFunction(object) { return typeof object === "function" } function typeStr(obj) { return isArray(obj) ? "array" : typeof obj } function escapeRegExp(string) { return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") } function hasProperty(obj, propName) { return obj != null && typeof obj === "object" && propName in obj } var regExpTest = RegExp.prototype.test; function testRegExp(re, string) { return regExpTest.call(re, string) } var nonSpaceRe = /\S/; function isWhitespace(string) { return !testRegExp(nonSpaceRe, string) } var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "`": "&#x60;", "=": "&#x3D;" }; function escapeHtml(string) { return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) { return entityMap[s] }) } var whiteRe = /\s*/; var spaceRe = /\s+/; var equalsRe = /\s*=/; var curlyRe = /\s*\}/; var tagRe = /#|\^|\/|>|\{|&|=|!/; function parseTemplate(template, tags) { if (!template) return []; var sections = []; var tokens = []; var spaces = []; var hasTag = false; var nonSpace = false; function stripSpace() { if (hasTag && !nonSpace) { while (spaces.length) delete tokens[spaces.pop()] } else { spaces = [] } hasTag = false; nonSpace = false } var openingTagRe, closingTagRe, closingCurlyRe; function compileTags(tagsToCompile) { if (typeof tagsToCompile === "string") tagsToCompile = tagsToCompile.split(spaceRe, 2); if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error("Invalid tags: " + tagsToCompile); openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*"); closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1])); closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1])) } compileTags(tags || mustache.tags); var scanner = new Scanner(template); var start, type, value, chr, token, openSection; while (!scanner.eos()) { start = scanner.pos; value = scanner.scanUntil(openingTagRe); if (value) { for (var i = 0, valueLength = value.length; i < valueLength; ++i) { chr = value.charAt(i); if (isWhitespace(chr)) { spaces.push(tokens.length) } else { nonSpace = true } tokens.push(["text", chr, start, start + 1]); start += 1; if (chr === "\n") stripSpace() } } if (!scanner.scan(openingTagRe)) break; hasTag = true; type = scanner.scan(tagRe) || "name"; scanner.scan(whiteRe); if (type === "=") { value = scanner.scanUntil(equalsRe); scanner.scan(equalsRe); scanner.scanUntil(closingTagRe) } else if (type === "{") { value = scanner.scanUntil(closingCurlyRe); scanner.scan(curlyRe); scanner.scanUntil(closingTagRe); type = "&" } else { value = scanner.scanUntil(closingTagRe) } if (!scanner.scan(closingTagRe)) throw new Error("Unclosed tag at " + scanner.pos); token = [type, value, start, scanner.pos]; tokens.push(token); if (type === "#" || type === "^") { sections.push(token) } else if (type === "/") { openSection = sections.pop(); if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start); if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start) } else if (type === "name" || type === "{" || type === "&") { nonSpace = true } else if (type === "=") { compileTags(value) } } openSection = sections.pop(); if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos); return nestTokens(squashTokens(tokens)) } function squashTokens(tokens) { var squashedTokens = []; var token, lastToken; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; if (token) { if (token[0] === "text" && lastToken && lastToken[0] === "text") { lastToken[1] += token[1]; lastToken[3] = token[3] } else { squashedTokens.push(token); lastToken = token } } } return squashedTokens } function nestTokens(tokens) { var nestedTokens = []; var collector = nestedTokens; var sections = []; var token, section; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { token = tokens[i]; switch (token[0]) { case "#": case "^": collector.push(token); sections.push(token); collector = token[4] = []; break; case "/": section = sections.pop(); section[5] = token[2]; collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens; break; default: collector.push(token) } } return nestedTokens } function Scanner(string) { this.string = string; this.tail = string; this.pos = 0 } Scanner.prototype.eos = function eos() { return this.tail === "" }; Scanner.prototype.scan = function scan(re) { var match = this.tail.match(re); if (!match || match.index !== 0) return ""; var string = match[0]; this.tail = this.tail.substring(string.length); this.pos += string.length; return string }; Scanner.prototype.scanUntil = function scanUntil(re) { var index = this.tail.search(re), match; switch (index) { case -1: match = this.tail; this.tail = ""; break; case 0: match = ""; break; default: match = this.tail.substring(0, index); this.tail = this.tail.substring(index) } this.pos += match.length; return match }; function Context(view, parentContext) { this.view = view; this.cache = { ".": this.view }; this.parent = parentContext } Context.prototype.push = function push(view) { return new Context(view, this) }; Context.prototype.lookup = function lookup(name) { var cache = this.cache; var value; if (cache.hasOwnProperty(name)) { value = cache[name] } else { var context = this, names, index, lookupHit = false; while (context) { if (name.indexOf(".") > 0) { value = context.view; names = name.split("."); index = 0; while (value != null && index < names.length) { if (index === names.length - 1) lookupHit = hasProperty(value, names[index]); value = value[names[index++]] } } else { value = context.view[name]; lookupHit = hasProperty(context.view, name) } if (lookupHit) break; context = context.parent } cache[name] = value } if (isFunction(value)) value = value.call(this.view); return value }; function Writer() { this.cache = {} } Writer.prototype.clearCache = function clearCache() { this.cache = {} }; Writer.prototype.parse = function parse(template, tags) { var cache = this.cache; var tokens = cache[template]; if (tokens == null) tokens = cache[template] = parseTemplate(template, tags); return tokens }; Writer.prototype.render = function render(template, view, partials) { var tokens = this.parse(template); var context = view instanceof Context ? view : new Context(view); return this.renderTokens(tokens, context, partials, template) }; Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate) { var buffer = ""; var token, symbol, value; for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) { value = undefined; token = tokens[i]; symbol = token[0]; if (symbol === "#") value = this.renderSection(token, context, partials, originalTemplate); else if (symbol === "^") value = this.renderInverted(token, context, partials, originalTemplate); else if (symbol === ">") value = this.renderPartial(token, context, partials, originalTemplate); else if (symbol === "&") value = this.unescapedValue(token, context); else if (symbol === "name") value = this.escapedValue(token, context); else if (symbol === "text") value = this.rawValue(token); if (value !== undefined) buffer += value } return buffer }; Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate) { var self = this; var buffer = ""; var value = context.lookup(token[1]); function subRender(template) { return self.render(template, context, partials) } if (!value) return; if (isArray(value)) { for (var j = 0, valueLength = value.length; j < valueLength; ++j) { buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate) } } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") { buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate) } else if (isFunction(value)) { if (typeof originalTemplate !== "string") throw new Error("Cannot use higher-order sections without the original template"); value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender); if (value != null) buffer += value } else { buffer += this.renderTokens(token[4], context, partials, originalTemplate) } return buffer }; Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate) { var value = context.lookup(token[1]); if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate) }; Writer.prototype.renderPartial = function renderPartial(token, context, partials) { if (!partials) return; var value = isFunction(partials) ? partials(token[1]) : partials[token[1]]; if (value != null) return this.renderTokens(this.parse(value), context, partials, value) }; Writer.prototype.unescapedValue = function unescapedValue(token, context) { var value = context.lookup(token[1]); if (value != null) return value }; Writer.prototype.escapedValue = function escapedValue(token, context) { var value = context.lookup(token[1]); if (value != null) return mustache.escape(value) }; Writer.prototype.rawValue = function rawValue(token) { return token[1] }; mustache.name = "mustache.js"; mustache.version = "2.2.1"; mustache.tags = ["{{", "}}"]; var defaultWriter = new Writer; mustache.clearCache = function clearCache() { return defaultWriter.clearCache() }; mustache.parse = function parse(template, tags) { return defaultWriter.parse(template, tags) }; mustache.render = function render(template, view, partials) { if (typeof template !== "string") { throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + "argument for mustache#render(template, view, partials)") } return defaultWriter.render(template, view, partials) }; mustache.to_html = function to_html(template, view, partials, send) { var result = mustache.render(template, view, partials); if (isFunction(send)) { send(result) } else { return result } }; mustache.escape = escapeHtml; mustache.Scanner = Scanner; mustache.Context = Context; mustache.Writer = Writer });

; (function () {

    function PopupDialog(className, parentElement, bodyHtml, okButtonText, cancelButtonText, params) {
        this.className = className;
        this.isVisible = false;
        this.container = parentElement;
        this.bodyHtml = bodyHtml;
        this.okButtonText = okButtonText;
        this.cancelButtonText = cancelButtonText;
        this.params = params || {};
        this.params.ok = params.ok || function () { };
        this.params.cancel = params.cancel || function () { };

        this.init();
        this.show(this.instance);
    }

    PopupDialog.prototype = {
        init: function () {
            this.instance = null;
            this.create();
            this.layout();
            this.actions();
        },
        create: function () {
            var wrapper = this.container.querySelector("." + this.className);
            if (wrapper === null) {
                var wrapper = document.createElement("div");
                //wrapper.id = "popup-wrapper";
                wrapper.className = this.className;
                var html = "<div class='popup-box'>";
                html += this.bodyHtml;
                html += "<div class='popup-buttons'>";
                html += "<label class='okbutton aino-collapse-trigger aino-input aino-button'><span class='trn'>" + this.okButtonText + "</span></label>";
                html += (this.cancelButtonText) ? ("<label class='cancelbutton aino-collapse-trigger aino-input aino-button'><span class='trn'>" + this.cancelButtonText + "</span></label >") : "";
                html += "</div ></div>";

                wrapper.innerHTML = html;
                this.container.appendChild(wrapper);
            }

            this.instance = wrapper;
        },
        layout: function () {
            var wrapper = this.instance;
            var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            wrapper.style.height = winHeight + "px";
        },
        show: function (element) {
            element.style.display = "block";
            element.style.opacity = 1;
            this.isVisible = true;
        },
        hide: function (element) {
            element.style.opacity = 0;
            element.style.display = "none";
            this.isVisible = false;
        },
        actions: function () {
            var self = this;
            self.instance.querySelector(".okbutton").
                addEventListener("click", function () {
                    self.hide(self.instance);
                    self.params.ok(self.instance);

                }, false);

            self.instance.querySelector("." + this.className + " input[type=text]").
                addEventListener("keydown", function (e) {
                    if (e.keyCode == 13) {
                        self.hide(self.instance);
                        self.params.ok(self.instance);
                    }
                    else if (e.keyCode == 27) {
                        self.hide(self.instance);
                        self.params.cancel(self.instance);
                    }

                }, false);
            if (this.cancelButtonText) {
                self.instance.querySelector(".cancelbutton").
                    addEventListener("click", function () {
                        self.hide(self.instance);
                        self.params.cancel(self.instance);

                    }, false);
            }
        }
    };

    window.PopupDialog = PopupDialog;
})();
; (function ($, window, document, undefined) {
    window.AinoPickupModule = function (countryId, street, postcode, themePath, shippingContainer, pickupFilter, changeCallback, selectedPickupId, mapTemplate, useInternalSorting, initCallback) {
        var _mapTemplate = mapTemplate;
        var _countryId = countryId;
        var _street = street;
        var _postcode = postcode;
        var _themePath = themePath.toLowerCase();
        var _pickupFilter = pickupFilter;
        var _isUpdating = false;
        var _triggerChangeCallback = false;
        var _functionQueue = [];
        var _shippingContainer = shippingContainer;
        var _changeCallback = changeCallback;
        var _useInternalSorting = useInternalSorting;
        var _homeMarker;

        var parent = $(_shippingContainer).closest('.aino-deliver-to');
        var _mapContainer = $(_mapTemplate);
        $(parent).prepend(_mapContainer);
        ainoLangSvc.Translate(_mapContainer);
        _placeholderToSearchField();

        String.prototype.insertString = function (start, delCount, newSubStr) {
            return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
        };

        var markers = [], userChoice = {}, data = {}, sortedData = [], allData = [], carriers = [], limit,
            myLatLng, map, infowindow, miniMap, miniMapMarkers = [],
        bounds = new google.maps.LatLngBounds(),
        miniBounds = new google.maps.LatLngBounds(),
        directionsService = new google.maps.DirectionsService;

        function _init(callback) {
            // initial
            _isUpdating = true;
            if (!selectedPickupId) {
                _setLocationLimit(3);
            }

            if (_countryId && _postcode && _postcode != "") {
                ainoGeocodeSvc.GetLocation(_street, _postcode, _countryId, function (results) {
                    if (results.length > 0) {
                        myLatLng = new google.maps.LatLng({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        });

                        _createBigMap();
                        _createMiniMap();
                        _setHandlers();
                        _updatePickupPoints(function () {
                            var foundSelected = false;
                            if (sortedData.length == 0) {
                                var card = _shippingContainer.find('.aino-card');
                                card.hide();
                                var message = ainoLangSvc.TranslateKey("postOfficeMap.searchError");
                                card.parent().append("<span class='no-points-message'>" + message + "</span>");
                            }
                            if (selectedPickupId) {
                                for (var i = 0; i < sortedData.length; i++) {
                                    if (sortedData[i].servicePointId == selectedPickupId) {
                                        var listItems = $(_mapContainer).find('.aino-location-list').find('.aino-location-container');
                                        $(listItems[i]).trigger('click');
                                        $(_mapContainer).find('.load-more-locations').addClass('aino-disable');
                                        foundSelected = true;
                                        break;
                                    }
                                }
                            }

                            if (!foundSelected) {
                                _triggerLocationSelection();
                            }


                            if (callback) {
                                callback();
                            }

                            _triggerChangeCallback = true;
                        });
                    }
                    else {
                        myLatLng = new google.maps.LatLng();
                        _createBigMap();
                        _createMiniMap();
                    }
                });
            }
        }

        function _updatePickupPoints(callback, postCode) {
            _isUpdating = true;
            var searchPostCode = postCode ? postCode : _postcode;
            ainoPostSvc.GetPointsAsync(searchPostCode, _countryId, myLatLng.lat(), myLatLng.lng(), function (callbackData) {
                var items = [];
                if (typeof callbackData.items !== "undefined") {
                    items = callbackData.items
                }

                if (_pickupFilter) {
                    items = items.filter(function (val) { return val.forwarderName == _pickupFilter; });
                }

                if (items.length == 0) {
                    if (typeof (callback) !== 'undefined') {
                        callback(items);
                    }

                    _isUpdating = false;
                    return;
                }

                if (_useInternalSorting) {
                    items.sort(function (a, b) {
                        var aNum = parseFloat(a.distanceRaw);
                        var bNum = parseFloat(b.distanceRaw);

                        return (aNum > bNum) ? 1 : ((bNum > aNum) ? -1 : 0);
                    });
                }

                _updateLocations(items);
                if (typeof (callback) !== 'undefined') {
                    callback(items);
                }

                _isUpdating = false;
                while (_functionQueue.length > 0) {
                    (_functionQueue.shift())();
                }
            }, _useInternalSorting);
        }

        function _wrapFunction(fn, context, params) {
            return function () {
                fn.apply(context, params);
            }
        }

        function _updateLocations(items) {
            $('.aino-failed').hide();
            _clearListLocations();
            //get and sort data
            data = items;
            sortedData = items;
            //_sortArrayData();

            //set up the list of locations so the map can get the dynamic height from it
            _setListLocations();
            if (sortedData.length > 0) {
                _mapHeight();
            }

            //set markers to the map
            if (sortedData.length > 0) {
                _setMapContent();
            }
            else {
                var pointsLatLng = new google.maps.LatLng(myLatLng.lat(), myLatLng.lng());
                bounds.extend(pointsLatLng);
            }

            map.fitBounds(bounds);
        }

        function _createBigMap() {
            map = new google.maps.Map($(_mapContainer).find('.aino-map-container')[0], {
                center: myLatLng,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            _homeMarker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: {
                    url: _themePath + '/images/' + 'home-marker.png',
                    scaledSize: new google.maps.Size(40, 40)
                }
            });

            infowindow = new google.maps.InfoWindow();
        }

        function _createMiniMap() {
            miniMap = new google.maps.Map($(_shippingContainer).find('.aino-mini-map')[0], {
                center: myLatLng,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            _updateMiniMapMarkers();
        }

        function _setHandlers() {
            // load more location
            $(_mapContainer).find('.load-more-locations').click(function (event) {
                event.preventDefault();
                $(this).addClass('aino-disable');
                _setLocationLimit(null);
                _updatePickupPoints(function () {
                    google.maps.event.trigger(map, 'resize');
                    _triggerLocationSelection();
                });
            })

            // big map search
            $('.aino-search-point').find('input').keydown(function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    var parent = $(this).parents('.aino-search-point');
                    _searchMap(parent);
                }
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            $(_mapContainer).find('button.aino-map-search').click(function (event) {
                event.preventDefault();
                var parent = $(this).parent('.aino-search-point');
                _searchMap(parent);
            });

            // back button
            $(_mapContainer).find('.aino-backto-shipping').on('click', function (event) {
                event.preventDefault();
                $(_mapContainer).removeClass('aino-active');
                _showPreview();
            });
        }

        function _searchMap(searchInputParent) {
            $(_mapContainer).find('.postcode-error').hide();
            var searchedPostcode = $(searchInputParent).find('input').val();
            if (searchedPostcode) {
                ainoGeocodeSvc.GetLocation("", searchedPostcode, _countryId, function (results) {
                    if (results.length > 0) {
                        myLatLng = new google.maps.LatLng({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        });

                        _setLocationLimit(3);

                        _homeMarker.setMap(null);

                        _updatePickupPoints(function (dataItems) {
                            if (dataItems && dataItems.length > 0) {
                                _street = "";
                                _postcode = searchedPostcode;
                                var centerLatLng = map.center;
                                google.maps.event.trigger(map, 'resize');
                                map.panTo(centerLatLng);
                                _triggerLocationSelection();
                            }
                            else {
                                $(_mapContainer).find('.postcode-error').show();
                            }
                        }, searchedPostcode);
                        $(_mapContainer).find('.load-more-locations').removeClass('aino-disable');
                    }
                });
            }
        }

        function _updateMiniMapMarkers(choiseItem) {
            for (i = 0; i < miniMapMarkers.length; i++) {
                miniMapMarkers[i].setMap(null);
            }

            miniMapMarkers = [];

            miniBounds = new google.maps.LatLngBounds();
            miniBounds.extend(myLatLng);

            var HomeMarker = new google.maps.Marker({
                position: myLatLng,
                map: miniMap,
                icon: {
                    url: _themePath + '/images/' + 'home-marker.png',
                    scaledSize: new google.maps.Size(40, 40)
                }
            });
            miniMapMarkers.push(HomeMarker);
            if (choiseItem) {
                var choiceLatLng = new google.maps.LatLng({
                    lat: choiseItem.lat,
                    lng: choiseItem.lng
                });

                var choiceDestinationMarker = new google.maps.Marker({
                    position: choiceLatLng,
                    map: miniMap,
                    icon: {
                        url: _themePath + '/images/' + 'marker-carrier.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });
                miniMapMarkers.push(choiceDestinationMarker);

                miniBounds.extend(choiceLatLng);
                miniMap.setCenter(choiceLatLng);
                //infowindow.open(miniMap, choiceDestinationMarker)
            }
        }

        function _sortArrayData() {
            var dist;
            allData = data;
            for (var x = 0; x < data.length; x++) {
                dist = _calcDistance({ lat: data[x].coordinate.northing, lng: data[x].coordinate.easting });
                allData[x].destination = dist;
            }

            allData = allData.sort(function (a, b) {
                return a.destination - b.destination;
            });

            sortedData = allData;
        }

        function _calcDistance(targetPosition) {
            if (typeof (Number.prototype.toRadians) === "undefined") {
                Number.prototype.toRadians = function () {
                    return this * (Math.PI / 180);
                }
            }

            var R = 6371; // metres
            var f1 = myLatLng.lat().toRadians();
            var f2 = targetPosition.lat.toRadians();
            var df = (targetPosition.lat - myLatLng.lat()).toRadians();
            var dg = (targetPosition.lng - myLatLng.lng()).toRadians();

            var a = Math.sin(df / 2) * Math.sin(df / 2) +
                Math.cos(f1) * Math.cos(f2) *
                Math.sin(dg / 2) * Math.sin(dg / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            return d.toFixed(10);
        }

        function _setMapContent() {
            var image = {
                url: _themePath + '/images/' + 'marker-carrier.png',
                scaledSize: new google.maps.Size(40, 40)
            };

            var len = (limit > 0 && limit < sortedData.length) ? limit : sortedData.length;

            for (var i = 0; i < len; i++) {

                var pointsLatLng = new google.maps.LatLng(sortedData[i].lat, sortedData[i].lng);
                bounds.extend(pointsLatLng);

                var marker = new google.maps.Marker({
                    position: pointsLatLng,
                    map: map,
                    icon: image
                });

                markers.push(marker);

                marker.addListener('click', function () {
                    _showDuration(this);
                    _setActiveListItemFromMarker(this);
                });
            }
        }

        function _setListLocations() {
            var container = $(_mapContainer).find('.aino-location-list > ul');
            if (sortedData.length == 0) {
                container.find('li').remove();
                return;
            }

            var full = container.find('li').length > 0;
            var len = (limit > 0 && limit < sortedData.length) ? limit : sortedData.length;
            if (full) {
                container.find('li').remove();
            }

            for (var x = 0; x < len; x++) {
                var item = sortedData[x];
                //var monFriOpen = (typeof item.opening !== 'undefined')
                //    ? item.opening[0].from1.insertString(2, 0, ":") : '';
                //var monFriClose = (typeof item.opening !== 'undefined')
                //    ? item.opening[0].to1.insertString(2, 0, ":") : '';
                //var satOpen = (typeof item.opening !== 'undefined')
                //    ? item.opening[item.opening.length - 1].from1.insertString(2, 0, ":") : '';
                //var satClose = (typeof item.opening !== 'undefined')
                //    ? item.opening[item.opening.length - 1].to1.insertString(2, 0, ":") : '';

                //var monFriOpen = item.opening;
                //var monFriClose = item.close;
                //var satOpen = item.opening_sat;
                //var satClose = item.close_sat;

                var openingHours = "";
                for (var h = 0; h < item.openingHours.length; h++) {
                    openingHours += item.openingHours[h] + "<br />";
                }

                var logoHtml = '<span class="aino-postnord-logo"></span>';
                if (item.logotypeUrl) {
                    logoHtml = '<img class="aino-logo-img" src="' + item.logotypeUrl + '" />';
                }

                var listItem = $('<li></li>');
                var shell = $('<label class="aino-location-container aino-input aino-checkbox"></label>')
                    .append($('<input type="radio" name="aino-location-' + _pickupFilter + '" value="">'))
                    .append($('<span class="aino-indicator"></span>'))
                    .append($('<b class="aino-location-title">' + item.name + '</b>'))
                    .append($('<span class="aino-destination-info aino-text-light"> '
                        + item.address + ' <br> ' + openingHours + '</span>'))
                    .append($('<span class="carrier-logo">' + logoHtml + '</span>'))
                    .append($('<hr>'));

                shell.appendTo(listItem.appendTo(container));
            }

            ainoLangSvc.Translate(container);

            _setActiveMarkerFromListItem();
        }

        function _triggerLocationSelection(locationId) {

            var selectedInput = $(_mapContainer).find('.aino-location-list .aino-location-container').find('input:checked');
            var listItems = $(_mapContainer).find('.aino-location-list').find('.aino-location-container');
            if (sortedData.length > 0) {
                if ($(selectedInput).length == 0) {
                    $(listItems[0]).trigger('click');
                }
                else {
                    $(selectedInput).trigger('change');
                }
            }
        }

        function _setActiveMarkerFromListItem() {
            var listItems = $(_mapContainer).find('.aino-location-container').find('input');

            listItems.each(function (index) {
                $(this).unbind('change').on('change', function (e) {
                    e.preventDefault();
                    $(listItems).closest('.aino-location-container').removeClass('aino-active');
                    $(this).closest('.aino-location-container').addClass('aino-active');

                    _showDuration(markers[index]);
                    var nameFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-name');
                    var infoFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-info');

                    _updateInfoElements(index, nameFieldElement, infoFieldElement);
                    userChoice = _getOutputData(index);
                    _updateMiniMapMarkers(userChoice);

                    if (_changeCallback && _triggerChangeCallback) {
                        _changeCallback();
                    }
                });
            });
        }

        function _setActiveListItemFromMarker(self) {
            var index = 0;
            var x = 0;
            var locationList = $(_mapContainer).find('.aino-location-list');
            var listItem = $(locationList).find('li');

            for (var i = 0; i < markers.length; i++) {
                if (markers[i] === self) {
                    index = $(listItem).index($(listItem[i]));
                    userChoice = _getOutputData(i);
                }

                x++;
            }

            $(listItem[index]).find('input').prop('checked', true);
            $(listItem).find('.aino-location-container').removeClass('aino-active');
            $(listItem[index]).find('.aino-location-container').addClass('aino-active');

            locationList.animate({
                scrollTop: 0
            }, 0);
            locationList.animate({
                scrollTop: $($(listItem[index])).position().top - locationList.position().top + locationList.scrollTop()
            }, 0);

            var nameFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-name');
            var infoFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-info');
            _updateInfoElements(index, nameFieldElement, infoFieldElement);
            if (_changeCallback && _triggerChangeCallback) {
                _changeCallback();
            }
        }

        function _showDuration(marker) {
            var request = {
                destination: { lat: marker.position.lat(), lng: marker.position.lng() },
                origin: myLatLng,
                travelMode: google.maps.TravelMode['WALKING']
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    // Display the route on the map.

                    var duration = response.routes[0].legs[0].duration.text;

                    infowindow.close();

                    infowindow.setContent('<img class="aino-travel-mode"/>' + duration + ' bort');

                    infowindow.open(map, marker);

                    _panToMarker(marker);
                }

                google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
                    var oldZoom = map.getZoom();

                    if (oldZoom > 15) {
                        map.setZoom(oldZoom - 1);
                    }
                    else {
                        map.setZoom(oldZoom);
                    }
                });
            });
        }

        function _panToMarker(marker) {
            map.setZoom(16);
            map.panTo(marker.getPosition());
        }

        function _getOutputData(index) {
            var item = sortedData[index];
            if (!item) {
                return {};
            }

            return {
                'name': item.name,
                'address': item.address,
                'city': item.city,
                'postcode': item.post_code,
                'servicePointId': item.servicePointId,
                'lat': item.lat,
                'lng': item.lng,
                'userPostcode': _postcode,
                'userAddress': _street
            }
        }

        function _mapHeight() {
            var h = 0;
            var listItems = $(_mapContainer).find('.aino-location-list').find('li');

            for (var x = 0; x < 3; x++) {
                h += $(listItems).height();
            }

            $(_mapContainer).find('.aino-map-container').height(h);
            $(_mapContainer).find('.aino-location-list').height(h);

        }

        function _clearListLocations() {
            var container = $(_mapContainer).find('.vcsa-location-list > ul');
            $(container).find('li').remove();

            for (var key in markers) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
            }

            sortedData = [];
            markers = [];
        }

        function _updateInfoElements(index, nameFieldElement, infoFieldElement) {
            if (sortedData.length == 0 || index >= sortedData.length) {
                $(nameFieldElement).html('');
                $(infoFieldElement).html('');
                return;
            }

            var item = sortedData[index];
            var monFriOpen = item.opening;
            var monFriClose = item.close;
            var satOpen = item.opening_sat;
            var satClose = item.close_sat;

            var name = sortedData[index].name;
            var hours = sortedData[index].openingHours;
            var info = sortedData[index].address + ' <br> ';
            if (hours.length > 0) {
                info += hours[0];
            }

            if (hours.length > 1) {
                info += '<br />' + hours[1];
            }

            $(nameFieldElement).html(name);
            $(infoFieldElement).html(info);

        }

        function _getFirstPickupPoint() {
            if (sortedData.length > 0) {
                return sortedData[0];
            }

            return {};
        }

        function _showDetails() {
            var showFunc = function () {
                $(_mapContainer).addClass('aino-active');
                $(_mapContainer).siblings('li').removeClass('aino-active');
                $(_mapContainer).find('.postcode-error').hide();
                $(_mapContainer).find('.aino-search-point').find('input').val('').trigger('keyup');

                _mapHeight();
                google.maps.event.trigger(map, 'resize')
                _triggerLocationSelection();
            }

            if (_isUpdating) {
                _functionQueue.push(_wrapFunction(showFunc, this));
            }
            else {
                showFunc();
            }
        }

        function _showPreview(callback) {
            var showFunc = function () {
                var centerLatLng = miniMap.center;

                google.maps.event.trigger(miniMap, 'resize');
                setTimeout(function () {
                    miniMap.setZoom(17);
                    miniMap.panTo(centerLatLng);
                    if (miniMapMarkers.length > 1) {
                        infowindow.open(miniMap, miniMapMarkers[1]);
                    }
                }, 100);

                if (callback) {
                    callback();
                }
            }
            if (_isUpdating) {
                _functionQueue.push(_wrapFunction(showFunc, this));

            }
            else {
                showFunc();
            }
        }

        function _setLocationLimit(value) {
            limit = value;
        }

        function _placeholderToSearchField() {
            var input = $(_mapContainer).find('.aino-search-point').find('input');

            input.on('keyup', function () {

                if ($(this).val()) {
                    $(this).next().hide();
                }
                else {
                    $(this).next().show();
                }
            })
        }

        _init(initCallback);
        return {
            updatePickupPoints: _updatePickupPoints,

            GetData: function () {
                return userChoice;
            },
            ShowDetails: _showDetails,
            ShowPreview: _showPreview,
            UpdateInfoElements: _updateInfoElements,
            GetOutputData: _getOutputData
        }
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoPickupListModule = function (countryId, street, postcode, themePath, shippingContainer, pickupFilter, changeCallback, selectedPickupId, useInternalSorting, initCallback) {
        var _countryId = countryId;
        var _street = street;
        var _postcode = postcode;
        var _themePath = themePath.toLowerCase();
        var _pickupFilter = pickupFilter;
        var _isUpdating = false;
        var _triggerChangeCallback = false;
        var _functionQueue = [];
        var _shippingContainer = shippingContainer;
        var _changeCallback = changeCallback;
        var _useInternalSorting = useInternalSorting;

        var parent = $(_shippingContainer).closest('.aino-deliver-to');

        _placeholderToSearchField();

        String.prototype.insertString = function (start, delCount, newSubStr) {
            return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
        };

        var userChoice = {}, data = {}, sortedData = [], allData = [], carriers = [], limit;

        function _init(callback) {

            // initial
            _isUpdating = true;
            if (!selectedPickupId) {
                _setLocationLimit(3);
            }

            if (_countryId && _postcode && _postcode != "") {
                _setHandlers();
                _updatePickupPoints(function () {
                    var foundSelected = false;
                    if (selectedPickupId) {
                        for (var i = 0; i < sortedData.length; i++) {
                            if (sortedData[i].servicePointId == selectedPickupId) {
                                var listItems = $(_shippingContainer).find('.aino-location-list').find('.aino-location-container');
                                $(listItems[i]).trigger('click');
                                $(_shippingContainer).find('.load-more-locations').addClass('aino-disable');
                                foundSelected = true;
                                break;
                            }
                        }
                    }

                    if (!foundSelected) {
                        _triggerLocationSelection();
                    }

                    if (callback) {
                        callback();
                    }

                    _triggerChangeCallback = true;
                });
            }
        }

        function _updatePickupPoints(callback, postCode) {
            _isUpdating = true;
            var searchPostCode = postCode ? postCode : _postcode;
            ainoPostSvc.GetPointsAsync(searchPostCode, _countryId, null, null, function (callbackData) {
                var items = [];
                if (typeof callbackData.items !== "undefined") {
                    items = callbackData.items
                }

                if (_pickupFilter) {
                    items = items.filter(function (val) { return val.forwarderName == _pickupFilter; });
                }

                _shippingContainer.find('.no-points-message').remove();

                if (items.length == 0) {
                    if (typeof (callback) !== 'undefined') {
                        callback(items);
                    }

                    var locationsList = _shippingContainer.find(".aino-location-list");
                    locationsList.find('.aino-nav').hide();
                    locationsList.css('border-right', locationsList.css('border-left')); // right border equal to left
                    var loadMoreLocations = locationsList.parent().find('.load-more-locations');
                    loadMoreLocations.hide();
                    loadMoreLocations.parent().css('border-bottom', loadMoreLocations.parent().css('border-top'));
                    var message = ainoLangSvc.TranslateKey("postOfficeMap.searchError");
                    locationsList.append("<span class='no-points-message'>" + message + "</span>");
                }
                else {
                    var locationsList = _shippingContainer.find(".aino-location-list");
                    locationsList.find('.aino-nav').show();
                    locationsList.css('border-right', '');
                    var loadMoreLocations = locationsList.parent().find('.load-more-locations');
                    loadMoreLocations.show();
                    loadMoreLocations.parent().css('border-bottom', '');

                    if (_useInternalSorting) {
                        items.sort(function (a, b) {
                            var aNum = parseFloat(a.distanceRaw);
                            var bNum = parseFloat(b.distanceRaw);

                            return (aNum > bNum) ? 1 : ((bNum > aNum) ? -1 : 0);
                        });
                    }

                    _updateLocations(items);
                    if (typeof (callback) !== 'undefined') {
                        callback(items);
                    }
                }

                _isUpdating = false;
                while (_functionQueue.length > 0) {
                    (_functionQueue.shift())();
                }
            }, _useInternalSorting);
        }

        function _wrapFunction(fn, context, params) {
            return function () {
                fn.apply(context, params);
            }
        }

        function _updateLocations(items) {
            $('.aino-failed').hide();
            _clearListLocations();
            //get and sort data
            data = items;
            sortedData = items;
            //_sortArrayData();

            //set up the list of locations so the map can get the dynamic height from it
            _setListLocations();
        }

        function _setHandlers() {
            // load more location
            $(_shippingContainer).find('.load-more-locations').click(function (event) {
                event.preventDefault();
                $(this).addClass('aino-disable');
                _setLocationLimit(null);
                _updatePickupPoints(function () {
                    _triggerLocationSelection();
                });
            })

            // big map search
            $('.aino-search-point').find('input').keydown(function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    var parent = $(this).parents('.aino-search-point');
                    _searchMap(parent);
                }
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            $(_shippingContainer).find('button.aino-map-search').click(function (event) {
                event.preventDefault();
                var parent = $(this).parent('.aino-search-point');
                _searchMap(parent);
            });

            // back button
            $(_shippingContainer).find('.aino-backto-shipping').on('click', function (event) {
                event.preventDefault();
                $(_shippingContainer).removeClass('aino-active');
            });
        }

        function _searchMap(searchInputParent) {
            $(_shippingContainer).find('.postcode-error').hide();
            var searchedPostcode = $(searchInputParent).find('input').val();
            if (searchedPostcode) {
                _setLocationLimit(3);
                _updatePickupPoints(function (dataItems) {
                    if (dataItems && dataItems.length > 0) {
                        _street = "";
                        _postcode = searchedPostcode;
                        _triggerLocationSelection();
                    }
                    else {
                        userChoice = _getEmptyData();
                        _changeCallback();
                    }
                    //else {
                    //    $(_shippingContainer).find('.postcode-error').show();
                    //}
                }, searchedPostcode);
                $(_shippingContainer).find('.load-more-locations').removeClass('aino-disable');
            }
        }

        function _setListLocations() {
            var container = $(_shippingContainer).find('.aino-location-list > ul');
            if (sortedData.length == 0) {
                container.find('li').remove();
                return;
            }

            var full = container.find('li').length > 0;
            var len = (limit > 0 && limit < sortedData.length) ? limit : sortedData.length;
            if (full) {
                container.find('li').remove();
            }

            for (var x = 0; x < len; x++) {
                var item = sortedData[x];
                //var monFriOpen = (typeof item.opening !== 'undefined')
                //    ? item.opening[0].from1.insertString(2, 0, ":") : '';
                //var monFriClose = (typeof item.opening !== 'undefined')
                //    ? item.opening[0].to1.insertString(2, 0, ":") : '';
                //var satOpen = (typeof item.opening !== 'undefined')
                //    ? item.opening[item.opening.length - 1].from1.insertString(2, 0, ":") : '';
                //var satClose = (typeof item.opening !== 'undefined')
                //    ? item.opening[item.opening.length - 1].to1.insertString(2, 0, ":") : '';

                //var monFriOpen = item.opening;
                //var monFriClose = item.close;
                //var satOpen = item.opening_sat;
                //var satClose = item.close_sat;

                var openingHours = "";
                for (var h = 0; h < item.openingHours.length; h++) {
                    openingHours += item.openingHours[h] + "<br />";
                }

                var logoHtml = '<span class="aino-postnord-logo"></span>';
                if (item.logotypeUrl) {
                    logoHtml = '<img class="aino-logo-img" src="' + item.logotypeUrl + '" />';
                }

                var listItem = $('<li></li>');
                var shell = $('<label class="aino-location-container aino-input aino-checkbox"></label>')
                    .append($('<input type="radio" name="aino-location-' + _pickupFilter + '" value="">'))
                    .append($('<span class="aino-indicator"></span>'))
                    .append($('<b class="aino-location-title">' + item.name + '</b>'))
                    .append($('<span class="aino-destination-info aino-text-light"> '
                        + item.address + ' <br> ' + openingHours + '</span>'))
                    .append($('<span class="carrier-logo">' + logoHtml + '</span>'))
                    .append($('<hr>'));

                shell.appendTo(listItem.appendTo(container));
            }

            ainoLangSvc.Translate(container);

            _setActiveMarkerFromListItem();
        }

        function _triggerLocationSelection(locationId) {

            var selectedInput = $(_shippingContainer).find('.aino-location-list .aino-location-container').find('input:checked');
            var listItems = $(_shippingContainer).find('.aino-location-list').find('.aino-location-container');
            if (sortedData.length > 0) {
                if ($(selectedInput).length == 0) {
                    $(listItems[0]).trigger('click');
                }
                else {
                    $(selectedInput).trigger('change');
                }
            }
        }

        function _setActiveMarkerFromListItem() {
            var listItems = $(_shippingContainer).find('.aino-location-container').find('input');

            listItems.each(function (index) {
                $(this).unbind('change').on('change', function (e) {
                    e.preventDefault();
                    $(listItems).closest('.aino-location-container').removeClass('aino-active');
                    $(this).closest('.aino-location-container').addClass('aino-active');

                    var nameFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-name');
                    var infoFieldElement = $(_shippingContainer).find('.aino-user-choicen-destination .aino-destination-info');

                    _updateInfoElements(index, nameFieldElement, infoFieldElement);
                    userChoice = _getOutputData(index);

                    if (_changeCallback && _triggerChangeCallback) {
                        _changeCallback();
                    }
                });
            });
        }

        function _getEmptyData() {
            return {
                'name': '',
                'address': '',
                'city': '',
                'postcode': '',
                'servicePointId': '',
                'lat': '',
                'lng': '',
                'userPostcode': _postcode,
                'userAddress': _street
            }
        }

        function _getOutputData(index) {
            var item = sortedData[index];
            if (!item) {
                return {};
            }

            return {
                'name': item.name,
                'address': item.address,
                'city': item.city,
                'postcode': item.post_code,
                'servicePointId': item.servicePointId,
                'lat': item.lat,
                'lng': item.lng,
                'userPostcode': _postcode,
                'userAddress': _street
            }
        }

        function _clearListLocations() {
            var container = $(_shippingContainer).find('.vcsa-location-list > ul');
            $(container).find('li').remove();

            sortedData = [];
        }

        function _updateInfoElements(index, nameFieldElement, infoFieldElement) {
            if (sortedData.length == 0 || index >= sortedData.length) {
                $(nameFieldElement).html('');
                $(infoFieldElement).html('');
                return;
            }

            var item = sortedData[index];
            var monFriOpen = item.opening;
            var monFriClose = item.close;
            var satOpen = item.opening_sat;
            var satClose = item.close_sat;

            var name = sortedData[index].name;
            var hours = sortedData[index].openingHours;
            var info = sortedData[index].address + ' <br> ';
            if (hours.length > 0) {
                info += hours[0];
            }

            if (hours.length > 1) {
                info += '<br />' + hours[1];
            }

            $(nameFieldElement).html(name);
            $(infoFieldElement).html(info);

        }

        function _getFirstPickupPoint() {
            if (sortedData.length > 0) {
                return sortedData[0];
            }

            return {};
        }

        function _showDetails() {

        }

        function _showPreview(callback) {
            var showFunc = function () {
                $(_shippingContainer).find('.postcode-error').hide();
                $(_shippingContainer).find('.aino-search-point').find('input').val('').trigger('keyup');
                if (callback) {
                    callback();
                }
            }
            if (_isUpdating) {
                _functionQueue.push(_wrapFunction(showFunc, this));

            }
            else {
                showFunc();
            }
        }

        function _setLocationLimit(value) {
            limit = value;
        }

        function _placeholderToSearchField() {
            var input = $(_shippingContainer).find('.aino-search-point').find('input');

            input.on('keyup', function () {

                if ($(this).val()) {
                    $(this).next().hide();
                }
                else {
                    $(this).next().show();
                }
            })
        }

        _init(initCallback);
        return {
            updatePickupPoints: _updatePickupPoints,

            GetData: function () {
                return userChoice;
            },

            UpdateInfoElements: _updateInfoElements,
            GetOutputData: _getOutputData,
            ShowDetails: _showDetails,
            ShowPreview: _showPreview
        }
    };
})(jQuery, window, document);
'use strict';
; (function ($, window, document, undefined) {
    var _themePath;
    window.AinoWeatherInit = function (themePath) {
        _themePath = themePath
        var geocoder = new google.maps.Geocoder();

        function getWeatherAtPoint(country_id, street, postcode) {
            if (country_id && street && postcode) {
                geocoder.geocode({
                    address: street + ',' + postcode + ',' + country_id
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        _weatherAJAX(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                    }
                });
            }
        }

        function _weatherAJAX(lat, lng) {
            ainoWeatherSvc.GetData(lat, lng,
                function (data) {
                    $('.aino-weather').each(function () {
                        var self = this;
                        var days = [
                            "days.sun",
                            "days.mon",
                            "days.tue",
                            "days.wen",
                            "days.thu",
                            "days.fri",
                            "days.sat"
                        ];

                        if ($(this).find('li').length === 0) {
                            var container = $(self);
                            var listItem;
                            for (var x = 0; x < 3; x++) {
                                var date = (new Date().getDay() + x) <= 6 ? new Date().getDay() + x : (new Date().getDay() + x) - 7;
                                var icon = $('<img src="' + _themePath + '/images/weather-icons/' + data.list[x].weather[0].icon.replace('n', 'd') + '.png" width="24">');
                                var day = $('<div class="aino-weather-day trn">' + days[date] + '</div>');
                                var temp = $('<span class="aion-weather-temp">' + (parseInt(data.list[x].temp.day) - 273) + '<sup>o</sup>C</span>');

                                listItem = $('<li></li>');
                                day.appendTo(listItem);
                                icon.appendTo(listItem);
                                temp.appendTo(listItem);

                                listItem.appendTo(container);
                            }

                            if (typeof ainoLangSvc !== 'undefined') {
                                ainoLangSvc.Translate(container);
                            }
                        }
                    });
                });
        }

        return {
            getWeatherAtPoint: function (country_id, street, postcode) {
                getWeatherAtPoint(country_id, street, postcode);
            }
        }
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoDataService = function (url, key) {
        function _getDataAsync(sessionId, cartPrice, cartWeight, bulky, postcode, country, freeShipping) {
            var q = url.indexOf('?') !== -1 ? '&' : '?';

            var dataUrl = url
                + q + "api_key=" + key
                + "&cp=" + cartPrice
                + "&cw=" + cartWeight
                + "&blk=" + (bulky ? "1" : "0")
                + "&postcode=" + postcode
                + "&co=" + country
                + "&frsh=" + (freeShipping ? "1" : "0");

            if (sessionId) {
                dataUrl += "&sessionId=" + sessionId;
            }

            return $.ajax({
                url: dataUrl,
                dataType: "json",
                crossDomain: true
            }).then(function (resData) {
                if (resData.shipping) {
                    resData.shipping.sort(_sortShippings);
                }
                return resData;
            })
        }

        function _sortShippings(a, b) {
            var sortA = parseInt(a.sortOrder);
            var sortB = parseInt(b.sortOrder);

            return sortA - sortB;
        }

        return {
            GetDataAsync: _getDataAsync
        }
    };
})(jQuery, window, document)


; (function ($, window, document, undefined) {
    window.AinoDataUpdateService = function (url, key) {
        function _saveDataAsync(data) {
            var q = url.indexOf('?') !== -1 ? '&' : '?';
            var dataUrl = url + q + "api_key=" + key;
            return $.ajax({
                url: dataUrl,
                type: 'POST',
                data: data,
                crossDomain: true
            }).then(function (resData) {
                return resData;
            })
        }


        return {
            SaveDataAsync: _saveDataAsync
        }
    };
})(jQuery, window, document)

; (function ($, window, document, undefined) {
    window.AinoCssService = function (url) {
        function _loadAsync() {
            return $.ajax({
                url: url,
                cache: true, // set this to false if each CSS file
                // must refresh and not use a cached version
                success: function () {
                    $('<link>', { rel: 'stylesheet', type: 'text/css', 'href': url }).appendTo('head');
                }
            });
        }
        return {
            LoadAsync: _loadAsync,
        }
    }
})(jQuery, window, document)
; (function ($, window, document, undefined) {
    window.AinoGmapLoaderService = function (version) {
        function _loadAsync(apiKey) {
            return _loadGoogleMaps(version, apiKey);
        }
        return {
            LoadAsync: _loadAsync,
        }
    }

    function _loadGoogleMaps(version, apiKey) {
        var now = $.now();

        //Create a Deferred Object
        var deferred = $.Deferred(),

            //Declare a resolve function, pass google.maps for the done functions
            resolve = function () {
                deferred.resolve(window.google && google.maps ? google.maps : false);
            },

            //global callback name
            callbackName = "loadGoogleMaps_" + (now++),

            //Ajax URL params
            params;

        //If google.maps exists, then Google Maps API was probably loaded with the <script> tag
        if (window.google && google.maps) {

            resolve();

            //If the google.load method exists, lets load the Google Maps API in Async.
        } else if (window.google && google.load) {

            google.load("maps", version || 3, { "other_params": "sensor=false", "callback": resolve });

            //Last, try pure jQuery Ajax technique to load the Google Maps API in Async.
        } else {

            //Ajax URL params
            params = $.extend({
                'v': version || 3,
                'sensor': false,
                'callback': callbackName
            }, apiKey ? { "key": apiKey } : {});

            //Declare the global callback
            window[callbackName] = function () {
                resolve();

                //Delete callback
                setTimeout(function () {
                    try {
                        delete window[callbackName];
                    } catch (e) { }
                }, 20);
            };

            //Can't use the jXHR promise because 'script' doesn't support 'callback=?'
            $.ajax({
                dataType: 'script',
                data: params,
                url: 'https://maps.google.com/maps/api/js'
            });

        }

        return deferred.promise();

    }
})(jQuery, window, document)

; (function ($, window, document, undefined) {
    window.AinoLangService = function (url, key) {
        var _language = "en";
        var _langData;
        var q = url.indexOf('?') !== -1 ? '&' : '?';
        var dataUrl = url + q + "api_key=" + key + "&ver=2.9.5.0.0";
        function _loadAsync() {
            return $.ajax({
                url: dataUrl,
                dataType: "json",
                crossDomain: true
            }).then(function (resData) {
                _langData = resData;
                return resData;
            })
        }

        function _setLanguage(lang) {
            _language = lang;
        }

        function _translate(html) {
            var translator = $(html).translate({ lang: _language, t: _langData });
            $(html).find('textarea[placeholder]').each(function () {
                var plhKey = $(this).attr("placeholder");
                var plhText = translator.get(plhKey);
                $(this).attr("data-trn-key", plhKey);
                $(this).attr("placeholder", plhText);
            });
        }

        function _translateKey(langKey) {
            var translator = $('').translate({ lang: _language, t: _langData });
            var res = translator.get(langKey);
            //var translator = $.translate({ lang: _language, t: _langData });
            //var res = $('<label />').get(langKey);
            return res;
        }

        return {
            LoadAsync: _loadAsync,
            SetLanguage: _setLanguage,
            Translate: _translate,
            TranslateKey: _translateKey
        }
    }
})(jQuery, window, document)
; (function ($, window, document, undefined) {
    window.AinoPostService = (function (url, key) {
        var _postCode = "";
        var _country = "";
        var _latitude;
        var _longitude;
        var _pickupType = "PostNord";
        var q = url.indexOf('?') !== -1 ? '&' : '?';
        var _requestUrl = url + q + "api_key=" + key;
        var _points = {};
        var _requestCache = {};

        var _requestCallbacks = [];

        function _getPointsAsync(postCode, country, latitude, longitude, callback, enableSorting) {
            _requestCallbacks.push(callback);
            _loadPoints(postCode, country, latitude, longitude, enableSorting, callback)
        }

        function _loadPoints(postCode, country, latitude, longitude, enableSorting, callback) {
            var postOfficeUrl = _requestUrl
                + "&postcode=" + postCode
                + "&country=" + country;

            LoadDataFromApi(postOfficeUrl).done(function (data) {
                try {
                    var points = {};
                    if (data && data.length > 0) {
                        points = _preparePoints(data, latitude, longitude, enableSorting);
                    }

                    if (callback) {
                        callback(points);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            });
        }

        function LoadDataFromApi(apiUrl) {
            if (!_requestCache[apiUrl]) {
                _requestCache[apiUrl] = $.ajax({
                    url: apiUrl,
                    dataType: "json",
                    crossDomain: true
                });
            }

            return _requestCache[apiUrl];
        }

        function _preparePoints(responseData, latitude, longitude, enableSorting) {
            var pointNumber = 1;
            var data = {
                items: [],
                radio_html: ""
            };

            for (var key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    var point = responseData[key];

                    if (point.visitingAddress) {
                        var dataPoint = {
                            forwarderName: "",
                            address: "",
                            name: "",
                            number: "",
                            city: "",
                            post_code: "",
                            generate: "",
                            opening: "",
                            close: "",
                            opening_sat: "",
                            close_sat: "",
                            lat: "",
                            lng: "",
                            servicePointId: "",
                            radio_html: "",
                            distance: "",
                            distanceRaw: 0,
                            logotypeUrl: ""
                        }
                        dataPoint.forwarderName = point.forwarderName;
                        if (point.visitingAddress.streetName) {
                            dataPoint.address = point.visitingAddress.streetName + ' ' + point.visitingAddress.streetNumber;
                        }
                        else {
                            dataPoint.address = point.visitingAddress;
                        }

                        dataPoint.name = point.name;

                        var distKm = 0;
                        var distRaw = 0;
                        var pointCoordinates = point.coordinate;
                        if (latitude && longitude) {
                            distKm = _calcDistance(latitude, longitude, parseFloat(pointCoordinates.northing), parseFloat(pointCoordinates.easting));
                            distRaw = distKm;
                        }
                        else {
                            distKm = (Math.floor(point.routeDistance / 10) / 100);
                            distRaw = point.routeDistance;
                        }

                        dataPoint.distance = distKm;
                        dataPoint.distanceRaw = distRaw;
                        dataPoint.logotypeUrl = point.logotypeUrl;

                        //if (point.openingHours && point.openingHours.length > 0) {
                        //    dataPoint.opening = point.openingHours[0].from1;
                        //    dataPoint.close = point.openingHours[0].to1;
                        //}

                        //if (point.openingHours && point.openingHours.length > 5) {
                        //    dataPoint.opening_sat = point.openingHours[5].from1;
                        //    dataPoint.close_sat = point.openingHours[5].to1;
                        //}

                        dataPoint.openingHours = point.openingHours;

                        dataPoint.lat = pointCoordinates.northing;
                        dataPoint.lng = pointCoordinates.easting;
                        dataPoint.city = point.visitingAddress.city;
                        dataPoint.post_code = point.visitingAddress.postalCode;
                        dataPoint.number = point.visitingAddress.postalCode + ' ' + point.visitingAddress.city;
                        dataPoint.servicePointId = point.servicePointId;

                        //var generateLabel = point.visitingAddress.streetName + ' ' +
                        //    point.visitingAddress.streetNumber + ',' +
                        //    point.name + ',' +
                        //    point.visitingAddress.postalCode + ' ' +
                        //    point.visitingAddress.city + ',' +
                        //    (pointNumber) + ',';

                        //if (point.openingHours && point.openingHours.length > 0) {
                        //    generateLabel = generateLabel + point.openingHours[0].from1 + ',' +
                        //    point.openingHours[0].to1 + ',';
                        //}
                        //if (point.openingHours && point.openingHours.length > 5) {
                        //    generateLabel = generateLabel + point.openingHours[5].from1 + ',' +
                        //    point.openingHours[5].to1 + ',';
                        //}
                        //generateLabel = generateLabel + pointCoordinates.northing + ',' +
                        //    pointCoordinates.easting;
                        //dataPoint.generate = generateLabel;
                        pointNumber++;

                        data.items.push(dataPoint);
                    }
                }
            }

            //if (enableSorting) {

            //    data.items.sort(function (a, b) {
            //        var aNum = parseFloat(a.distanceRaw);
            //        var bNum = parseFloat(b.distanceRaw);

            //        return (aNum > bNum) ? 1 : ((bNum > aNum) ? -1 : 0);
            //    });
            //}

            return data;
        }

        function _calcDistance(point1Lat, point1Lng, point2Lat, point2Lng) {
            if (typeof (Number.prototype.toRadians) === "undefined") {
                Number.prototype.toRadians = function () {
                    return this * (Math.PI / 180);
                }
            }

            var R = 6371; // metres
            var f1 = point1Lat.toRadians();
            var f2 = point2Lat.toRadians();
            var df = (point2Lat - point1Lat).toRadians();
            var dg = (point2Lng - point1Lng).toRadians();

            var a = Math.sin(df / 2) * Math.sin(df / 2) +
                Math.cos(f1) * Math.cos(f2) *
                Math.sin(dg / 2) * Math.sin(dg / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            return d.toFixed(1);
        }

        return {
            GetPointsAsync: _getPointsAsync
        };
    });
})(jQuery, window, document)

; (function ($, window, document, undefined) {
    window.AinoGeocodeService = function () {
        var _geocoder;
        function _getLocation(street, postcode, country, callback) {
            var countryName = country.toLowerCase();
            switch (countryName) {
                case "se":
                    countryName = "Sweden";
                    break;
                case "fi":
                    countryName = "Finland";
                    break;
                case "no":
                    countryName = "Norway";
                    break;
                case "dk":
                    countryName = "Denmark";
                    break;
            }

            if (!_geocoder) {
                _geocoder = new google.maps.Geocoder();
            }

            _geocoder.geocode({
                address: street + ',' + postcode + ',' + countryName
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    callback(results);
                }
                else {
                    console.log("geocoder failed: " + status)
                    callback([]);
                }
            });
        }

        return {
            GetLocation: _getLocation
        }
    }
})(jQuery, window, document)
; (function ($, window, document, undefined) {
    window.AinoInCarValidationService = function (url) {
        function _validate(email, callback) {
            var apiQuery = url + "?email=" + email;
            $.get(apiQuery, callback);
        }

        return {
            Validate: _validate
        }
    }
})(jQuery, window, document)
;
var ainoDataSvc;
var ainoPostSvc;
var ainoLangSvc;
var ainoCssSvc;
var ainoGmapLoaderSvc;
//var ainoWeatherSvc;
var ainoGeocodeSvc;
var ainoInCarValidationSvc;

var aioWidgetThemes = {
    standard: {
        mainViewName: "AinoMainStdView",
        weatherViewName: "AinoWeatherView",
        shippingViews: {
            yourAddress: { css: "aino-address-tab", viewName: "AinoDeliveryAddrStdView" },
            yourBusiness: { css: "aino-business-tab", viewName: "AinoDeliveryBizStdView" },
            yourMailbox: { css: "aino-mailbox-tab", viewName: "AinoDeliveryMailboxStdView" },
            postOffice: { css: "aino-office-tab", viewName: "AinoPostOfficeStdView" }
        }
    },
    inline: {
        mainViewName: "AinoMainInlineView",
        //weatherViewName: "AinoWeatherView",
        shippingViews: {
            homeDeliveryFlex: { css: "aino-address-tab", viewName: "AinoHomeDeliveryFlexInlView" },
            homeDeliveryNorway: { css: "aino-address-tab", viewName: "AinoHomeDeliveryNorwayInlView" },
            homeDeliveryTabs: { css: "aino-address-tab", viewName: "AinoDeliveryTabsInlView" },
            businessDelivery: { css: "aino-business-tab", viewName: "AinoBusinessDeliveryInlView" },
            businessDeliveryTabs: { css: "aino-address-tab", viewName: "AinoDeliveryTabsInlView" },
            internationalDelivery: { css: "aino-business-tab", viewName: "AinoInternationalDeliveryInlView" },
            euDelivery: { css: "aino-business-tab", viewName: "AinoInternationalDeliveryInlView" },
            inCarDelivery: { css: "aino-incar-tab", viewName: "AinoInCarDeliveryInlView" },
            mailboxDelivery: { css: "aino-mailbox-tab", viewName: "AinoMailboxDeliveryInlView" },
            mailboxDeliveryNorway: { css: "aino-mailbox-tab", viewName: "AinoMailboxDeliveryNorwayInlView" },
            postOfficeDelivery: { css: "aino-office-tab", viewName: "AinoPostOfficeDeliveryInlView" },
            shopDelivery: { css: "aino-office-tab", viewName: "AinoShopDeliveryInlView" }
        }
    }
};

; (function ($, window, document, undefined) {
    $.widget("vConnect.allInOne", {
        options: {
            key: "",
            submitCallback: null,
            showLoader: true,

            //dataAPIUrl: "/scripts/data.json",
            //postOfficeAPIUrl: "/scripts/aio.points.json",
            langUrl: "https://widgetbackdev.vconnect.systems/api/get_translations",

            //dataAPIUrl: "https://deliverycheckout.postnord.com/api/get_widget",
            //postOfficeAPIUrl: "https://deliverycheckout.postnord.com/api/pickup_points",
            //inCarValidationAPIUrl: "https://deliverycheckout.postnord.com/api/in_car_validate_email",
            //saveAPIUrl: "https://deliverycheckout.postnord.com/api/save_widget",

            dataAPIUrl: "https://widgetbackdev.vconnect.systems/api/get_widget",
            postOfficeAPIUrl: "https://widgetbackdev.vconnect.systems/api/pickup_points",
            inCarValidationAPIUrl: "https://widgetbackdev.vconnect.systems/api/in_car_validate_email",
            saveAPIUrl: "https://widgetbackdev.vconnect.systems/api/save_widget",

            //dataAPIUrl: "http://widgetbackdev.vconnect.systems/api/get_widget",
            //saveAPIUrl: "http://widgetbackdev.vconnect.systems/api/save_widget",
            //postOfficeAPIUrl: "http://widgetbackdev.vconnect.systems/api/pickup_points",
            //inCarValidationAPIUrl: "https://widgetbackdev.vconnect.systems/api/in_car_validate_email",

            //weatherDataAPIUrl: "http://api.openweathermap.org/data/2.5/forecast/daily",
            //weatherDataApiKey: "",

            userPostcode: "",
            userLatitude: 0,
            userLongitude: 0,
            userStreet: "",
            userCountryCode: 'DK',
            cartTotalWeight: 0,
            cartTotalPrice: 0,
            hasBulkyProducts: false,

            themeFolder: "",
            loadCompletedCallback: null,
            optionChangedCallback: null,
            autoOpen: true,
            sessionId: null,
            enableSessions: false,
            enableFreeShipping: false,
            enablePostcodeCheck: true,
            defaults: {
                shippingId: "",
                deliveryDetails: {
                    id: "",
                    name: "",
                    type: ""
                }
            }
        },

        _init: function () {
            if (this.options.autoOpen) {
                this._loadWidget();
            }
        },

        _initialized: false,
        _dataLoadTimeout: 4000,
        _sessionId: '',

        _currentTheme: null,

        _view: null,

        _popupContainer: null,

        _create: function () {
            this.element.addClass("allInOne");
            this._setLoaderStyles();
        },

        _setOption: function (key, value) {
            this._super(key, value);
        },

        _setOptions: function (options) {
            this._super(options);
            this._initialized = false;
        },

        _initServices: function () {
            ainoDataSvc = new AinoDataService(this.options.dataAPIUrl, this.options.key);
            ainoDataUpdateSvc = new AinoDataUpdateService(this.options.saveAPIUrl, this.options.key);
            ainoPostSvc = new AinoPostService(this.options.postOfficeAPIUrl, this.options.key);
            ainoLangSvc = new AinoLangService(this.options.langUrl, this.options.key);
            ainoCssSvc = new AinoCssService(this._getCssUrl('inline'));
            ainoGmapLoaderSvc = new AinoGmapLoaderService("3");

            //ainoWeatherSvc = new AinoWeatherService(this.options.weatherDataAPIUrl, this.options.weatherDataApiKey);
            ainoGeocodeSvc = new AinoGeocodeService();
            ainoInCarValidationSvc = new AinoInCarValidationService(this.options.inCarValidationAPIUrl);
        },

        //_tempUpdateShipping: function (widgetData) {
        //    for (var i = 0; i < widgetData.shipping.length; i++) {
        //        if (widgetData.shipping[i].type == 'yourAddress') {
        //            widgetData.shipping[i].description2 = 'Til din adresse';
        //        }
        //        else if (widgetData.shipping[i].type == 'postOffice') {
        //            widgetData.shipping[i].description2 = 'Til udleveringssted';
        //        }
        //        else if (widgetData.shipping[i].type == 'yourBusiness') {
        //            widgetData.shipping[i].description2 = 'Kun erhvervsadresser';
        //        }

        //        widgetData.shipping[i].price = parseFloat(widgetData.shipping[i].price).toFixed(2);
        //    }

        //    return widgetData;
        //},

        _buildWidget: function (showAfterInit) {
            // call data API to get the data

            this._initServices();
            if (this.options.sessionId) {
                this._sessionId = this.options.sessionId;
            }

            this.options.userPostcode = this.options.userPostcode.replace(" ", "");
            $.when(
                ainoCssSvc.LoadAsync(),
                ainoDataSvc.GetDataAsync(this._sessionId, this.options.cartTotalPrice, this.options.cartTotalWeight, this.options.hasBulkyProducts, this.options.userPostcode, this.options.userCountryCode, this.options.enableFreeShipping),
                ainoLangSvc.LoadAsync()
            ).done(
                $.proxy(function (css, widgetData, langData) {
                    if (widgetData && langData && widgetData.shipping) {
                        if (widgetData.googleMaps) {
                            $.when(ainoGmapLoaderSvc.LoadAsync(widgetData.googleMaps))
                                .done($.proxy(function (gmapData) {
                                    this._loadWidgetInternal(widgetData, showAfterInit);
                                }, this));
                        }
                        else {
                            this._loadWidgetInternal(widgetData, showAfterInit);
                        }
                    }
                    else {
                        if (this.options.noShippingsAvailableCallback) {
                            this.options.noShippingsAvailableCallback();
                        }

                        this._showLoader(false);
                    }
                }, this)).fail($.proxy(this._failedHandler, this));
        },

        _loadWidgetInternal: function (widgetData, showAfterInit) {
            if (widgetData.shipping && widgetData.shipping.length == 0) {
                if (this.options.noShippingsAvailableCallback) {
                    this.options.noShippingsAvailableCallback();
                }
                else {
                    alert("No shipping methods available.");
                }
                this._showLoader(false);
                this.destroy();
                return;
            }

            if (!this._sessionId) { // new widget
                this._sessionId = widgetData.sessionId;
            }

            widgetData.theme = "inline";

            widgetData.widgetContainer = this.element;
            this._updateShippingWithUserInfo(widgetData);
            this._updateWithThemeFolder(widgetData);
            this._additionalUpdates(widgetData);
            this._updateShippingPrices(widgetData);

            ainoLangSvc.SetLanguage(widgetData.language);

            this._createViews(widgetData);

            this._initialized = true;
            if (showAfterInit) {
                this._showWidget(true);
            }

            this._showLoader(false);
            if (this.options.loadCompletedCallback) {
                this.options.loadCompletedCallback(true);
            }
        },

        _failedHandler: function (jqXHR, textStatus, errorThrown) {
            console.log("API request failed! " + errorThrown);
            this._showLoader(false);
            this.destroy();
        },

        _updateWithThemeFolder: function (widgetData) {
            var cssPath = this.options.themeFolder;
            if (!cssPath.endsWith("/")) {
                cssPath += "/";
            }
            widgetData.themeFolder = cssPath + widgetData.theme;
            for (var i = 0; i < widgetData.shipping.length; i++) {
                widgetData.shipping[i].themeFolder = widgetData.themeFolder;
            }
        },
        _setLoaderStyles: function () {
            var css = '.aino-loader {  ' +
                '       display:none;  ' +
                '       position: absolute;' +
                '       left: 50%;' +
                '       top: 50%;' +
                '       margin-top: 0px;' +
                '       margin-left: -27px;' +
                '       border-left: 5px solid #f3f3f3 !important; /* Light grey */  ' +
                '       border-right: 5px solid #f3f3f3 !important; /* Light grey */  ' +
                '       border-top: 5px solid #3498db !important; /* Blue */  ' +
                '       border-bottom: 5px solid #3498db !important; /* Blue */  ' +
                '       border-radius: 50%;  ' +
                '       width: 50px;  ' +
                '       height: 50px;  ' +
                '       animation: spin 2s linear infinite;  ' +
                '   }  ' +
                '     ' +
                '   @keyframes spin {  ' +
                '       0% { transform: rotate(0deg); }  ' +
                '       100% { transform: rotate(360deg); }  ' +
                '   }  ' +
                '    ';
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        },

        _getCssUrl: function (themeName) {
            var cssPath = this.options.themeFolder;
            if (!cssPath.endsWith("/")) {
                cssPath += "/";
            }

            cssPath += themeName.toLowerCase() + "/css/styles.css?v=" + vcAinoWidgetVersion;
            return cssPath;
        },

        _containsMapShipping: function (widgetData) {
            var contains = false;
            for (var index = 0; index < widgetData.shipping.length; index++) {
                var shippingType = widgetData.shipping[index].type;
                if (shippingType == "postOffice" || shippingType == "yourMailbox") {
                    contains = true;
                }
            }

            return contains;
        },

        _updateShippingWithPostnordPoints: function (widgetData, points) {
            for (var index = 0; index < widgetData.shipping.length; index++) {
                var shippingType = widgetData.shipping[index].type;
                if (shippingType == "postOffice" || shippingType == "yourMailbox" || shippingType == "pickupShop") {
                    widgetData.shipping[index].postnordPoints = points;
                }
            }
        },

        _updateShippingWithUserInfo: function (widgetData) {
            for (var index = 0; index < widgetData.shipping.length; index++) {
                var shippingType = widgetData.shipping[index].type;
                widgetData.shipping[index].userInfo = {
                    userPostcode: this.options.userPostcode,
                    userLatitude: this.options.userLatitude,
                    userLongitude: this.options.userLongitude,
                    userStreet: this.options.userStreet,
                    userCountryCode: this.options.userCountryCode
                };
            }
        },

        _updateShippingPrices: function (widgetData) {
            for (var index = 0; index < widgetData.shipping.length; index++) {
                widgetData.shipping[index].price = parseFloat(widgetData.shipping[index].price).toFixed(2);
                var shippingData = widgetData.shipping[index];
                if (shippingData.deliveryDetails && shippingData.deliveryDetails.type) {
                    for (var i = 0; i < shippingData.deliveryDetails.type.length; i++) {
                        var shippingPrice = parseFloat(shippingData.price);
                        shippingData.deliveryDetails.type[i].totalPrice = shippingPrice.toFixed(2);
                        var addedPrice = parseFloat(shippingData.deliveryDetails.type[i].addedPrice);
                        if (addedPrice) {
                            shippingData.deliveryDetails.type[i].totalPrice = addedPrice.toFixed(2);
                        }
                    }
                }
            }
        },

        _additionalUpdates: function (widgetData) {
            for (var x = 0; x < widgetData.shipping.length; x++) {
                var shipping = widgetData.shipping[x];
                shipping.enableMap = (widgetData.googleMaps) ? true : false;
                if (widgetData.shipping[x].deliveryDetails && widgetData.shipping[x].deliveryDetails.type) {
                    for (var y = 0; y < widgetData.shipping[x].deliveryDetails.type.length; y++) {
                        if (widgetData.shipping[x].deliveryDetails.type[y].location) {
                            for (var z = 0; z < widgetData.shipping[x].deliveryDetails.type[y].location.length; z++) {
                                widgetData.shipping[x].deliveryDetails.type[y].location[z].parentId = widgetData.shipping[x].deliveryDetails.type[y].id;
                            }
                        }
                    }
                }

            }
        },

        _createViews: function (widgetData) {
            // load pickup points maybe here
            this._currentTheme = aioWidgetThemes[widgetData.theme];
            this._view = new window[this._currentTheme.mainViewName]();
            try {
                this._view.Create(widgetData, $.proxy(this._submitWidget, this), this._cancelWidget, $.proxy(this._shippingOptionChanged, this), this._currentTheme.shippingViews, widgetData.defaultOptions, this.options.enablePostcodeCheck);
            }
            catch (err) {
                console.log(err);
            }
        },

        _loadWidget: function (ev) {
            if (ev) {
                ev.preventDefault();
            }

            if (!this._initialized) {
                if (this.options.showLoader) {
                    $.proxy(this._showLoader(true), this);
                }

                this._buildWidget(true);
            }
            else {
                this._showWidget(true);
            }
        },

        _showWidget: function (show) {
            this._view.Show(show);
        },

        _showLoader: function (show) {
            if (show) {
                var loader = $('.aino-loader');
                if (loader.length == 0) {
                    var loaderHtml = '<div class="aino-loader"></div>';
                    $(loaderHtml).appendTo(this.element).hide().show();
                }
                else {
                    $(loader).show();
                }
            }
            else {
                //if ($('.aino-loader').length == 0) {
                //    var loaderHtml = '<div class="aino-loader"></div>';
                //    $(loaderHtml).appendTo("body");
                //}

                $(".aino-loader").hide();
            }
        },

        _addQueryStringParam: function (url, name, value) {
            var loc = url;
            loc += loc.indexOf("?") === -1 ? "?" : "&";
            loc += name;
            loc += "=";
            loc += value;
            return loc;
        },

        _submitWidget: function (data) {
            if (this.options.submitCallback) {
                this.options.submitCallback(data);
            }
        },

        _cancelWidget: function () {
        },

        _shippingOptionChanged: function (data) {
            if (this.options.enableSessions) {
                var sessionObject = {
                    sessionId: this._sessionId,
                    shippingId: data.shippingId,
                    deliveryDetails: {
                        typeId: data.deliveryDetails.typeId,
                        addressId: data.deliveryDetails.addressId,
                        infoText: data.deliveryDetails.infoText,
                        email: data.deliveryDetails.email
                    },
                    userPostcode: data.deliveryDetails.userPostcode,
                    userAddress: data.deliveryDetails.userAddress
                }
                ainoDataUpdateSvc.SaveDataAsync(sessionObject);
            }

            if (this.options.optionChangedCallback) {
                if (!this.options.enableSessions) {
                    data.sessionId = undefined;
                }
                this.options.optionChangedCallback(data);
            }
        },

        _destroy: function () {
            this.element.removeClass("allInOne");
            this.element.unbind("click", this._loadWidget);
        },

        LoadWidget: function () {
            this._loadWidget();
        },

        GetData: function () {
            return this._view.GetData();
        }
    });
})(jQuery, window, document);


; (function ($, window, document, undefined) {
    $(document).ready(function () {
        $(".number-field").on("keydown", function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
})(jQuery, window, document)
; (function ($, window, document, undefined) {
    window.AinoMainInlineView = function () {
        var _mainTemplate = "<div> <div class=\"aino-container\"> <div class=\"aino-core\"> <div class=\"aino-header\"> <p>{{description}}<br><\/div><div class=\"aino-delivery-methods cf\"> <ul class=\"aino-nav aino-deliver-to\"> <li data-aino=\"customize-shipping\"> <ul class=\"aino-nav aino-delivery-detailed\"><\/ul> <div class=\"customize-shipping-empty\"> <div> <span class=\"aino-empty\"><\/span> <span class=\"trn\">mainView.emptyText<\/span> <\/div><\/div><\/li><\/ul> <\/div><div class=\"aino-footer\"> <span>Powered by<\/span> <span class=\"aino-postnord-logo\"><\/span> <\/div><\/div><\/div><\/div>";
        var _tabTemplate = "<li> <label class=\"aino-checkbox aino-collapse-trigger aino-input shipping-method-label shipping-tab\">{{title}}<input name=\"delivery-option\" type=\"radio\" value=\"{{type}}\"> <span> <span>{{description}}&nbsp;<\/span>{{#description2}}<span>{{description2}}&nbsp;<\/span>{{\/description2}}<span class=\"aino-delivery-price\">{{priceText}}<\/span> <\/span>{{^description2}}<label class=\"tab-empty-description2\">&nbsp;<\/label>{{\/description2}}<span class=\"aino-indicator\"><\/span> <span class=\"carrier-logo\"> <span class=\"aino-postnord-logo\"><\/span> <\/span> <\/label><\/li>";
        var _postcodeMessageTemplate = "<div class=\"postcode-form\"> <p><label class=\"trn\">postcodePopup.message<\/label><\/p><p><input type=\"text\" id=\"aino-postcode\"\/><\/p><\/div>";

        _container = null;
        //var _weatherObj;
        var _userInfo;
        var _widgetData;
        var _themePath;
        var _changeHandler;
        var _isInitializing = false;
        var _shippingObjects = [];
        var _checkForPostcode = false;

        function _create(widgetData, submitHandler, cancelHandler, changeHandler, shippingViews, defaults, checkForPostcode) {
            _destroyPreviousAinoInlineView();

            _isInitializing = true;
            _widgetData = widgetData;
            _changeHandler = changeHandler;
            _themePath = _widgetData.themeFolder;
            _defaults = defaults;
            _checkForPostcode = checkForPostcode
            _container = $('<div id="ainoWidget"></div>').appendTo(_widgetData.widgetContainer);
            _container[0].closest('tr').classList.add('aino-inline');

            for (var i = 0; i < _widgetData.shipping.length; i++) {
                if (_widgetData.shipping[i].userInfo) {
                    _userInfo = _widgetData.shipping[i].userInfo;
                }

                _widgetData.shipping[i].colorCode = "#" + _widgetData.colorCode;
            }

            _updatePriceText();

            // create view
            var outputHtml = Mustache.render($(_mainTemplate).html(), _widgetData);

            $(_container).append(outputHtml);

            _createShippings(shippingViews);

            _setShippingClickHandler();
            _jumpToStep();

            //_weatherObj = AinoWeatherInit(_themePath);
            //_weatherObj.getWeatherAtPoint(_userInfo.userCountryCode, _userInfo.userStreet, _userInfo.userPostcode);

            ainoLangSvc.Translate($(_container));
            _setDefaults();
            _updateActiveColor();
            _isInitializing = false;
            _threeColumnResizeFix();

        }

        function _destroyPreviousAinoInlineView() {
            var ainoInline = document.querySelector('.aino-inline');

            if (ainoInline) {
                ainoInline.remove();
            }
        };

        function _createShippings(shippingViews) {
            for (var index = 0; index < _widgetData.shipping.length; index++) {
                var shippingData = _widgetData.shipping[index];
                var type = shippingData.type;
                var shippingTheme = shippingViews[type];
                if (shippingTheme) {
                    shippingData.tabClass = shippingTheme.css;
                    var parentElement = _addTab(shippingData);

                    $(parentElement).data("shipping", type);
                    var viewClass = window[shippingTheme.viewName];
                    if (viewClass) {
                        var viewObj = new viewClass();
                        var defaults = null;
                        if (_defaults && _defaults.shippingId == shippingData.type) {
                            defaults = _defaults;
                        }

                        viewObj.Create(shippingData, parentElement, _onChange, defaults);
                        _shippingObjects[type] = viewObj;
                    }
                }
            }
        }

        function _threeColumnResizeFix() {
            $(window).resize(function () {
                if ($(_container).length > 0) {
                    $(_container).find('.aino-container').removeClass('aino-1column');
                    $(_container).find('.aino-container').removeClass('aino-3column');
                    if ($(_container).width() > 728) {
                        $(_container).find('.aino-container').addClass('aino-1column');
                    } else {
                        $(_container).find('.aino-container').addClass('aino-3column');
                    }
                }
            });
            $(window).trigger('resize');
        }

        function _updateActiveColor() {
            var $style = $("<style type='text/css'>").appendTo('head');
            var css = "#ainoWidget .aino-container .aino-tabs > li.aino-active label.aino-input { background-color:#" + _widgetData.colorCode + ";}";
            css += " #ainoWidget .aino-container .aino-checkbox > input:checked ~ .aino-indicator, #ainoWidget .aino-container .aino-checkbox > input[checked] ~ .aino-indicator { background-color:#" + _widgetData.colorCode + ";}";
            css += " #ainoWidget .aino-button.aino-active, #ainoWidget .aino-button.green { background-color:#" + _widgetData.colorCode + ";}";
            css += " #ainoWidget .aino-deliver-to > li.aino-active { border-top: 3px solid #" + _widgetData.colorCode + ";}";
            $style.html(css);
        }

        function _setStyle(cssText) {
            var sheet = document.createElement('style');
            sheet.type = 'text/css';
            /* Optional */ window.customSheet = sheet;
            (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
            return (setStyle = function (cssText, node) {
                if (!node || node.parentNode !== sheet)
                    return sheet.appendChild(document.createTextNode(cssText));
                node.nodeValue = cssText;
                return node;
            })(cssText);
        };

        function _updatePriceText() {
            for (var index = 0; index < _widgetData.shipping.length; index++) {
                var shippingData = _widgetData.shipping[index];
                var price = shippingData.price;
                if (shippingData.type == "mailboxDelivery") {
                    var addedPrice = '0';
                    if (_defaults.shippingId == "mailboxDelivery" && _defaults.deliveryDetails) {
                        var defaultDetailsTypeId = _defaults.deliveryDetails.typeId;
                        for (var a = 0; a < shippingData.deliveryDetails.type.length; a++) {
                            if (shippingData.deliveryDetails.type[a].id == defaultDetailsTypeId) {
                                addedPrice = shippingData.deliveryDetails.type[a].addedPrice;
                                break;
                            }
                        }
                    }
                    else {
                        if (shippingData.deliveryDetails.type[0].addedPrice) {
                            addedPrice = shippingData.deliveryDetails.type[0].addedPrice;
                        }
                    }

                    var currentPrice = parseFloat(price);
                    currentPrice = parseFloat(addedPrice);
                    price = currentPrice.toFixed(2);
                }

                if (!_widgetData.currency) _widgetData.currency = "";
                _widgetData.shipping[index].currency = _widgetData.currency;

                var currency = _widgetData.currency;
                if (_widgetData.zeroPriceText) {
                    if (price == "0.00" || price == 0.00 || price == '0' || price == 0) {
                        _widgetData.shipping[index].priceText = _widgetData.zeroPriceText;
                    }
                    else {
                        _widgetData.shipping[index].priceText = price + currency;
                    }
                }
                else {
                    _widgetData.shipping[index].priceText = price + currency;

                }
            }

        }

        function _addTab(data) {
            var tabList = $(_container).find('ul.aino-delivery-detailed');
            if (data) {
                var tabHtml = Mustache.render(_tabTemplate, data);
                var tab = $(tabHtml).appendTo(tabList);
                return tab;
            }
        }

        function _show() {
        }

        function _getData() {
            var data = {
                shippingTitle: "",
                shippingId: "",
                shippingDescription: "",
                carrierServiceCode: "",
                deliveryDetails: {
                    typeId: "",
                    typeText: "",
                    name: "",
                    addressId: "",
                    addressText: "",
                    city: "",
                    postcode: "",
                    email: "",
                    info: ""
                },
                price: 0,
                customAttributes: [],
                currency: _widgetData.currency,
                sessionId: _widgetData.sessionId
            };

            var activeShippingElement = $(_container).find('li.aino-active').filter(function () {
                return $(this).data("shipping");
            });

            var shippingData = _getActiveShippingData();
            if (shippingData) {
                data.shippingTitle = shippingData.title;
                data.shippingDescription = shippingData.description2;
                data.shippingId = shippingData.type;
                data.carrierServiceCode = shippingData.carrierServiceCode;

                var price = shippingData.price;
                data.deliveryDetails = _shippingObjects[shippingData.type].GetData();
                data.price = parseFloat(data.deliveryDetails.price).toFixed(2);
                delete data.deliveryDetails.price;

                data.customAttributes = shippingData.customAttributes;

            }


            return data;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getRadioVal(container, className) {

            var el = $(container).find("." + className + ":checked");
            if (el.length == 0) {
                el = $(container).find("." + className + "[checked=checked]");
            }

            var val = "";
            if (el.length > 0) {
                val = el.val();
            }

            return val;
        }

        function _getRadioAttribValue(container, name, attr) {
            var el = $(container).find("input[name=" + name + "]:checked");
            if (el.length == 0) {
                el = $(container).find("input[name=" + name + "][checked=checked]");
            }

            var val = "";
            if (el.length > 0) {
                val = el.attr(attr);
            }

            return val;
        }

        function _onChange() {
            var shippingData = _getActiveShippingData();
            var price = _shippingObjects[shippingData.type].GetPrice();
            var deliveryPrice = $(_container).find('li.aino-active .aino-delivery-price');

            if (_widgetData.zeroPriceText && (price == "0.00" || price == 0.00 || price == '0' || price == 0)) {
                price = _widgetData.zeroPriceText;
            } else {
                price = parseFloat(price).toFixed(2) + _widgetData.currency;
            }

            deliveryPrice.html(price);

            if (_changeHandler) {
                _changeHandler(_getData());
            }
        }

        function _setShippingClickHandler() {
            var shippingTabs = $(_container).find('.shipping-tab').on('click', function (event) {
                event.preventDefault();
                _selectShipping(this);
            });
        }

        function _selectShipping(shippingElement) {
            if (!shippingElement) {
                shippingElement = $(_container).find('.aino-delivery-detailed .aino-active');
            }
            var input = $(shippingElement).find('input[type="radio"]');

            var shippingModule = _shippingObjects[input.val()];
            if (_checkForPostcode && shippingModule.RequiresPostcode && !_userInfo.userPostcode) {
                var popup = new PopupDialog("popup-wrapper", _container[0], _postcodeMessageTemplate, "postcodePopup.ok", "postcodePopup.cancel", {
                    ok: function (el) {
                        var postcode = $(el).find('#aino-postcode').val();
                        if (postcode && postcode !== '') {
                            _userInfo.userPostcode = postcode;
                            for (var i = 0; i < _widgetData.shipping.length; i++) {
                                _widgetData.shipping[i].userInfo.userPostcode = postcode;
                            }

                            $(el).find('#aino-postcode').val('');
                            selectTab(shippingElement);
                        }
                    },
                    cancel: function (el) {
                        $(el).find('#aino-postcode').val('');
                    }
                });

                ainoLangSvc.Translate($(popup.instance));
            }
            else {
                selectTab(shippingElement);
            }
        }

        function selectTab(el) {
            if (!el) {
                el = $(_container).find('.aino-delivery-detailed .aino-active');
            }
            var input = $(el).find('input[type="radio"]');
            var shippingTabs = $(el).closest('ul').find('.shipping-tab');

            $(shippingTabs).parent('li').not(el).removeClass('aino-active');
            $(shippingTabs).not(el).find('input[type="radio"]').removeAttr('checked').prop('checked', false);
            $(el).parent('li').addClass('aino-active');
            input.prop('checked', true);

            if (_shippingObjects[input.val()]) {
                _shippingObjects[input.val()].Show();
                _setHeightToDetailedDelivery();
            }
        }

        function _setDefaults() {
            var shippingId;
            if (_defaults) {
                shippingId = _defaults.shippingId;
            }

            if (!shippingId) {
                shippingId = _widgetData.defaultShippingMethod;
            }

            if (shippingId) {
                var selectedShippingInput = $(_container).find('.aino-delivery-detailed li label input[name=delivery-option][value=' + shippingId + ']');
                if (selectedShippingInput.length > 0) {
                    _selectShipping($(selectedShippingInput).parent('.shipping-tab'));
                }
            }
        }

        function _jumpToStep() {
            $(_container).find('[data-aino-tostep]').on('click', function () {
                var attr = $(this).attr('data-aino-tostep');
                var delivery = $(this).closest('.aino-delivery');

                delivery.find('> .aino-media-left').hide();
                delivery.find('.aino-delivery-step').hide();
                delivery.find('.aino-step-' + attr).show();
            })
        }

        function _getShippingData(shippingName) {
            for (var index = 0; index < _widgetData.shipping.length; index++) {
                if (_widgetData.shipping[index].type == shippingName) {
                    return _widgetData.shipping[index];
                }
            }

            return null;
        }

        function _getActiveShippingData() {

            var activeShipping = $(_container).find('li.aino-active').filter(function () {
                return $(this).data("shipping");
            });
            var shippingMethod = $(activeShipping).data("shipping");
            var shippingData = _getShippingData(shippingMethod);

            return shippingData;
        }

        function _setHeightToDetailedDelivery() {
            var h = $(_container).find('.aino-delivery-detailed > li.aino-active > .aino-collapse').outerHeight();
            $(_container).find('.aino-deliver-to').css('min-height', h);
        }

        function _containsShippingMethod(shippingName) {
            for (var index = 0; index < _widgetData.shipping.length; index++) {
                if (_widgetData.shipping[index].type == shippingName) {
                    return true;
                }
            }

            return false;
        }

        return {
            Create: _create,
            Show: _show,
            GetData: _getData
        };
    }
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoHomeDeliveryFlexInlView = function () {
        var _template = "<div class=\"aino-big-package aino-collapse\"> <div><b class=trn>homeDeliveryFlex.title<\/b><\/div><ul class=\"aino-nav aino-tabs cf\">{{#deliveryDetails.type}}<li> <label class=\"aino-button aino-collapse-trigger aino-input deliveryType\" data-aino-control=\"{{id}}\"> <span class=trn style=\"display:inline\">{{name}}<\/span> <span class=\"inline-span\">&nbsp;-&nbsp;{{totalPrice}}<span class=\"inline-span\">{{currency}}<\/span><\/span> <input class=\"aino-button delivery-type-input\" name=\"yaDeliveryType\" data-id=\"{{id}}\" type=\"radio\" value=\"{{name}}\"> <\/label> <\/li>{{\/deliveryDetails.type}}<\/ul>{{#deliveryDetails.type}}<div class=aino-tab-content> <div class=aino-tab-panel data-aino-target={{id}}> <span class=\"trn aino-text-light\">{{type}}.{{id}}.text<\/span>{{#isFlex}}{{#enabled}}<div> <\/div><div class=\"aino-dropdown\"> <button type=\"button\" class=\"aino-dropdown-trigger\"><\/button> <ul class=\"aino-nav aino-dropdown-menu\">{{#location}}<li> <label class=\"aino-select-option deliveryLocation\"> <span class=\"trn\">flexLocation.{{id}}<\/span> <input class=\"trn delivery-location-input\" type=\"radio\" name=\"ya{{parentId}}\" data-id=\"{{id}}\" value=\"flexLocation.{{id}}\"\/> <span class=\"aino-indicator\"><\/span> <\/label> <\/li>{{\/location}}<\/ul> <\/div><label class=\"aino-entry-code\"> <input id=\"flexOtherInput\" class=\"trn\" type=\"text\" placeholder=\"flexLocation.other\"> <\/label>{{\/enabled}}{{\/isFlex}}<\/div><\/div>{{\/deliveryDetails.type}}<\/div>";
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults.deliveryDetails;
            }

            var updatedData = _updateData(widgetData);
            _shippingData = updatedData;
            var html = Mustache.render(_template, _shippingData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _hasLocations(deliveryTab) {
            var relatedLocations = $(_container).find('[data-aino-target=' + $(deliveryTab).attr('data-aino-control') + ']').find('.aino-select-option');
            return relatedLocations && relatedLocations.length > 0;
        }

        function _initElements() {
            // onClick events
            $(_container).find('.deliveryType').on('click', function (ev) {
                ev.preventDefault();
                _updateDeliveryTab($(this));
                if (_hasLocations($(this))) {
                    _selectActiveLocation($(this));
                }
                else {
                    _onChange();
                }
            });

            var deliveryLocations = $(_container).find('.aino-select-option');
            deliveryLocations.click(function (ev) {
                ev.preventDefault();
                _updateLocationTab(this);
                _updateOtherInputField($(this));
                _onChange();
            });

            _setLocationTabClickEvents();

            // onChange events
            var timer;
            $(_container).find('#flexOtherInput').keyup(function () {
                clearTimeout(timer);
                timer = setTimeout(function (event) {
                    _onChange();
                }, 500);
            });
        }

        function _updateOtherInputField(el) {
            var locInput = el.find('.delivery-location-input');
            if (locInput.length > 0) {
                if (locInput.closest('.aino-dropdown-menu').find('input[data-id=other]').length > 0) {
                    if (locInput.attr('data-id') == 'other') {
                        locInput.closest('[data-aino-target=flexDelivery]').find('#flexOtherInput').show();
                    }
                    else {
                        locInput.closest('[data-aino-target=flexDelivery]').find('#flexOtherInput').hide();
                    }
                }
            }
        }

        function _setLocationTabClickEvents() {
            $(_container).find('.aino-dropdown-trigger').on('click', function () {
                $(this).closest('.aino-dropdown').toggleClass('aino-open');
            });

            $(_container).find('.aino-select-option').on('click', function (ev) {
                ev.preventDefault();
                $(this).closest('.aino-dropdown-menu').find('li label input[type="radio"]').removeAttr('checked').prop('checked', false);

                var input = $(this).find('> input[type="radio"]');
                input.prop('checked', true);
                var value = input.attr('value');
                $(this).closest('.aino-dropdown-menu').siblings('.aino-dropdown-trigger').html(value);
                $(this).closest('.aino-dropdown').removeClass('aino-open');
            });

            $(document).on('click', function (e) {
                var dropdowns = $('.aino-dropdown-trigger');

                for (var x = 0; x < dropdowns.length; x++) {
                    if ((e.target) !== (dropdowns[x])) {
                        $(dropdowns[x]).closest('.aino-dropdown').removeClass('aino-open');
                    }
                }
            })
        }


        function _setLocationDropDown() {
            var locInputFirst = $(_container).find('.delivery-location-input:first');
            $(locInputFirst).prop('checked', true).trigger('click');
            $(locInputFirst).closest('.aino-dropdown').find('.aino-dropdown-trigger').html(locInputFirst.val());
        }

        function _onChange() {
            if (_changeCallback) {
                var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
                _changeCallback();
            }
        }

        function _getPrice() {
            var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
            var price = _shippingData.price;
            if (_shippingData.deliveryDetails) {
                for (var i = 0; i < _shippingData.deliveryDetails.type.length; i++) {
                    if (_shippingData.deliveryDetails.type[i].id == deliveryTypeId && _shippingData.deliveryDetails.type[i].totalPrice) {
                        price = _shippingData.deliveryDetails.type[i].totalPrice;
                        break;
                    }
                }
            }

            return parseFloat(price).toFixed(2);
        }

        function _updateData(widgetData) {
            var data = widgetData;

            if (data.deliveryDetails && data.deliveryDetails.type) {
                for (var i = 0; i < data.deliveryDetails.type.length; i++) {
                    if (data.deliveryDetails.type[i].id == 'flexDelivery' && data.deliveryDetails.type[i].location.length > 0) {
                        data.deliveryDetails.type[i].isFlex = true;
                    }
                }
            }

            return data;
        }

        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }
            else {
                _onChange();
            }
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                country: _shippingData.userInfo.userCountryCode,
                addressId: "",
                addressText: "",
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            var deliveryInput = $(_container).find('li.aino-active label.deliveryType input');
            var deliveryTypeId = deliveryInput.attr('data-id');
            deliveryData.typeId = deliveryTypeId;
            deliveryData.typeText = ainoLangSvc.TranslateKey(deliveryInput.val());

            var deliveryTab = "[data-aino-target=" + deliveryInput.parent('.deliveryType').attr('data-aino-control') + "]";
            var deliveryLocationInput = $(_container).find(deliveryTab).find('li.aino-active label.deliveryLocation input');
            if (deliveryLocationInput.length == 1) {
                deliveryData.addressId = deliveryLocationInput.attr('data-id');
                deliveryData.addressText = ainoLangSvc.TranslateKey(deliveryLocationInput.val());
            }

            deliveryData.info = $(_container).find('.aino-tab-panel.aino-active #flexOtherInput').val();
            return deliveryData;
        }

        function _loadDefaults() {
            var deliveryTab;
            if (_defaults && _defaults.typeId) {
                deliveryTab = $(_container).find('.deliveryType input[data-id="' + _defaults.typeId + '"]').closest('.deliveryType');
            }
            else {
                deliveryTab = $(_container).find('.deliveryType').first();
            }

            _updateDeliveryTab(deliveryTab);

            var locationId;
            if (_defaults && _defaults.addressId) {
                locationId = _defaults.addressId;
            }

            var otherInputText;
            if (_defaults && _defaults.infoText)
            {
                otherInputText = _defaults.infoText;
            }

            if (_hasLocations(deliveryTab)) {
                _selectActiveLocation(deliveryTab, locationId, otherInputText);
            }
            else {
                _onChange();
            }
        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _updateDeliveryTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-type-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-type-input').attr('checked', true).prop('checked', true);

            // show the content tab related to the selected delivery type
            var attr = $(el).attr('data-aino-control');
            var tabContent = $(el).closest('.aino-tabs').siblings('.aino-tab-content');
            $(tabContent).find('.aino-tab-panel').removeClass('aino-active');
            $(tabContent).find('[data-aino-target="' + attr + '"]').addClass('aino-active');
        }

        function _updateLocationTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-location-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-location-input').attr('checked', true).prop('checked', true);
        }

        function _selectActiveLocation(el, locationId, otherInputText) {
            var target = $(el).attr('data-aino-control');
            var contentContainer = $(_container).find('[data-aino-target=' + target + ']');

            if (otherInputText) {
                $(contentContainer).find('#flexOtherInput').val(otherInputText);
            }
            else {
                $(contentContainer).find('#flexOtherInput').val('');
            }

            if (locationId) {
                var locInput = contentContainer.find('.delivery-location-input[data-id="' + locationId + '"]').parent('.aino-select-option');
                locInput.trigger('click');
            }
            else {
                var locInput = contentContainer.find('.delivery-location-input:first').parent('.aino-select-option');
                locInput.trigger('click');
            }
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoHomeDeliveryNorwayInlView = function () {
        var _template = "<div class=\"aino-big-package aino-collapse\"> <div><b class=trn>homeDeliveryNorway.title<\/b><\/div><ul class=\"aino-nav aino-tabs cf\">{{#deliveryDetails.type}}<li> <label class=\"aino-button aino-collapse-trigger aino-input deliveryType\" data-aino-control=\"{{id}}\"> <span class=trn style=\"display:inline\">{{name}}<\/span> <span class=\"inline-span\">&nbsp;-&nbsp;{{totalPrice}}<span class=\"inline-span\">{{currency}}<\/span><\/span> <input class=\"aino-button delivery-type-input\" name=\"hdnDeliveryType\" data-id=\"{{id}}\" type=\"radio\" value=\"{{name}}\"> <\/label> <\/li>{{\/deliveryDetails.type}}<\/ul>{{#deliveryDetails.type}}<div class=aino-tab-content> <div class=aino-tab-panel data-aino-target={{id}}> <span class=\"trn aino-text-light\">{{type}}.{{id}}.text<\/span>{{#showLocationDropdown}}<div>&nbsp;<\/div><div> <b class=trn>homeDeliveryNorway.locationTitle<\/b> <\/div><div class=\"aino-dropdown\"> <button type=\"button\" class=\"aino-dropdown-trigger\"><\/button> <ul class=\"aino-nav aino-dropdown-menu\">{{#location}}<li> <label class=\"aino-select-option deliveryLocation\"> <span class=\"trn\">norwayStandardLocation.{{id}}<\/span> <input class=\"trn delivery-location-input\" type=\"radio\" name=\"hdn{{parentId}}\" data-id=\"{{id}}\" value=\"norwayStandardLocation.{{id}}\"\/> <span class=\"aino-indicator\"><\/span> <\/label> <\/li>{{\/location}}<\/ul> <\/div>{{\/showLocationDropdown}}<\/div><\/div>{{\/deliveryDetails.type}}<\/div>";
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults.deliveryDetails;
            }

            var updatedData = _updateData(widgetData);
            _shippingData = updatedData;
            var html = Mustache.render(_template, _shippingData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _hasLocations(deliveryTab) {
            var relatedLocations = $(_container).find('[data-aino-target=' + $(deliveryTab).attr('data-aino-control') + ']').find('.aino-select-option');
            return relatedLocations && relatedLocations.length > 0;
        }

        function _initElements() {
            // onClick events
            $(_container).find('.deliveryType').on('click', function (ev) {
                ev.preventDefault();
                _updateDeliveryTab($(this));
                if (_hasLocations($(this))) {
                    _selectActiveLocation($(this));
                }
                else {
                    _onChange();
                }
            });

            var deliveryLocations = $(_container).find('.aino-select-option');
            deliveryLocations.click(function (ev) {
                ev.preventDefault();
                _updateLocationTab(this);
                _onChange();
            });

            _setLocationTabClickEvents();
        }

        function _setLocationTabClickEvents() {
            $(_container).find('.aino-dropdown-trigger').on('click', function () {
                $(this).closest('.aino-dropdown').toggleClass('aino-open');
            });

            $(_container).find('.aino-select-option').on('click', function (ev) {
                ev.preventDefault();
                $(this).closest('.aino-dropdown-menu').find('li label input[type="radio"]').removeAttr('checked').prop('checked', false);

                var input = $(this).find('> input[type="radio"]');
                input.prop('checked', true);
                var value = input.attr('value');
                $(this).closest('.aino-dropdown-menu').siblings('.aino-dropdown-trigger').html(value);
                $(this).closest('.aino-dropdown').removeClass('aino-open');
            });

            $(document).on('click', function (e) {
                var dropdowns = $('.aino-dropdown-trigger');

                for (var x = 0; x < dropdowns.length; x++) {
                    if ((e.target) !== (dropdowns[x])) {
                        $(dropdowns[x]).closest('.aino-dropdown').removeClass('aino-open');
                    }
                }
            })
        }


        function _setLocationDropDown() {
            var locInputFirst = $(_container).find('.delivery-location-input:first');
            $(locInputFirst).prop('checked', true).trigger('click');
            $(locInputFirst).closest('.aino-dropdown').find('.aino-dropdown-trigger').html(locInputFirst.val());
        }

        function _onChange() {
            if (_changeCallback) {
                var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
                _changeCallback();
            }
        }

        function _getPrice() {
            var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
            var price = _shippingData.price;
            if (_shippingData.deliveryDetails) {
                for (var i = 0; i < _shippingData.deliveryDetails.type.length; i++) {
                    if (_shippingData.deliveryDetails.type[i].id == deliveryTypeId && _shippingData.deliveryDetails.type[i].totalPrice) {
                        price = _shippingData.deliveryDetails.type[i].totalPrice;
                        break;
                    }
                }
            }

            return parseFloat(price).toFixed(2);
        }

        function _updateData(widgetData) {
            var data = widgetData;

            if (data.deliveryDetails && data.deliveryDetails.type) {
                for (var i = 0; i < data.deliveryDetails.type.length; i++) {
                    if (data.deliveryDetails.type[i].id == 'standardDelivery' && data.deliveryDetails.type[i].location.length > 0) {
                        data.deliveryDetails.type[i].showLocationDropdown = true;
                    }
                }
            }

            return data;
        }

        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }
            else {
                _onChange();
            }
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                country: _shippingData.userInfo.userCountryCode,
                addressId: "",
                addressText: "",
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            var deliveryInput = $(_container).find('li.aino-active label.deliveryType input');
            var deliveryTypeId = deliveryInput.attr('data-id');
            deliveryData.typeId = deliveryTypeId;
            deliveryData.typeText = ainoLangSvc.TranslateKey(deliveryInput.val());

            var deliveryTab = "[data-aino-target=" + deliveryInput.parent('.deliveryType').attr('data-aino-control') + "]";
            var deliveryLocationInput = $(_container).find(deliveryTab).find('li.aino-active label.deliveryLocation input');
            if (deliveryLocationInput.length == 1) {
                deliveryData.addressId = deliveryLocationInput.attr('data-id');
                deliveryData.addressText = ainoLangSvc.TranslateKey(deliveryLocationInput.val());
            }

            return deliveryData;
        }

        function _loadDefaults() {
            var deliveryTab;
            if (_defaults && _defaults.typeId) {
                deliveryTab = $(_container).find('.deliveryType input[data-id="' + _defaults.typeId + '"]').closest('.deliveryType');
            }
            else {
                deliveryTab = $(_container).find('.deliveryType').first();
            }

            _updateDeliveryTab(deliveryTab);

            var locationId;
            if (_defaults && _defaults.addressId) {
                locationId = _defaults.addressId;
            }

            var otherInputText;
            if (_defaults && _defaults.infoText)
            {
                otherInputText = _defaults.infoText;
            }

            if (_hasLocations(deliveryTab)) {
                _selectActiveLocation(deliveryTab, locationId, otherInputText);
            }
            else {
                _onChange();
            }
        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _updateDeliveryTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-type-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-type-input').attr('checked', true).prop('checked', true);

            // show the content tab related to the selected delivery type
            var attr = $(el).attr('data-aino-control');
            var tabContent = $(el).closest('.aino-tabs').siblings('.aino-tab-content');
            $(tabContent).find('.aino-tab-panel').removeClass('aino-active');
            $(tabContent).find('[data-aino-target="' + attr + '"]').addClass('aino-active');
        }

        function _updateLocationTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-location-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-location-input').attr('checked', true).prop('checked', true);
        }

        function _selectActiveLocation(el, locationId, otherInputText) {
            var target = $(el).attr('data-aino-control');
            var contentContainer = $(_container).find('[data-aino-target=' + target + ']');


            if (locationId) {
                var locInput = contentContainer.find('.delivery-location-input[data-id="' + locationId + '"]').parent('.aino-select-option');
                locInput.trigger('click');
            }
            else {
                var locInput = contentContainer.find('.delivery-location-input:first').parent('.aino-select-option');
                locInput.trigger('click');
            }
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoDeliveryTabsInlView = function () {
        var _template = "<div class=\"aino-big-package aino-collapse\"> <div><b class=trn>{{type}}.title<\/b><\/div><ul class=\"aino-nav aino-tabs cf\">{{#deliveryDetails.type}}<li> <label class=\"aino-button aino-collapse-trigger aino-input deliveryType\" data-aino-control=\"{{id}}\"> <span class=trn style=\"display:inline\">{{type}}.type.{{id}}<\/span> <input class=\"aino-button delivery-type-input\" name=\"yatDeliveryType\" data-id=\"{{id}}\" type=\"radio\" value=\"{{type}}.type.{{id}}\"> <\/label> <\/li>{{\/deliveryDetails.type}}<\/ul> <div> <b class=\"trn\">{{type}}.text1<\/b> <\/div>{{#deliveryDetails.type}}<div class=aino-tab-content> <div class=aino-tab-panel data-aino-target={{id}}> <button type=\"button\" class=\"aino-dropdown-trigger\"><\/button> <ul class=\"aino-nav aino-tabs cf\">{{#location}}<li> <label class=\"aino-button aino-collapse-trigger aino-input aino-select-option deliveryLocation\"> <span class=trn style=\"display:inline\">{{type}}.location.{{id}}<\/span> <input class=\"aino-button delivery-location-input\" name=\"yat{{parentId}}Loc\" data-id=\"{{id}}\" type=\"radio\" value=\"{{type}}.location.{{id}}\"> <\/label> <\/li>{{\/location}}<\/ul> <div> <b class=\"trn\">{{type}}.text2<\/b> <\/div><\/div><\/div>{{\/deliveryDetails.type}}<\/div>";
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults.deliveryDetails;
            }

            var updatedData = _updateData(widgetData);
            _shippingData = updatedData;


            var html = Mustache.render(_template, _shippingData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {
            // onClick events
            $(_container).find('.deliveryType').on('click', function (ev) {
                ev.preventDefault();
                _updateDeliveryTab($(this));
                _selectActiveLocation($(this));
            });

            var deliveryLocations = $(_container).find('.deliveryLocation');
            deliveryLocations.on('click', function (ev) {
                ev.preventDefault();
                _updateLocationTab($(this));
            });

            // onChange events
            if (deliveryLocations.length > 0) {
                deliveryLocations.on('click', function (ev) {
                    ev.preventDefault();
                    _onChange();
                });
            }
            else {
                $(_container).find('.deliveryType').on('click', function (ev) {
                    ev.preventDefault();
                    _onChange();
                });
            }
        }

        function _onChange() {
            if (_changeCallback) {
                var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');

                _changeCallback();
            }
        }

        function _getPrice() {
            var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
            var price = _shippingData.price;
            if (_shippingData.deliveryDetails) {
                for (var i = 0; i < _shippingData.deliveryDetails.type.length; i++) {
                    if (_shippingData.deliveryDetails.type[i].id == deliveryTypeId && _shippingData.deliveryDetails.type[i].totalPrice) {
                        price = _shippingData.deliveryDetails.type[i].totalPrice;
                        break;
                    }
                }
            }

            return parseFloat(price).toFixed(2);
        }

        function _updateData(widgetData) {
            return widgetData;
        }

        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }
            else {
                _onChange();
            }
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                addressId: "",
                addressText: "",
                country: _shippingData.userInfo.userCountryCode,
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            var deliveryInput = $(_container).find('li.aino-active label.deliveryType input');
            var deliveryTypeId = deliveryInput.attr('data-id');

            deliveryData.typeId = deliveryTypeId;
            deliveryData.typeText = ainoLangSvc.TranslateKey(deliveryInput.val());
            var deliveryTab = "[data-aino-target=" + deliveryInput.parent('.deliveryType').attr('data-aino-control') + "]";
            var deliveryLocationInput = $(_container).find(deliveryTab).find('li.aino-active label.deliveryLocation input');
            if (deliveryLocationInput.length == 1) {
                deliveryData.addressId = deliveryLocationInput.attr('data-id');
                deliveryData.addressText = ainoLangSvc.TranslateKey(deliveryLocationInput.val());
            }

            return deliveryData;
        }

        function _loadDefaults() {
            var deliveryTab;
            if (_defaults && _defaults.typeId) {
                deliveryTab = $(_container).find('.deliveryType input[data-id="' + _defaults.typeId + '"]').closest('.deliveryType');
            }
            else {
                deliveryTab = $(_container).find('.deliveryType').first();
            }

            _updateDeliveryTab(deliveryTab);

            var locationId;
            if (_defaults && _defaults.addressId) {
                locationId = _defaults.addressId;
            }

            if ($(_container).find('.deliveryLocation').length > 0) {
                _selectActiveLocation(deliveryTab, locationId);
            }
            else {
                _onChange();
            }
        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _updateDeliveryTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-type-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-type-input').attr('checked', true).prop('checked', true);

            // show the content tab related to the selected delivery type
            var attr = $(el).attr('data-aino-control');
            var tabContent = $(el).closest('.aino-tabs').siblings('.aino-tab-content');
            $(tabContent).find('.aino-tab-panel').removeClass('aino-active');
            $(tabContent).find('[data-aino-target="' + attr + '"]').addClass('aino-active');
        }

        function _updateLocationTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-location-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-location-input').attr('checked', true).prop('checked', true);
        }

        function _selectActiveLocation(el, locationId) {
            var target = $(el).attr('data-aino-control');
            var contentContainer = $(_container).find('[data-aino-target=' + target + ']');

            if (locationId) {
                var locInput = contentContainer.find('.delivery-location-input[data-id="' + locationId + '"]').parent('.aino-select-option');
                locInput.trigger('click');
            }
            else {
                var locInput = contentContainer.find('.delivery-location-input:first').parent('.aino-select-option');
                locInput.trigger('click');
            }
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoBusinessDeliveryInlView = function () {
        var _template = "<div class=\"aino-collapse\"> <ul class=\"aino-nav aino-tabs cf\" style=\"display:none\">{{#deliveryTime}}<li><label class=\"aino-button aino-collapse-trigger aino-input deliveryTypeId\" data-aino-control=\"{{name}}\"> <span class=\"trn\" style=\"display:inline\">{{name}}<\/span> <span style=\"display:inline\">-{{totalPrice}}kr<\/span> <input class=\"aino-button delivery-type-input\" name=\"ybDeliveryType\" type=\"radio\" value=\"{{name}}\"><\/label><\/li>{{\/deliveryTime}}<\/ul> <div><b class=\"trn\">businessDelivery.text1<\/b><\/div><div class=\"trn aino-text-light\">businessDelivery.text2<\/div><br><div class=\"aino-text-light aino-media\"> <div class=\"aino-media-left\"><span class=\"aino-exclamation-sign\"><\/span><\/div><div class=\"trn aino-media-body\">businessDelivery.text3<\/div><\/div><\/div>";
        var _container;
        var _changeCallback;
        var _shippingData;

        function _create(widgetData, container, changeCallback) {
            _container = container;
            _changeCallback = changeCallback;
            _shippingData = widgetData;
            var html = Mustache.render(_template, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {

        }

        function _show() {
            _onChange();
        }

        function _onChange() {
            if (_changeCallback) {
                _changeCallback();
            }
        }

        function _getPrice() {
            var price = _shippingData.price;
            return parseFloat(price).toFixed(2);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                addressId: "",
                addressText: "",
                country: _shippingData.userInfo.userCountryCode,
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoInternationalDeliveryInlView = function () {
        var _template = "<div class=\"aino-collapse\"> <div class=\"aino-text-light aino-media\"> <div class=\"aino-media-left\"><span class=\"aino-exclamation-sign\"><\/span><\/div><div class=\"trn aino-media-body\">{{type}}.text<\/div><\/div><\/div>";
        var _container;
        var _changeCallback;
        var _shippingData;

        function _create(widgetData, container, changeCallback) {
            _container = container;
            _changeCallback = changeCallback;
            _shippingData = widgetData;
            var html = Mustache.render(_template, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {

        }

        function _show() {
            _onChange();
        }

        function _onChange() {
            if (_changeCallback) {
                _changeCallback();
            }
        }

        function _getPrice() {
            var price = _shippingData.price;
            return parseFloat(price).toFixed(2);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                addressId: "",
                addressText: "",
                country: _shippingData.userInfo.userCountryCode,
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoInCarDeliveryInlView = function () {
        var _template = "<div class=\"aino-collapse\"> <div><b class=\"trn\">inCarDelivery.text1<\/b><\/div><div class=\"trn aino-text-light\">inCarDelivery.text2<\/div><br><div class=\"aino-text-light aino-media\"> <div class=\"aino-media-left\"><span class=\"aino-exclamation-sign\"><\/span><\/div><div class=\"trn aino-media-body\">inCarDelivery.text3<\/div><\/div><div class=\"aino-text-light\"> <input id=\"inCarEmail\" class=\"trn\" type=\"text\" placeholder=\"inCarDelivery.email\"\/> <span class=\"trn incar-email-error\">inCarDelivery.emailError<\/span> <span class=\"trn incar-email-success\">inCarDelivery.emailSuccess<\/span> <br\/> <button type=\"button\" id=\"inCarEmailSearch\" class=\"trn aino-button green\">inCarDelivery.searchEmail<\/button> <\/div><\/div>";
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults;
            }

            _shippingData = widgetData;

            var html = Mustache.render(_template, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {
            // click handlers
            $(_container).find('#inCarEmailSearch').click(function () {
                _validateEmail();
            })

            // change events
            var timer;
            $(_container).find('#inCarEmail').keyup(function () {
                clearTimeout(timer);
                timer = setTimeout(function (event) {
                    _onChange();
                }, 500);
            });
        }

        function _validateEmail() {
            var email = $(_container).find('#inCarEmail').val();
            if (email && email != "") {
                ainoInCarValidationSvc.Validate(email, function (data) {
                    if (data == '0') {
                        $(_container).find('.incar-email-success').hide();
                        $(_container).find('.incar-email-error').show();
                    }
                    else {
                        $(_container).find('.incar-email-success').show();
                        $(_container).find('.incar-email-error').hide();
                    }
                });
            }
            else {
                $(_container).find('.incar-email-success').hide();
                $(_container).find('.incar-email-error').show();
            }
        }

        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }

            _onChange();
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                addressId: "",
                addressText: "",
                country: _shippingData.userInfo.userCountryCode,
                city: "",
                postcode: "",
                email: $(_container).find('#inCarEmail').val(),
                info: "",
                price: _getPrice()
            };

            return deliveryData;
        }

        function _loadDefaults() {
            if (_defaults && _defaults.deliveryDetails && _defaults.deliveryDetails.email) {
                $(_container).find('#inCarEmail').val(_defaults.deliveryDetails.email);
            }
        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _onChange() {
            if (_changeCallback) {
                _changeCallback();
            }
        }

        function _getPrice() {
            var price = _shippingData.price;
            return parseFloat(price).toFixed(2);
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
    };
})(jQuery, window, document);
; (function ($, window, document, undefined) {
    window.AinoMailboxDeliveryInlView = function () {
        var _template = '<div class="aino-big-package aino-collapse">{{#showDefaultMessages}}<div><b class="trn">mailboxDelivery.text1</b></div><div class="trn aino-text-light">mailboxDelivery.text2</div><br><div class="aino-text-light aino-media"> <div class="aino-media-left"><span class="aino-exclamation-sign"></span></div><div class="trn aino-media-body">mailboxDelivery.text3</div></div>{{/showDefaultMessages}}{{^showDefaultMessages}}<div><b class=trn>mailboxDelivery.title</b></div><ul class="aino-nav aino-tabs cf">{{#deliveryDetails.type}}<li> <label class="aino-button aino-collapse-trigger aino-input deliveryType" data-aino-control="{{id}}"> <span class="trn inline-span">{{name}}</span> <span class="inline-span">-{{totalPrice}}<span class="inline-span">{{currency}}</span></span> <input class="aino-button delivery-type-input" name="mbDeliveryType" data-id="{{id}}" type="radio" value="{{name}}"> </label> </li>{{/deliveryDetails.type}}</ul> <label class="aino-checkbox mailbox--holder"><input class="mailbox-delivery-type" type="radio" name="mailbox_delivery_type" value="point" /><span class="aino-indicator"></span><b class="trn">mailboxDelivery.text4</b></label><div class="aino-chosen-destination aino-media"> <div class="aino-media-left"><span class="aino-marker"></span></div><div class="aino-media-body aino-fast-destination"> <div class="aino-destination-name aino-media-heading"><span class="nearest-point-title"></span></div><div class="aino-destination-info"><span class="nearest-point-address"></span><br><span class="nearest-point-worktime"></span></div></div></div><hr class="mailbox--hr"><label class="aino-checkbox mailbox--holder"><input class="mailbox-delivery-type" type="radio" name="mailbox_delivery_type" value="door"/><span class="aino-indicator"></span><b class="trn">mailboxDelivery.text5</b></label>{{/showDefaultMessages}}</div>';
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        var _pickupLoading = false;
        var _isInitialized = false;
        var _requestOnChange = false;
        var _pickupData = {};

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults.deliveryDetails;
            }

            var updatedData = _updateData(widgetData);
            _shippingData = updatedData;

            var html = Mustache.render(_template, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {
            // onClick events
            $(_container).find('.deliveryType').on('click', function (ev) {
                ev.preventDefault();
                _updateDeliveryTab($(this));
                _onChange();
            });

            _setPickupInfo();
        }

        function _updateData(widgetData) {
            var data = widgetData;
            if (!data.deliveryDetails || !data.deliveryDetails.type || data.deliveryDetails.type.length == 0) {
                data.showDefaultMessages = true;
            }

            return data;
        }
        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }

            if (!_isInitialized) {
                _setPickupInfo();
            }
            else {
                _showPickupInfo();
            }
        }

        function _showPickupInfo() {
            if (_pickupLoading) {
                _requestOnChange = true;
            }
            else {
                _onChange();
            }
        }

        function _loadDefaults() {
            var deliveryTab;
            if (_defaults && _defaults.typeId) {
                deliveryTab = $(_container).find('.deliveryType input[data-id="' + _defaults.typeId + '"]').closest('.deliveryType');
            }
            else {
                deliveryTab = $(_container).find('.deliveryType').first();
            }

            _updateDeliveryTab(deliveryTab);
        }

        function _setPickupInfo(initCallback) {
            var street = _shippingData.userInfo.userStreet;
            var postCode = _shippingData.userInfo.userPostcode;
            var country = _shippingData.userInfo.userCountryCode;

            _pickupLoading = true;
            if (postCode && postCode != "") {
                _isInitialized = true;
                if (_shippingData.enableMap) {
                    ainoGeocodeSvc.GetLocation(street, postCode, country, function (results) {
                        if (results.length > 0) {
                            var myLatLng = new google.maps.LatLng({
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            });

                            _setPickupInfoPoints(postCode, country, myLatLng.lat(), myLatLng.lng(), initCallback);
                        }
                    });
                }
                else {
                    _setPickupInfoPoints(postCode, country, null, null, initCallback);
                }

            }
            else {
                _pickupLoading = false;
            }
        }

        function _setPickupInfoPoints(postCode, country, lat, lng, initCallback) {
            ainoPostSvc.GetPointsAsync(postCode, country, lat, lng, function (data) {
                var nameFieldElement = $(_container).find('.aino-fast-destination .aino-destination-name');
                var infoFieldElement = $(_container).find('.aino-fast-destination .aino-destination-info');

                if (data.items.length == 0) {
                    $(nameFieldElement).html('');
                    $(infoFieldElement).html('');
                    _pickupLoading = false;
                    return;
                }

                var item = data.items[0];
                if (item) {
                    _pickupData = item;
                    var monFriOpen = item.opening;
                    var monFriClose = item.close;
                    var satOpen = item.opening_sat;
                    var satClose = item.close_sat;

                    var name = item.name;
                    var hours = item.openingHours;
                    var info = item.address + ' <br> ';
                    if (hours.length > 0) {
                        info += hours[0];
                    }

                    if (hours.length > 1) {
                        info += '<br />' + hours[1];
                    }

                    $(nameFieldElement).html(name);
                    $(infoFieldElement).html(info);
                }


                if (initCallback) {
                    initCallback();
                }

                _pickupLoading = false;
                if (_requestOnChange) {
                    _onChange();
                }

                _requestOnChange = false;
            }, false);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                country: _shippingData.userInfo.userCountryCode,
                addressId: "",
                addressText: "",
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            var deliveryInput = $(_container).find('li.aino-active label.deliveryType input');
            var deliveryTypeId = deliveryInput.attr('data-id');
            deliveryData.typeId = deliveryTypeId;
            deliveryData.typeText = ainoLangSvc.TranslateKey(deliveryInput.val());

            deliveryData.addressId = _pickupData.servicePointId;
            deliveryData.addressText = _pickupData.address;
            deliveryData.name = _pickupData.name;
            deliveryData.city = _pickupData.city;
            deliveryData.postcode = _pickupData.post_code;

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _onChange() {
            if (_changeCallback) {
                var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
                _changeCallback();
            }
        }

        function _getPrice() {
            var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
            var price = parseFloat(_shippingData.price);

            if (_shippingData.type !== 'mailboxDelivery' && _shippingData.deliveryDetails && _shippingData.deliveryDetails.type) {
                for (var i = 0; i < _shippingData.deliveryDetails.type.length; i++) {
                    if (_shippingData.deliveryDetails.type[i].id == deliveryTypeId && _shippingData.deliveryDetails.type[i].addedPrice) {
                        price = price + parseFloat(_shippingData.deliveryDetails.type[i].addedPrice);
                        break;
                    }
                }
            }

            return price.toFixed(2);
        }

        function _updateDeliveryTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-type-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-type-input').attr('checked', true).prop('checked', true);
        }


        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
        this.RequiresPostcode = true;
    };
})(jQuery, window, document);

; (function ($, window, document, undefined) {
    window.AinoMailboxDeliveryNorwayInlView = function () {
        var _template = "<div class=\"aino-big-package aino-collapse\"> <div><b class=trn>mailboxDeliveryNorway.title<\/b><\/div><ul class=\"aino-nav aino-tabs cf\">{{#deliveryDetails.type}}<li> <label class=\"aino-button aino-collapse-trigger aino-input deliveryType\" data-aino-control=\"{{id}}\"> <span class=\"inline-span\">{{name}}<\/span> <input class=\"aino-button delivery-type-input\" name=\"mbnoDeliveryType\" data-id=\"{{id}}\" type=\"radio\" value=\"{{name}}\"> <\/label> <\/li>{{\/deliveryDetails.type}}<\/ul> <div class=\"trn aino-text-light\">mailboxDeliveryNorway.description<\/div><\/div>";
        var _container;
        var _shippingData;
        var _changeCallback;
        var _firstLoad = true;
        var _defaults;

        var _pickupLoading = false;
        var _isInitialized = false;
        var _requestOnChange = false;
        var _pickupData = {};

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _changeCallback = changeCallback;
            if (defaults) {
                _defaults = defaults.deliveryDetails;
            }

            var updatedData = _updateData(widgetData);
            _shippingData = updatedData;

            var html = Mustache.render(_template, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _initElements();
        }

        function _initElements() {
            // onClick events
            $(_container).find('.deliveryType').on('click', function (ev) {
                ev.preventDefault();
                _updateDeliveryTab($(this));
                _onChange();
            });
        }

        function _updateData(widgetData) {
            var data = widgetData;
            if (!data.deliveryDetails || !data.deliveryDetails.type || data.deliveryDetails.type.length == 0) {
                data.showDefaultMessages = true;
            }

            return data;
        }
        function _show() {
            if (_firstLoad) {
                _firstLoad = false;
                _loadDefaults();
            }
            _onChange();
        }

        function _loadDefaults() {
            var deliveryTab;
            if (_defaults && _defaults.typeId) {
                deliveryTab = $(_container).find('.deliveryType input[data-id="' + _defaults.typeId + '"]').closest('.deliveryType');
            }
            else {
                deliveryTab = $(_container).find('.deliveryType').first();
            }

            _updateDeliveryTab(deliveryTab);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                country: _shippingData.userInfo.userCountryCode,
                addressId: "",
                addressText: "",
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: _getPrice()
            };

            var deliveryInput = $(_container).find('li.aino-active label.deliveryType input');
            var deliveryTypeId = deliveryInput.attr('data-id');
            deliveryData.typeId = deliveryTypeId;
            deliveryData.typeText = ainoLangSvc.TranslateKey(deliveryInput.val());

            deliveryData.addressId = _pickupData.servicePointId;
            deliveryData.addressText = _pickupData.address;
            deliveryData.name = _pickupData.name;
            deliveryData.city = _pickupData.city;
            deliveryData.postcode = _pickupData.post_code;

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _onChange() {
            if (_changeCallback) {
                var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
                _changeCallback();
            }
        }

        function _getPrice() {
            var deliveryTypeId = $(_container).find('li.aino-active label.deliveryType input').attr('data-id');
            var price = parseFloat(_shippingData.price);
            if (_shippingData.deliveryDetails && _shippingData.deliveryDetails.type) {
                for (var i = 0; i < _shippingData.deliveryDetails.type.length; i++) {
                    if (_shippingData.deliveryDetails.type[i].id == deliveryTypeId && _shippingData.deliveryDetails.type[i].addedPrice) {
                        price = price + parseFloat(_shippingData.deliveryDetails.type[i].addedPrice);
                        break;
                    }
                }
            }

            return price.toFixed(2);
        }

        function _updateDeliveryTab(el) {
            $(el).closest('ul').children('li').removeClass('aino-active');
            $(el).closest('ul').find('.delivery-type-input').removeAttr('checked').prop('checked', false);

            $(el).parent('li').addClass('aino-active');
            $(el).find('.delivery-type-input').attr('checked', true).prop('checked', true);
        }


        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
        this.RequiresPostcode = false;
    };
})(jQuery, window, document);

; (function ($, window, document, undefined) {
    window.AinoPostOfficeDeliveryInlView = function () {
        var _template = "<div class=aino-collapse> <div><b class=trn>postOfficeDelivery.title<\/b><\/div><div class=\"cf aino-card\"> <div class=aino-card-top> <div class=\"aino-mini-map trn\">postcodePopup.message<\/div><\/div><div class=\"cf aino-card-body\"> <div class=\"aino-chosen-destination aino-media\"> <div class=aino-media-left><span class=aino-marker><\/span><\/div><div class=\"aino-media-body aino-user-choicen-destination\"> <div class=\"aino-destination-name aino-media-heading\"><span class=nearest-point-title><\/span><\/div><div class=aino-destination-info><span class=nearest-point-address><\/span><br><span class=nearest-point-worktime><\/span><\/div><\/div><div class=\"aino-media-right\"> <button type=\"button\" class=\"trn aino-button aino-show-map green\">postOfficeDelivery.changeLocation<\/button> <\/div><\/div><\/div><\/div><\/div>";
        var _templateWithoutMap = "<div class=aino-collapse> <div class=\"no-map\"> <div><b class=trn>postOfficeDelivery.title<\/b> <label class=\"postcode-error trn\">postOfficeMap.searchError<\/label><\/div><div class=\"aino-locations-footer cf\"> <div class=\"aino-search-point\"> <label> <input type=\"text\" class=\"number-field\"> <span> <span class=\"aino-icon-search\"><\/span> <span class=\"trn\">postOfficeMap.postcodeField<\/span> <\/span> <\/label> <button type=\"button\" class=\"trn aino-map-search\">postOfficeMap.searchButton<\/button> <\/div><\/div><div class=\"aino-location-list\"> <ul class=\"aino-nav\"><\/ul> <\/div><div class=\"aino-locations-footer\"> <div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">postOfficeMap.loadMore<\/button> <\/div><\/div><\/div><\/div>";
        var _mapTemplate = "<li data-aino=\"map\"> <label class=\"aino-input aino-radio shipping-method-label cf\"> <button type=\"button\" class=\"aino-backto-shipping trn\">postOfficeMap.backButton<\/button> <span class=\"trn aino-inline\">postOfficeMap.title<\/span> <\/label> <label class=\"postcode-error trn\">postOfficeMap.searchError<\/label> <div class=\"aino-collapse cf\"> <div class=\"aino-map-container\"><\/div><div class=\"aino-location-list\"> <ul class=\"aino-nav\"><\/ul> <\/div><div class=\"aino-locations-footer cf\"> <div class=\"aino-search-point\"> <label> <input type=\"text\" class=\"number-field\"> <span> <span class=\"aino-icon-search\"><\/span> <span class=\"trn\">postOfficeMap.postcodeField<\/span> <\/span> <\/label> <button type=\"button\" class=\"trn aino-map-search\">postOfficeMap.searchButton<\/button> <\/div><div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">postOfficeMap.loadMore<\/button> <\/div><\/div><div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">postOfficeMap.loadMore<\/button> <\/div><\/div><\/li>";
        var _container;
        var _pickupModule;
        var _shippingData;
        var _changeCallback;
        var _userPostcode;
        var _userAddress;
        var _selectedPickupPoint;
        var _enableMap = false;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _shippingData = widgetData;
            _enableMap = widgetData.enableMap;
            _changeCallback = changeCallback;
            _defaults = defaults;
            $(_container).attr('data-aino', 'mini-map');

            var htmlTemplate = _enableMap ? _template : _templateWithoutMap;
            var html = Mustache.render(htmlTemplate, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _init();
        }

        function _init(initCallback) {
            if (!_pickupModule) {
                if (_defaults && _defaults.deliveryDetails && _defaults.shippingId == 'postOfficeDelivery') {
                    _userAddress = _defaults.userStreet ? _defaults.userStreet : "";
                    _userPostcode = _defaults.userPostcode ? _defaults.userPostcode : "";
                    _selectedPickupPoint = _defaults.deliveryDetails.addressId;
                }
                else {
                    _userAddress = _shippingData.userInfo.userStreet;
                    _userPostcode = _shippingData.userInfo.userPostcode;
                }

                if (_userPostcode) {
                    if (_enableMap) {
                        _pickupModule = new AinoPickupModule(
                            _shippingData.userInfo.userCountryCode, _userAddress, _userPostcode,
                            _shippingData.themeFolder, _container, "PostNord", _onChange, _selectedPickupPoint, _mapTemplate, false, initCallback);
                    }
                    else {
                        _pickupModule = new AinoPickupListModule(
                            _shippingData.userInfo.userCountryCode, _userAddress, _userPostcode,
                            _shippingData.themeFolder, _container, "PostNord", _onChange, _selectedPickupPoint, false, initCallback);
                    }

                }
            }

            // click events
            $(_container).find('.aino-show-map').click(function (e) {
                e.preventDefault();
                if (_pickupModule) {
                    _pickupModule.ShowDetails();
                }
            });

            _searchKeydownEvent();
        }

        function _searchKeydownEvent() {
            $(_container).find(".number-field").on("keydown", function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        }

        function _show() {
            if (!_pickupModule) {
                _init(_showPreview);
            }
            else {
                _showPreview();
            }
        }

        function _showPreview() {
            _pickupModule.ShowPreview(_onChange);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                addressId: "",
                addressText: "",
                country: _shippingData.userInfo.userCountryCode,
                city: "",
                postcode: "",
                email: "",
                info: "",
                price: 0
            };

            var pickupData = _pickupModule.GetData();
            deliveryData.typeId = "pickuppostoffice";
            deliveryData.typeText = "Pickup in post office";
            deliveryData.addressId = pickupData.servicePointId;
            deliveryData.addressText = pickupData.address;
            deliveryData.name = pickupData.name;
            deliveryData.city = pickupData.city;
            deliveryData.postcode = pickupData.postcode;
            deliveryData.price = _getPrice();
            deliveryData.userPostcode = pickupData.userPostcode;
            deliveryData.userAddress = pickupData.userAddress;

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }


        function _getPrice() {
            var price = _shippingData.price;
            return parseFloat(price).toFixed(2);
        }

        function _onChange() {
            if (_changeCallback) {
                _changeCallback();
            }
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
        this.RequiresPostcode = true;
    };
})(jQuery, window, document);

; (function ($, window, document, undefined) {
    window.AinoShopDeliveryInlView = function () {
        var _template = "<div class=aino-collapse> <div><b class=trn>shopDelivery.title<\/b><\/div><div class=\"cf aino-card\"> <div class=aino-card-top> <div class=\"aino-mini-map trn\">postcodePopup.message<\/div><\/div><div class=\"cf aino-card-body\"> <div class=\"aino-chosen-destination aino-media\"> <div class=aino-media-left><span class=aino-marker><\/span><\/div><div class=\"aino-media-body aino-user-choicen-destination\"> <div class=\"aino-destination-name aino-media-heading\"><span class=nearest-point-title><\/span><\/div><div class=aino-destination-info><span class=nearest-point-address><\/span><br><span class=nearest-point-worktime><\/span><\/div><\/div><div class=\"aino-media-right\"> <button type=\"button\" class=\"trn aino-button aino-show-shop-map green\">shopDelivery.changeLocation<\/button> <\/div><\/div><\/div><\/div><\/div>";
        var _templateWithoutMap = "<div class=aino-collapse> <div class=\"no-map\"> <div><b class=trn>postOfficeDelivery.title<\/b> <label class=\"postcode-error trn\">postOfficeMap.searchError<\/label><\/div><div class=\"aino-locations-footer cf\"> <div class=\"aino-search-point\"> <label> <input type=\"text\" class=\"number-field\"> <span> <span class=\"aino-icon-search\"><\/span> <span class=\"trn\">postOfficeMap.postcodeField<\/span> <\/span> <\/label> <button type=\"button\" class=\"trn aino-map-search\">postOfficeMap.searchButton<\/button> <\/div><\/div><div class=\"aino-location-list\"> <ul class=\"aino-nav\"><\/ul> <\/div><div class=\"aino-locations-footer\"> <div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">postOfficeMap.loadMore<\/button> <\/div><\/div><\/div><\/div>";
        var _mapTemplate = "<li data-aino=\"map\"> <label class=\"aino-input aino-radio shipping-method-label cf\"> <button type=\"button\" class=\"aino-backto-shipping trn\">shopMap.backButton<\/button> <span class=\"trn aino-inline\">shopMap.title<\/span> <\/label> <label class=\"postcode-error trn\">shopMap.searchError<\/label> <div class=\"aino-collapse cf\"> <div class=\"aino-map-container\"><\/div><div class=\"aino-location-list\"> <ul class=\"aino-nav\"><\/ul> <\/div><div class=\"aino-locations-footer cf\"> <div class=\"aino-search-point\"> <label> <input type=\"text\" class=\"number-field\"> <span> <span class=\"aino-icon-search\"><\/span> <span class=\"trn\">shopMap.postcodeField<\/span> <\/span> <\/label> <button type=\"button\" class=\"trn aino-map-search\">shopMap.searchButton<\/button> <\/div><div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">shopMap.loadMore<\/button> <\/div><\/div><div class=\"aino-loadmore-locations\"> <button type=\"button\" class=\"load-more-locations trn\">shopMap.loadMore<\/button> <\/div><\/div><\/li>";
        var _container;
        var _pickupModule;
        var _shippingData;
        var _changeCallback;
        var _userAddress;
        var _userPostcode;
        var _selectedPickupPoint;
        var _enableMap = false;
        var _defaults;

        function _create(widgetData, container, changeCallback, defaults) {
            _container = container;
            _shippingData = widgetData;
            _changeCallback = changeCallback;
            _defaults = defaults;
            _enableMap = widgetData.enableMap;

            $(_container).attr('data-aino', 'shop-mini-map');

            var htmlTemplate = _enableMap ? _template : _templateWithoutMap;
            var html = Mustache.render(htmlTemplate, widgetData);
            var element = $(_container).append(html);

            if (ainoLangSvc) {
                ainoLangSvc.Translate(element);
            }

            _init();
        }

        function _init(initCallback) {
            if (!_pickupModule) {
                if (_defaults && _defaults.deliveryDetails && _defaults.shippingId == 'shopDelivery') {
                    _userAddress = _defaults.userStreet;
                    _userPostcode = _defaults.userPostcode;
                    _selectedPickupPoint = _defaults.deliveryDetails.addressId;
                }
                else {
                    _userAddress = _shippingData.userInfo.userStreet;
                    _userPostcode = _shippingData.userInfo.userPostcode;
                }

                if (_userPostcode) {
                    if (_enableMap) {
                        _pickupModule = new AinoPickupModule(
                            _shippingData.userInfo.userCountryCode, _userAddress, _userPostcode,
                            _shippingData.themeFolder, _container, "shopDelivery", _onChange, _selectedPickupPoint, _mapTemplate, true, initCallback);
                    }
                    else {
                        _pickupModule = new AinoPickupListModule(
                            _shippingData.userInfo.userCountryCode, _userAddress, _userPostcode,
                            _shippingData.themeFolder, _container, "shopDelivery", _onChange, _selectedPickupPoint, true, initCallback);
                    }

                }
            }

            // click events
            $(_container).find('.aino-show-shop-map').click(function (e) {
                e.preventDefault();
                if (_pickupModule) {
                    _pickupModule.ShowDetails();
                }
            });
        }

        function _show() {
            if (!_pickupModule) {
                _init(_showMiniMap);
            }
            else {
                _showMiniMap();
            }
        }

        function _showMiniMap() {
            _pickupModule.ShowPreview(_onChange);
        }

        function _getData() {
            var deliveryData = {
                typeId: "",
                typeText: "",
                name: "",
                country: _shippingData.userInfo.userCountryCode,
                addressId: "",
                addressText: "",
                city: "",
                postcode: "",
                email: "",
                info: "",
                price : 0
            };

            var pickupData = _pickupModule.GetData();
            deliveryData.typeId = "pickupshop";
            deliveryData.typeText = "Pickup shop";
            deliveryData.addressId = pickupData.servicePointId;
            deliveryData.addressText = pickupData.address;
            deliveryData.name = pickupData.name;
            deliveryData.city = pickupData.city;
            deliveryData.postcode = pickupData.postcode;
            deliveryData.price = _getPrice();
            deliveryData.userAddress = pickupData.userAddress;
            deliveryData.userPostcode = pickupData.userPostcode;

            return deliveryData;
        }

        function _loadSelection() {

        }

        function _saveSelection() {

        }

        function _getContainer() {
            return _container;
        }

        function _getPrice() {
            var price = _shippingData.price;
            return parseFloat(price).toFixed(2);
        }

        function _onChange() {
            if (_changeCallback) {
                _changeCallback();
            }
        }

        this.Create = _create;
        this.Show = _show;
        this.GetData = _getData;
        this.GetPrice = _getPrice;
        this.SaveSelection = _saveSelection;
        this.RequiresPostcode = true;
    };
})(jQuery, window, document);