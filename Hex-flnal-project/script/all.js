// 前台 JS

// 取得產品列表，載入頁面時直接執行
// 取得產品列表 DOM
const productWrap = document.querySelector(".productWrap");

getProductList();

function getProductList() {
  axios
    .get(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/davidtt/products"
    )
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
getCardItem();

function getCardItem() {
  axios
    .get("https://livejs-api.hexschool.io/api/livejs/v1/customer/davidtt/carts")
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
    })
    .catch((err) => {
      console.log(err);
      alert("取得購物車列表失敗，請聯繫親切的工程師");
    });
}
// 加入購物車

// 編輯購物車產品數量

// 刪除所有購物車資料

// 刪除特定購物車資料

// 送出購買訂單
