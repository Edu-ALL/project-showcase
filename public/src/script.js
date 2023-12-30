let base_url = "https://all-inedu.com";
let response_list = [];

/**
 * Create new card element to display into end user
 */
function newCard(data) {
  const ready_data = JSON.stringify(data);
  const new_element = document.createElement("div");
  new_element.id = "open_modal";
  new_element.classList.add("card_content");
  new_element.setAttribute("data-card", ready_data);
  //   <img src="${base_url}/uploaded_files/project-showcase/2023/03/${data.gallery[0]}" alt="${data.alt}" />
  new_element.innerHTML = `
<div class="relative cursor-pointer">
<img src="assets/images/temp/temp1.webp" alt="project temp 1" />
  <h2 class="absolute left-4 bottom-2 font-primary text-white text-4xl font-black uppercase">
    ${data.project_name}
  </h2>
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
        class="w-full h-[40vh] md:h-[65vh] object-cover object-center"
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
  return response;
}

/**
 * Build pop up from every exiting data
 */
function buildModal() {
  // Modal
  const modal_element = document.querySelector(".modal");
  const modal_container = document.querySelector("#modal_container");
  const cards = document.querySelectorAll(".card_content");
  const close_modals = document.querySelectorAll("#close_modal");
  const open_modals = document.querySelectorAll("#open_modal");

  // Modal Content
  const modal_content_project_name = document.querySelector("#modal_content_project_name");
  const modal_content_name = document.querySelector("#modal_content_name");
  const modal_content_description = document.querySelector("#modal_content_description");
  const modal_content_gallery = document.querySelector("#modal_content_gallery");

  open_modals.forEach((modal_btn, it) => {
    modal_btn.addEventListener("click", () => {
      // parse data from atribute
      let passing_data = JSON.parse(cards[it].getAttribute("data-card"));

      console.log(passing_data)

      // change modal content project name value
      modal_content_project_name.innerHTML = passing_data.project_name;

      // change modal content name value to
      modal_content_name.innerHTML = passing_data.name;

      // change modal content name.description value
      modal_content_description.innerHTML = passing_data.description;

      // add image carousel to content galery
      // remove all image frist
      modal_content_gallery.innerHTML = "";
      // add any existing images
      passing_data.gallery.forEach((image) => {
        modal_content_gallery.appendChild(newModalCarousel(image));
      });

      // show the modal
      modal_element.classList.toggle("hidden");
    });
  });

  close_modals.forEach((modal_btn, it) => {
    modal_btn.addEventListener("click", () => {
      modal_element.classList.toggle("hidden");
    });
  });

  modal_backdrop.addEventListener("click", () => {
    modal_element.classList.toggle("hidden");
  });

  modal_container.addEventListener("click", () => {
    modal_element.classList.toggle("hidden");
  });
}

async function runAsyncFunctions() {
  await Promise.all(response_list);
  buildModal();
}

/**
 * Generate new project cards base on category
 */
function generateProjectCards(category, end_point_category, parent_element) {
  const data_cards = [];
  const response = getProject(end_point_category);
  response_list.push(response);
  const category_id = {
    Business: 0,
    "Science & Tech": 1,
    Art: 2,
    Social: 3,
    Health: 4,
  };
  response
    .then((response) => {
      // repeat every existing response and it add into data_card
      response.data.forEach((data) => {
        const new_data = {
          category_id: category_id[data.category],
          category: data.category,
          project_name: data.project_name,
          name: data.name,
          thumbnail: data.thumbnail,
          alt: data.alt,
          gallery: data.gallery.replace('["', "").replace('"]', "").split('","'),
          description: data.description,
        };

        // add new data to data card
        data_cards.push(new_data);
      });

    //   if (data_cards.length <= 0) {
    //     const zero_video = document.querySelector(`.${category}`);
    //     zero_video.classList.add("hidden");
    //   }
      data_cards.forEach((data_card) => {
        // show card to end user with existing data using newCard function
        parent_element.appendChild(newCard(data_card));
      });
    })
    .catch((err) => {
      console.dir(err);
    });
}

// call generate for business
const buniness_header = document.querySelector("#business .category__header");
const buniness_content = document.querySelector("#business .category__content");
generateProjectCards("business", "business", buniness_content);
buniness_header.addEventListener("click", () => {
  activeCategory.classList.remove("category_content__active");
  activeCategory = buniness_content;
  buniness_content.classList.add("category_content__active");
});

// call generate for business
const science_tech_header = document.querySelector("#science-tech .category__header");
const science_tech_content = document.querySelector("#science-tech .category__content");
generateProjectCards("science_tech", "science & tech", science_tech_content);
science_tech_header.addEventListener("click", () => {
  activeCategory.classList.remove("category_content__active");
  activeCategory = science_tech_content;
  science_tech_content.classList.add("category_content__active");
});

// call generate for business
const art_header = document.querySelector("#art .category__header");
const art_content = document.querySelector("#art .category__content");
generateProjectCards("art", "art", art_content);
art_header.addEventListener("click", () => {
  activeCategory.classList.remove("category_content__active");
  activeCategory = art_content;
  art_content.classList.add("category_content__active");
});

// call generate for business
const social_header = document.querySelector("#social .category__header");
const social_content = document.querySelector("#social .category__content");
generateProjectCards("social", "social", social_content);
social_header.addEventListener("click", () => {
  activeCategory.classList.remove("category_content__active");
  activeCategory = social_content;
  social_content.classList.add("category_content__active");
});

// call generate for business
const health_header = document.querySelector("#health .category__header");
const health_content = document.querySelector("#health .category__content");
generateProjectCards("health", "health", health_content);
health_header.addEventListener("click", () => {
  activeCategory.classList.remove("category_content__active");
  activeCategory = health_content;
  health_content.classList.add("category_content__active");
});

let activeCategory = science_tech_content;

// // call generate for scince
// const science_tech_element = document.querySelector(".science_tech_swiper_wrapper");

// // call generate for art
// const art_element = document.querySelector(".art_swiper_wrapper");
// generateProjectCards("art", "art", art_element);

// // call generate for social
// const social_element = document.querySelector(".social_swiper_wrapper");
// generateProjectCards("social", "social", social_element);

// // call generate for health
// const health_tech_element = document.querySelector(".health_swiper_wrapper");
// generateProjectCards("health", "health", health_tech_element);

// run async function when all data has been fetch
runAsyncFunctions();

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
