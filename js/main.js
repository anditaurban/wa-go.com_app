document.addEventListener('DOMContentLoaded', (event) => {
    const navbar = document.getElementById('navbar');
    const navbarSpacer = document.getElementById('navbar-spacer');
    let lastScrollTop = 0;
    const navbarHeight = navbar.offsetHeight;
    const scrollThreshold = 200;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            navbar.style.transform = `translateY(-${navbarHeight}px)`;
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    navbarSpacer.style.height = `${navbarHeight}px`;

    // Load testimonials
    fetch('./json/dummy-testimoni.json')
        .then(response => response.json())
        .then(data => {
            const testimonialContainer = document.querySelector("#testimony .overflow-x-auto .flex");
            testimonialContainer.innerHTML = '';

            // Randomly select 3 testimonials from the data
            const selectedTestimonials = data.sort(() => 0.5 - Math.random()).slice(0, 3);

            selectedTestimonials.forEach(testimonial => {
                testimonialContainer.innerHTML += `
                    <div class="flex-shrink-0 w-full sm:w-96 p-4 flex items-start gap-4 rounded-lg border-2 border-gray-300 bg-white">
                        <div class="flex flex-col">
                            <p class="text-lg italic">${testimonial.text}</p>
                            <p class="mt-2 text-sm font-semibold">- ${testimonial.name}</p>
                            <p class="text-sm text-gray-500">${testimonial.position}</p>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error loading testimonials:', error));
});

// Sidebar toggle logic (same as previously implemented)
document.addEventListener('DOMContentLoaded', (event) => {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeSidebarButton = document.getElementById('close-sidebar');

    mobileMenuButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.add('hidden');
    });
});


async function loadSection(sectionPath) {
    try {
      const response = await fetch(sectionPath);
      if (response.ok) {
        const content = await response.text();
        return content;
      } else {
        throw new Error(`Failed to load ${sectionPath}`);
      }
    } catch (error) {
      console.error(error);
      return `<div>Error loading ${sectionPath}</div>`;
    }
  }
