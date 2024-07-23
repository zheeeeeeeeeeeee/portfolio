const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);
  
      // Check if animation is already running
      if (node.classList.contains(`${prefix}animated`) && node.classList.contains(animationName)) {
        return resolve('Animation already running');
      }
  
      node.classList.add(`${prefix}animated`, animationName);
  
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });
  
  const targetElement = '.animated-hover';
  let isAnimating = false;
  
  const element = document.querySelector(targetElement);
  
  element.addEventListener('mouseover', () => {
    if (!isAnimating) {
      isAnimating = true;
      animateCSS(targetElement, 'tada').then(() => {
        isAnimating = false;
      });
    }
  });
  