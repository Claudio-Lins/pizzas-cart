const c = (el) => document.querySelector(el);
const cAll = (el) => document.querySelectorAll(el);
let modalQt = 1;
let cart = [];
let modalKey = 0;

pizzaJson.map((item, i) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  modalQt = 1;

  pizzaItem.setAttribute("data-key", i);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--price").innerHTML =
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(item.price);
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    modalQt = 1;
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(pizzaJson[key].price);
    c(".pizzaInfo--size.selected").classList.remove("selected");
    cAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      sizeIndex === 2 && size.classList.add("selected");
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
      c(".pizzaInfo--qt").innerHTML = modalQt;
    });
    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });
  c(".pizza-area").append(pizzaItem);
});

function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
}

cAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});

cAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  let idemtifier = pizzaJson[modalKey].id + "@" + size;

  let key = cart.findIndex((item) => item.identifier == idemtifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier: idemtifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  console.log(cart);
  closeModal();
});

c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});

c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

function updateCart() {
  c(".menu-openner span").innerHTML = cart.length;
  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = c(".models .cart--item").cloneNode(true);
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "320g";
          break;
        case 1:
          pizzaSizeName = "530g";
          break;
        case 2:
          pizzaSizeName = "860g";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      c(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(subtotal);
    c(".desconto span:last-child").innerHTML = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(desconto);
    c(".total span:last-child").innerHTML = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total);
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
}
