const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const arrowBtns = document.querySelectorAll(".icon");
//To get the width of the card
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
//Making array of carousel children, which are LI elements
const carouselChildren = [...carousel.children];

let isDragging = false,
  startX,
  startScrollLeft,
  timeoutId;

//Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

//Insert copies of the last few cards to beginning of carousel for inifinite scrolling
carouselChildren
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

//Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildren.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

//Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
});

//To check if its dragging or not
const dragStart = (e) => {
  isDragging = true;

  //Remove the select from text
  carousel.classList.add("dragging");

  //Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  // if isDragging is false return from here
  if (!isDragging) return;

  // e.pageX returns the horizontal coordinate of mouse pointer
  // scrollLeft sets or returns the number of pixels an element's content is scrolled horizontally
  //Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

// To set auto play (We will not set autoplay on mobile)
const autoPlay = () => {
  //Return if window is smaller than 800px
  if (window.innerWidth < 800) return;

  //Autoplay the carousel every 2500ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};

autoPlay();

//To process the infinite scrolling
// scrollLeft sets or returns the number of pixel an element's content is scrolled horizontally
// scrollWidth returns the width of the element's content including content not visible on screen due to overflow
// offsetWidth returns the viewable width of an element
//carousel.scrollLeft is giving the floating number, so we need to round up in order to make this condition true
const infiniteScroll = () => {
  // If carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll from the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  //Clear existing timeout and start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mousedown", dragStart);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);

//To continue autoplay when leaving the wrapper
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
