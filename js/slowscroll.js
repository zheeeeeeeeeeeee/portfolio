$.fn.moveIt = function(){
    var $window = $(window);
    var instances = [];
    
    $(this).each(function(){
      var instance = new moveItItem($(this));
      instances.push(instance);
      // Force position: fixed on initialization
      instance.el.css('position', 'fixed');
    });
    
    window.addEventListener('scroll', function(){
      var scrollTop = $window.scrollTop();
      instances.forEach(function(inst){
        inst.update(scrollTop);
      });
    }, {passive: true});
}

var moveItItem = function(el){
    this.el = $(el);
    this.updateSpeed(); // Set initial speed
    // Ensure initial position is fixed
    this.el.css('position', 'fixed');
};

moveItItem.prototype.updateSpeed = function() {
    var rootStyles = getComputedStyle(document.documentElement);
    this.speed = parseFloat(rootStyles.getPropertyValue('--scroll-speed')) || 1; // Use CSS variable
};

moveItItem.prototype.update = function(scrollTop){
    var transformY = -(scrollTop / this.speed); 
    this.el.css({
      'transform': 'translateY(' + transformY + 'px)', 
      'position': 'fixed', // Force position to fixed
      'top': '' // Ensure top remains unaffected
    });
};

// Initialization
$(function(){
    $('[data-scroll-speed]').moveIt();
});
