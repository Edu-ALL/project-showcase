/**
 * Create new card element to display into end user
 */
let base_url = "https://migrate.all-inedu.com"

function newCard(data) {
    const new_element = document.createElement("div");
    new_element.classList.add("swiper-slide");
    new_element.id = "card_content";
    new_element.innerHTML = `
    <div class="swiper-slide">
    <div class="project_card w-full h-[250px]">
        <div class="front w-full">
            <div
                class="relative flex flex-col rounded-[20px] overflow-hidden"
            >
                <img
                    src="${base_url}/uploaded_files/project-showcase/2023/03/${data.thumbnail
        }"
                    alt="${data.alt}"
                    class="object-cover object-center w-full h-[250px]"
                />
                <h4
                    class="absolute left-4 right-4 bottom-4 font-primary font-extrabold text-2xl text-primary md:text-4xl"
                >
                    ${data.project_name}
                </h4>
            </div>
        </div>
        <div class="back w-full">
            <div
                class="relative flex flex-col rounded-[20px] overflow-hidden"
            >
                <img
                src="${base_url}/uploaded_files/project-showcase/2023/03/${data.gallery[0]
        }"
                alt="${data.name} image"
                    class="object-cover object-center w-full h-[250px]"
                />
                <div
                    class="absolute left-4 right-4 bottom-4 flex flex-col"
                >
                    <h5
                        class="font-primary font-medium text-base text-yellow"
                    >
                        Patricia Widjaja
                    </h5>
                    <div
                        class="font-primary font-normal text-base text-white leading-4"
                    >
                        ${data.description.substring(0, 100)}...
                    </div>
                    <button
                        id="open_modal"
                        type="button"
                        class="self-start block mt-3 px-5 py-2 font-primary font-medium text-base text-white rounded-full bg-yellow"
                    >
                        Read More
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;
    return new_element;
}

/**
 * Create new image carousel
 */
function newModalCarousel(image) {
    const new_carousel = document.createElement("div");
    new_carousel.classList.add("swiper-slide");
    new_carousel.innerHTML = `
    <img
        src="${base_url}/uploaded_files/project-showcase/2023/03/${image}"
        class="w-full h-[40vh] md:h-[55vh] object-cover object-center"
    />`;
    return new_carousel;
}

/**
 * Get new project from api base on category
 */
async function getProject(end_point_category) {
    const url = `${base_url}/api/project-showcase/${end_point_category}`;
    let response;

    try {
        response = await axios.get(url);
    } catch (error) {
        response = error;
    }
    console.log(response.data);
    return response;
}

/**
 * Build pop up from every exiting data
 */
function buildModal(data_cards) {
    // Modal
    const modal_elment = document.querySelector(".modal");
    const modal_container = document.querySelector("#modal_container");
    const close_modals = document.querySelectorAll("#close_modal");
    const open_modals = document.querySelectorAll("#open_modal");

    // Modal Content
    const modal_content_project_name = document.querySelector(
        "#modal_content_project_name"
    );
    const modal_content_name = document.querySelector("#modal_content_name");
    const modal_content_description = document.querySelector(
        "#modal_content_description"
    );
    const modal_content_gallery = document.querySelector(
        "#modal_content_gallery"
    );

    let curr_pointer = total_project - data_cards.length;

    data_cards.forEach((data, it) => {
        open_modals[it + curr_pointer].addEventListener("click", () => {
            // change modal content project name value to data.project_name
            modal_content_project_name.innerHTML = data.project_name;

            // change modal content name value to data.name
            modal_content_name.innerHTML = data.name;

            // change modal content name.description value to data.name.description
            modal_content_description.innerHTML = data.description;

            // add image carousel to content galery
            // remove all image frist
            modal_content_gallery.innerHTML = "";
            // add any existing images
            data.gallery.forEach((image) => {
                modal_content_gallery.appendChild(newModalCarousel(image));
            });

            // show the modal
            modal_elment.classList.toggle("hidden");
        });
    });

    close_modals.forEach((modal_btn, it) => {
        modal_btn.addEventListener("click", () => {
            modal_elment.classList.toggle("hidden");
        });
    });

    modal_backdrop.addEventListener("click", () => {
        modal_elment.classList.toggle("hidden");
    });

    modal_container.addEventListener("click", () => {
        modal_elment.classList.toggle("hidden");
    });
}

/**
 * Generate new project cards base on category
 */
function generateProjectCards(category, end_point_category, parent_element) {
    const data_cards = [];
    const response = getProject(end_point_category);
    response
        .then((response) => {
            // repeat every existing response and it add into data_card
            response.data.forEach((data) => {
                const new_data = {
                    project_name: data.project_name,
                    name: data.name,
                    thumbnail: data.thumbnail,
                    alt: data.alt,
                    gallery: data.gallery
                        .replace('["', "")
                        .replace('"]', "")
                        .split('","'),
                    description: data.description,
                };

                // add new data to data card
                data_cards.push(new_data);

                // increase total_project variable
                total_project += 1;
            });

            data_cards.forEach((data_card) => {
                // show card to end user with existing data using newCard function
                parent_element.appendChild(newCard(data_card));
            });

            // call build modal to build a card
            buildModal(data_cards);

        })
        .catch((err) => {
            console.dir(err);
        });

    new Swiper(`.${category}`, {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            620: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        },
    });
}

let total_project = 0;

// call generate for business
const buniness_element = document.querySelector(".business_swiper_wrapper");
generateProjectCards("business", "business", buniness_element);

// call generate for scince
const science_tech_element = document.querySelector(
    ".science_tech_swiper_wrapper"
);
generateProjectCards("science_tech", "science & tech", science_tech_element);

// call generate for art
const art_element = document.querySelector(".art_swiper_wrapper");
generateProjectCards("art", "art", art_element);

// call generate for social
const social_element = document.querySelector(".social_swiper_wrapper");
generateProjectCards("social", "social", social_element);

// call generate for health
const health_tech_element = document.querySelector(".health_swiper_wrapper");
generateProjectCards("health", "health", health_tech_element);

// Swiper JS
new Swiper(".popUpSwiper", {
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
    },
});
