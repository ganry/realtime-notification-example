'use strict';

angular.module('noteApp.inNote', [])
.factory('inNoteFactory', function($rootScope, socketFactory) {
    var docElem = window.document.documentElement,
    support = { animations : Modernizr.cssanimations },
    animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
    },
    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

    /**
     * extend obj function
     */
    function extend( a, b ) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * InNote function
     */
    function InNote( options ) {
        this.options = extend( {}, this.options );
        extend( this.options, options );
    }

    /**
     * InNote options
     */
    InNote.prototype.options = {
        // element to which the notification will be appended
        // defaults to the document.body
        wrapper : $('body'),
        // the message
        message : '',
        // layout type: growl|attached|bar|other
        layout : 'growl',
        // effects for the specified layout:
        // for growl layout: scale|slide|genie|jelly
        // ...
        effect : 'slide',
        // notice, warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type : 'error',
        // if the user doesn´t close the notification then we remove it
        // after the following time
        ttl : 3000,
        // callbacks
        onClose : function() { return false; },
        onOpen : function() { return false; }
    };

    /**
     * init function
     * initialize and cache some vars
     */
    InNote.prototype._init = function() {
        // create HTML structure
        var lastNotification = $('.ns-box').last();
        var top = lastNotification.length > 0 ? lastNotification.offset().top+lastNotification.outerHeight()+10 : 30;

        this.ntf = $('<div>');
        this.ntf.css('top', top);
        this.ntf.addClass('ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type);
        var strinner = '<div class="ns-box-inner">';
        strinner += this.options.message;
        strinner += '</div>';
        strinner += '<span class="ns-close"></span></div>';
        this.ntf.html(strinner);

        // append to body or the element specified in options.wrapper
        this.options.wrapper.append( this.ntf );

        // dismiss after [options.ttl]ms
        var self = this;

        if(this.options.ttl) { // checks to make sure ttl is not set to false in notification initialization
            setTimeout( function() {
                    self.dismiss();
            }, this.options.ttl );
        }

        // init events
        this._initEvents();
    };

    /**
     * init events
     */
    InNote.prototype._initEvents = function() {
        var self = this;
        // dismiss notification
        this.ntf.find( '.ns-close' ).on( 'click', function() {
            self.dismiss($(this).parent('.ns-box'));
        } );
    };

    /**
     * Register for listening to custom event Type
     * @param eventType Custom Event Type Clients listen to
     * @param messageType One of the following notice, warning, error, success
     */
    InNote.prototype.registerForMessage = function(eventType, messageType) {
        var self = this;

        socketFactory.on(eventType, function(data) {
            self.show(data, messageType);
        });
    };

    /**
     * Send Message to all Clients
     * @param message Message to send to clients
     * @param eventType Custom Event Type Clients listen to
     */
    InNote.prototype.sendMessageToAllClients = function(message, eventType) {
        socketFactory.emit(eventType, message);
    };

    /**
     * Show Notification
     * @param message Message to show
     * @param messageType One of the following notice, warning, error, success
     */
    InNote.prototype.show = function(message, messageType) {
        this.options.message = message;
        this.options.type = messageType;
        this._init();

        this.active = true;

        this.ntf.removeClass('ns-hide' );
        this.ntf.addClass('ns-show' );
        if (typeof this.options.onOpen === 'function')
            this.options.onOpen();
    };

    /**
     * dismiss the notification
     * @param notification notification Element you want to dismiss
     */
    InNote.prototype.dismiss = function(notification) {

        if (typeof notification === 'undefined')
            notification = $('.ns-box.ns-show').first();

        if (notification.length == 0)
            return;

        var self = this;
        this.active = false;
        notification.removeClass('ns-show');
        setTimeout( function() {
            notification.addClass('ns-hide');

            // callback
            if (typeof self.options.onClose === 'function')
                self.options.onClose();
        }, 25 );

        // after animation ends remove ntf from the DOM
        var onEndAnimationFn = function( ev ) {
            if( support.animations ) {
                notification.off( animEndEventName, onEndAnimationFn );
            }
            notification.remove();
        };

        if( support.animations ) {
            notification.on( animEndEventName, onEndAnimationFn );
        }
        else {
            onEndAnimationFn();
        }
    };

        return InNote;

});