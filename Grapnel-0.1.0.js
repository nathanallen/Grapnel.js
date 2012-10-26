
/***
 * @package Grapnel.js
 * A lightweight JavaScript library for adding action hooks in URL hashtags/anchors.
 * https://github.com/gregsabia/Grapnel-js 
 * 
 * @author Greg Sabia
 * @support http://gregsabia.com
 * 
 * Event listeners: ['anchor_change', 'hook_found']
*/

var Grapnel = function(hook){
    var self = this;
    // Anchoring
    this.anchor = false;
    // Hook (default: ":")
    this.hook = hook || ':';
    // Value (default: false)
    this.value = false;
    // Actions
    this.actions = [];
    // Listeners
    this.listeners = [];
    // Add Listener
    this.addListener = function(event, handler){
        this.listeners.push({ event : event, handler : handler });
    }
    // Fire a listener
    this._trigger = function(event, data){
        for(i in this.listeners){
            if(this.listeners[i].event == event){
                this.listeners[i].handler.call(this, data);
            }
        }
    }
    // Get anchor
    this.getAnchor = function(){
        var url_anchor = document.location.toString();
        if(url_anchor.match('#')){
            return this.anchor = url_anchor.split('#')[1];
        }else{
            return false;
        }
    }
    // Change anchor
    this.setAnchor = function(anchor){
        var url_anchor = document.location.toString();
        var anchor = anchor || '!';
        // Append anchor to location
        document.location = url_anchor.split('#')[0] + '#' + anchor;
        // Fire event
        this._trigger('anchor_change', anchor);
    }
    // Reset anchor
    this.clearAnchor = function(){
        return this.setAnchor(false);
    }
    // Parse hook
    this.parseHook = function(a){
        var a = a || this.anchor;

        if(this.anchor && a.match(this.hook)){
            this.value = a.split(this.hook)[1];
            this.anchor = a.split(this.hook)[0];
            // Fire event
            this._trigger('hook_found', [this.value, this.anchor]);

            return this.anchor;
        }else{
            return a;
        }
    }
    // New actions
    this.add = function(action, handler){
        this.actions.push({ action : action, handler : handler });
        return this.run();
    }
    // Initialize
    this.getAnchor();
    this.parseHook();
    // Run hook action
    this.run = function(){
        // We've matched an anchor action
        for(i in this.actions){
            if(this.actions[i].action == this.anchor) this.actions[i].handler.call(this, this.value);
        }

        return this;
    }
    // Hash change event
    window.onhashchange = function(){
        self.getAnchor();
        self.parseHook();
        self.run();
    }

    return this;
}
