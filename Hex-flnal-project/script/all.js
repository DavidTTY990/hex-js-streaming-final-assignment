// 前台 JS

// consts
const baseUrl = "https://livejs-api.hexschool.io";
const api_path = "davidtt";

// 取得產品列表與購物車列表，載入頁面時直接執行 init
init();

function init() {
  getProductList();
  // getCardItem();
}
// 取得產品列表
const productWrap = document.querySelector(".productWrap");

function getProductList() {
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
      const productList = res.data.products;
      productList.forEach((item) => {
        productWrap.innerHTML += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img
              src="${item.images}"
              alt=""
            />
            <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
          </li>`;
      });
    })
    .catch((err) => {
      console.log(err);
      alert("取得產品列表失敗，請聯繫親切的工程師");
    });
}
// 取得購物車列表
const cardItemWrapper = document.querySelector(".card-item-wrapper");
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const shoppingCartTotal = document.querySelector(".shoppingCartTotal");

function getCardItem() {
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      shoppingCartTable.innerHTML = "";
      let string = `<caption></caption><tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>`
      res.data.carts.forEach((item) => {
        string += `
        <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="" />
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.price}</td>
          <td>${item.quantity}</td>
          <td>NT$${item.product.price * item.quantity}</td>
          <td class="discardBtn">
            <a href="#" class="material-icons"> clear </a>
          </td>
        `;
      });

      string + `<tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
        <p>總金額</p>
      </td>
      <td class="shoppingCartTotal">NT$0</td>
    </tr>`
    shoppingCartTable.innerHTML += string
      shoppingCartTotal.innerText = `NT$${res.data.finalTotal.toLocaleString()}`;
      addToCartBtnListener();
    })
    .catch((err) => {
      console.log(err);
      alert("取得購物車列表失敗，請聯繫親切的工程師");
    });
}

// `<td>
//            <div class="cardItem-title">
//              <img src="${item.product.images}" alt="" />
//              <p>${item.product.title}</p>
//            </div>
//          </td>
//          <td>NT$${item.product.price}</td>
//          <td>${item.quantity}</td>
//          <td>NT$${item.product.price * item.quantity}</td>
//          <td class="discardBtn">
//            <a href="#" class="material-icons"> clear </a>
//          </td>`

// 為按鈕加上監聽，取得購物車列表時就直接呼叫
function addToCartBtnListener() {
  const addToCartBtnArray = document.querySelectorAll(".addCardBtn");
  addToCartBtnArray.forEach(function (item) {
    item.addEventListener("click", addToCart);
  });
}
// 加入購物車
function addToCart(e) {
  e.preventDefault();
  axios
    .post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        productId: `${e.target.dataset.id}`,
        quantity: 1,
      },
    })
    .then((res) => {
      alert("新增購物車成功");
      getCardItem();
    })
    .catch((err) => {
      alert("新增購物車失敗");
    });
}
// 編輯購物車產品數量

// 刪除所有購物車資料
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", discardAll);

function discardAll(e) {
  e.preventDefault();
  axios
    .delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      shoppingCartTotal.textContent = "NT$0";
      cardItemWrapper.innerHTML = "購物車內沒有商品";
    })
    .catch((err) => {
      if (err.response.data.message) {
        alert("購物車已經是空的囉！");
      } else {
        alert("刪除購物車項目失敗，請聯繫親切的工程師");
      }
    });
}
// 刪除特定購物車資料

// 送出購買訂單
