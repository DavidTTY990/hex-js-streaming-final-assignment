// 前台 JS

// consts
const baseUrl = "https://livejs-api.hexschool.io";
const api_path = "davidtt";

// 取得產品列表，載入頁面時直接執行
const productWrap = document.querySelector(".productWrap");

getProductList();

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
            <a href="#" class="addCardBtn">加入購物車</a>
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
// 取得購物車列表，載入頁面時直接執行

const cardItemWrapper = document.querySelector(".card-item-wrapper");
const shoppingCartTotal = document.querySelector(".shoppingCartTotal");
getCardItem();

function getCardItem() {
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      res.data.carts.forEach((item) => {
        cardItemWrapper.innerHTML += `<tr class="card-item">
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
      </tr>`;
      });
      shoppingCartTotal.innerText = `NT$${res.data.finalTotal.toLocaleString()}`;
    })
    .catch((err) => {
      console.log(err);
      alert("取得購物車列表失敗，請聯繫親切的工程師");
    });
}
// 加入購物車

// 編輯購物車產品數量

// 刪除所有購物車資料
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", discardAll);

function discardAll(e) {
  e.preventDefault();
  axios
    .delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
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
