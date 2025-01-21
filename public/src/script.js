let base_url = "https://edu-all.com";
let s3_url = "https://s3-eduall.s3.ap-southeast-3.amazonaws.com/project/eduall-website"
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
  // <img src="assets/images/temp/temp1.webp" alt="${data.alt}" />
  new_element.innerHTML = `
  <div class="relative cursor-pointer h-28 md:h-40">
  <div class="w-full h-full absolute inset-0 mix-blend-multiply bg-[#120FFD33]"></div>
  <img src="${s3_url}/project-showcase/2023/03/${data.gallery[0]}" alt="${data.alt}" class="w-full h-full object-cover object-center" />
  <h2 class="absolute left-4 bottom-2 font-primary text-white md:text-4xl text-2xl font-black uppercase">
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
  // TODO: change the image date
  new_carousel.innerHTML = `
    <img
      src="${s3_url}/project-showcase/2023/03/${image}"
      class="w-full h-full object-cover object-center"
    />
  `;
  // class="w-full h-[40vh] md:h-[65vh] object-cover object-center"
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

  console.log(open_modals);

  // Modal Content
  const modal_content_project_name = document.querySelector("#modal_content_project_name");
  const modal_content_name = document.querySelector("#modal_content_name");
  const modal_content_description = document.querySelector("#modal_content_description");
  const modal_content_gallery = document.querySelector("#modal_content_gallery");

  open_modals.forEach((modal_btn, it) => {
    modal_btn.addEventListener("click", () => {
      console.log("masuk");
      // parse data from atribute
      let passing_data = JSON.parse(cards[it].getAttribute("data-card"));

      console.log(passing_data);

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
function generateProjectCards(end_point_category, parent_element) {
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

      // if (data_cards.length <= 0) {
      //   const zero_video = document.querySelector(`.${category}`);
      //   zero_video.classList.add("hidden");
      // }
      data_cards.forEach((data_card) => {
        // show card to end user with existing data using newCard function
        parent_element.appendChild(newCard(data_card));
      });
    })
    .catch((err) => {
      console.dir(err);
    });

  // new Swiper(`.${category}`, {
  //   slidesPerView: 1,
  //   spaceBetween: 10,
  //   pagination: {
  //     el: ".swiper-pagination",
  //     clickable: true,
  //   },
  //   breakpoints: {
  //     620: {
  //       slidesPerView: 2,
  //       spaceBetween: 20,
  //     },
  //     1024: {
  //       slidesPerView: 3,
  //       spaceBetween: 40,
  //     },
  //   },
  // });
}

const categoryList = {
  business: "business",
  science_tech: "science & tech",
  art: "art",
  social: "social",
  health: "health",
};

const categoryKeys = {
  business,
  science_tech,
  art,
  social,
  health,
};

let categoryElements = {};

for (const categoryKey in categoryKeys) {
  categoryElements[categoryKey] = {
    category_wrapper: document.querySelector(`#${categoryKey}`),
    category_header: document.querySelector(`#${categoryKey} .category__header`),
    category_content: document.querySelector(`#${categoryKey} .category__content`),
    category_arrow: document.querySelector(`#${categoryKey} .arrow`),
  };
  generateProjectCards(categoryList[categoryKey], categoryElements[categoryKey].category_content);
  categoryElements[categoryKey].category_header.addEventListener("click", () => {
    activateCategory(categoryKey);
    activateLink(categoryKey);
  });
}

let activeCategory = categoryElements["business"];

function activateCategory(categoryKey) {
  activeCategory.category_content.classList.remove("category_content__active");
  activeCategory.category_arrow.classList.remove("rotate-180");
  activeCategory = categoryElements[categoryKey];
  activeCategory.category_content.classList.add("category_content__active");
  activeCategory.category_arrow.classList.add("rotate-180");
}

// // run async function when all data has been fetch
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

const navbarLink = document.querySelectorAll(`.navbar_category`);
navbarLink.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").substring(1);
    activateLink(id);
    activateCategory(id);
  });
});

function activateLink(id) {
  const li = document.querySelector(`[href='#${id}']`);
  oldCategoryLink.classList.remove("active_category");
  li.classList.add("active_category");
  oldCategoryLink = li;
}
let oldCategoryLink = document.querySelector(`[href='#business']`);
const categorySection = document.querySelectorAll(".category_section");

// window.onscroll = () => {
//   categorySection.forEach((cat) => {
//     let top = window.scrollY;
//     let offset = cat.offsetTop;
//     let height = cat.offsetHeight;
//     let id = cat.getAttribute("id");

//     if (top >= offset - 20 && top < offset + height) {
//       activateLink(id);
//       activateCategory(id);
//     }
//   });
// };
