'use strict';


angular.module('noteApp.inNote', []).
    factory('inNoteFactory', function($rootScope, socketFactory) {
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
        // for attached layout: flip|bouncyflip
        // for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
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
        this.ntf = $('<div>');//document.createElement( 'div' );
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
            this.dismissttl = setTimeout( function() {
                if( self.active ) {
                    self.dismiss();
                }
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
        this.ntf.find( '.ns-close' ).on( 'click', function() { self.dismiss(); } );
    };

    InNote.prototype.registerForMessage = function(messageType) {
        var self = this;

        socketFactory.on(messageType, function(data) {
            self.show(data, messageType);
        });
    };

    InNote.prototype.sendMessageToAllClients = function(message, messageType) {
        socketFactory.emit(messageType, message);
    };

    /**
     * show the notification
     */
    InNote.prototype.show = function(message, type) {
        this.options.message = message;
        this.options.type = type;
        this._init();

        this.active = true;

        this.ntf.removeClass('ns-hide' );
        this.ntf.addClass('ns-show' );
        if (typeof this.options.onOpen === 'function')
            this.options.onOpen();
    };

    /**
     * dismiss the notification
     */
    InNote.prototype.dismiss = function() {

        var self = this;
        this.active = false;
        clearTimeout( this.dismissttl );
        this.ntf.removeClass('ns-show');
        setTimeout( function() {
            self.ntf.addClass('ns-hide');

            // callback
            if (typeof self.options.onClose === 'function')
                self.options.onClose();
        }, 25 );

        // after animation ends remove ntf from the DOM
        var onEndAnimationFn = function( ev ) {
            if( support.animations ) {
                //if( ev.target !== self.ntf ) return false;
                self.ntf.off( animEndEventName, onEndAnimationFn );
            }
            self.ntf.remove();
            //self.options.wrapper.remove( self.ntf );
        };

        if( support.animations ) {
            this.ntf.on( animEndEventName, onEndAnimationFn );
        }
        else {
            onEndAnimationFn();
        }
    };

        return InNote;

});