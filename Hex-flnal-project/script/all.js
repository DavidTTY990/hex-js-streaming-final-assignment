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
let productList = [];

function renderProductList(productList, domLocation) {
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
}

function getProductList() {
  console.log("[果實家居] 取得產品列表...");
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
      productList = res.data.products;
      renderProductList(productList, productWrap)
      addToCartBtnListener();
      console.log("[果實家居] 取得產品列表成功。")
    })
    .catch((err) => {
      console.log(err);
      alert("取得產品列表失敗，請聯繫親切的工程師");
    });
}

// 篩選產品
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", filterProductList);

function filterProductList(e) {
  productWrap.innerHTML = "";
  let filteredProductList = [];
  let targetValue = e.target.value;
  if (targetValue === "全部") {
    filteredProductList = productList;
  } else {
    filteredProductList = productList.filter(
      (item) => item.category === targetValue
    );
  }

  filteredProductList.forEach((item) => {
    renderProductList(productList, productWrap)
  });
  addToCartBtnListener();
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
  cardItem.forEach((item) => {
    if (item.product.id === e.target.dataset.id) {
      itemNum += item.quantity;
    } else {
      return;
    }
  });
  axios
    .post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        productId: `${e.target.dataset.id}`,
        quantity: itemNum,
      },
    })
    .then((res) => {
      // alert("新增購物車成功");
      console.log(res)
      getCardItem();
    })
    .catch((err) => {
      // alert("新增購物車失敗");
      console.log(err)
    });
}

// 取得購物車列表
const shoppingCart = document.querySelector(".shoppingCart");
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const shoppingCartTotal = document.querySelector(".shoppingCartTotal");
let cardItem = [];

function getCardItem() {
  axios
    .get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      console.log("[果實家居] 取得購物車列表...")
      cardItem = res.data.carts;
      shoppingCartTable.innerHTML = "";
      let string = `<caption></caption><tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>`;
      cardItem.forEach((item) => {
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
      // 當購物車是空的，顯示提醒資訊
      if (cardItem.length <= 0) {
        let emptyCartMessage = document.createElement("p");
        emptyCartMessage.innerText = "購物車內還沒有商品";
        emptyCartMessage.className = "emptyCartMessage";
        shoppingCart.appendChild(emptyCartMessage);
      } else {
        let targetRemoveMsg = document.querySelector(".emptyCartMessage");
        targetRemoveMsg && shoppingCart.removeChild(targetRemoveMsg);
        shoppingCartTable.innerHTML = string;

        const discardAllBtn = document.querySelector(".discardAllBtn");
        discardAllBtn.addEventListener("click", discardAllItems);
      }
      console.log("[果實家居] 取得購物車列表成功。");
    })
    .catch((err) => {
      console.log(err);
      alert("取得購物車列表失敗，請聯繫親切的工程師");
    });
}

// 刪除所有購物車資料
function discardAllItems(e) {
  e.preventDefault();
  axios
    .delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      alert("所有品項刪除成功");
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
shoppingCartTable.addEventListener("click", deleteItem);
function deleteItem(e) {
  e.preventDefault();
  const targetItemId = e.target.getAttribute("data-id");
  if (targetItemId) {
    axios
      .delete(
        `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${targetItemId}`
      )
      .then((res) => {
        alert("指定品項刪除成功");
        getCardItem();
      })
      .catch((err) => {
        alert("指定品項刪除失敗，請聯繫親切的工程師");
      });
  }
}
// 組合訂單資料、送出購買訂單
const submitBtn = document.querySelector(".orderInfo-btn");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerAddress = document.getElementById("customerAddress");
const tradeWay = document.getElementById("tradeWay");
submitBtn.addEventListener("click", (e) => submitOrder(e));

let orderData = {};

function submitOrder(e) {
  e.preventDefault();
  setOrderInfo();
  if(orderInfoStatue) {}
  axios
    .post(`${baseUrl}/api/livejs/v1/customer/${api_path}/orders`, {
      data: orderData,
    })
    .then((res) => {
      alert("送出訂單資料成功");
      clearAllOrderInfo();
      console.log(res);
    })
    .catch((err) => {
      alert("送出訂單資料失敗，請聯繫親切的工程師");
      console.log(err);
    })
}

// 處理訂單資料顯示、資料處理邏輯

// 處理訂單資料
function setOrderInfo() {
  let customerNameInfo = customerName.value;
  let customerPhoneInfo = customerPhone.value;
  let customerEmailInfo = customerEmail.value;
  let customerAddressInfo = customerAddress.value;
  let tradeWayInfo = tradeWay.value;

  orderData = {
    user: {
      name: customerNameInfo,
      tel: customerPhoneInfo,
      email: customerEmailInfo,
      address: customerAddressInfo,
      payment: tradeWayInfo,
    },
  };
}

//表單「必填」顯示邏輯
const orderInfoInput = document.querySelectorAll('.orderInfo-input');
const orderInfoMessage = document.querySelectorAll('.orderInfo-message');
let orderInfoStatue = false;

function validateOrderInfo() {
  orderInfoInput.forEach((item, index) => {
    if (item.value == "") {
        orderInfoMessage[index].style.display = 'block'
        alert(`哎呀，預訂資料「${orderInfoMessage[index].dataset.message}」為必填項目，請填寫後再次送出，感恩`)
    }
  })
}

// 表單送出後，清除所有項目邏輯
function clearAllOrderInfo() {
  orderInfoInput.forEach(item => {
    item.value = "";
  })
}