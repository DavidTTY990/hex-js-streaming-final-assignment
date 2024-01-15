// 前台 JS

// consts
const baseUrl = "https://livejs-api.hexschool.io";
const api_path = "davidtt";

// 取得產品列表與購物車列表，載入頁面時直接執行 init
init();

function init() {
  getProductList();
  getCardItem();
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
      addToCartBtnListener();
    })
    .catch((err) => {
      console.log(err);
      alert("取得產品列表失敗，請聯繫親切的工程師");
    });
}

// 為「加入購物車」按鈕加上事件監聽，取得購物車列表時就直接呼叫
function addToCartBtnListener() {
  const addToCartBtnArray = document.querySelectorAll(".addCardBtn");
  addToCartBtnArray.forEach(function (item) {
    item.addEventListener("click", addToCart);
  });
}
// 加入購物車
function addToCart(e) {
  e.preventDefault();
  let itemNum = 1;
  cardItem.forEach(item => {
    if(item.product.id === e.target.dataset.id) {
      itemNum += item.quantity;
    } else {
      return;
    }
  })
  axios
    .post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        productId: `${e.target.dataset.id}`,
        quantity: itemNum,
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

// 取得購物車列表
const shoppingCart = document.querySelector(".shoppingCart")
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const shoppingCartTotal = document.querySelector(".shoppingCartTotal");
let cardItem = [];


function getCardItem() {
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      cardItem = res.data.carts;
      shoppingCartTable.innerHTML = "";
      let string = `<caption></caption><tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>`;
      res.data.carts.forEach((item) => {
        string += `
        <tr>
          <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="" />
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.price.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>NT$${(item.product.price * item.quantity).toLocaleString()}</td>
          <td class="discardBtn">
            <a href="#" class="material-icons" data-id=${item.id}> clear </a>
          </td>
        </tr>
        `;
      });
      string += `<tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
        <p>總金額</p>
      </td>
      <td class="shoppingCartTotal">NT$${res.data.finalTotal.toLocaleString()}</td>
    </tr>`;
      // TODO: 寫一個判斷式，如果購物車是空的，就插入一段文字「購物車內沒有商品」

      if(cardItem.length <= 0) {
        let emptyCartMessage = document.createElement("p");
        emptyCartMessage.innerText = "購物車內還沒有商品";
        emptyCartMessage.className = "emptyCartMessage";
        shoppingCart.appendChild(emptyCartMessage);
      } else {
        let targetRemoveMsg = document.querySelector(".emptyCartMessage")
        targetRemoveMsg && shoppingCart.removeChild(targetRemoveMsg);
        shoppingCartTable.innerHTML = string;
        const discardAllBtn = document.querySelector(".discardAllBtn");
        discardAllBtn.addEventListener("click", discardAllItems);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("取得購物車列表失敗，請聯繫親切的工程師");
    });
}
// 編輯購物車產品數量

// 刪除所有購物車資料
function discardAllItems(e) {
  e.preventDefault();
  axios
    .delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      alert('所有品項刪除成功')
      getCardItem();
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
shoppingCartTable.addEventListener('click', deleteItem);
function deleteItem(e) {
  e.preventDefault();
  const targetItemId = e.target.getAttribute('data-id');
  if(targetItemId) {
    axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${targetItemId}`)
    .then((res) => {
      alert('指定品項刪除成功')
      getCardItem();
    })
    .catch((err) => {
      alert('指定品項刪除失敗，請聯繫親切的工程師')
    })
  }

}
// 送出購買訂單
