const scrollContainer = document.querySelector(".filters-wrapper");
const scrollLeft = document.querySelector(".scroll-left");
const scrollRight = document.querySelector(".scroll-right");

scrollLeft.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
});

scrollRight.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
});

