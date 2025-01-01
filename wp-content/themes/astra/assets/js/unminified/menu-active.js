document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".menu-link");
    const currentHash = window.location.hash; // Get the current URL fragment (e.g., #projets)

    links.forEach((link) => {
        // Remove 'active' class from all links
        link.classList.remove("active");

        // Add 'active' class if the link's href matches the current hash
        if (link.getAttribute("href").includes(currentHash)) {
            link.classList.add("active");
        }
    });

    // Optional: Handle clicks to update the active class immediately
    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
});
