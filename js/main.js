function openDetails() {
   const details = document.querySelector('.menu_link-details'),
      detailsCart = document.querySelector('.details-cart'),
      detailsCloseCart = document.querySelector('.btn-close')

   function hideCart() {
      detailsCart.style.display = 'none'
   }
   function showCart() {
      detailsCart.style.display = 'block'
   }
   hideCart()
   details.addEventListener('click', (e) => {
      e.preventDefault()
      if (detailsCart.style.display == 'none') {
         showCart()
         detailsCloseCart.addEventListener('click', () => {
            hideCart()
         })
      } else {
         hideCart()
      }
   })

   // const cartsList = document.querySelector('.details_progress-bar')
   // cartsList.addEventListener('click', (event) => {
   //    const target = event.target

   //    if (target && target.classList.contains('btn-delete')) {
   //       console.log('Hallo')
   //       cartsList.remove(target.parentNode.parentNode)
   //    }
   // })
}
function select() {
   const selectAbout = document.querySelectorAll('.select_about'),
      selectItem = document.querySelectorAll('.select_item'),
      selectCurrent = document.querySelector('.select_current'),
      select = document.querySelector('.select')
   selectAbout.forEach((item) => {
      item.addEventListener('click', selectToggle)
   })
   selectItem.forEach((item) => {
      item.addEventListener('click', selectChoose)
   })
   function selectToggle() {
      select.classList.toggle('is-active')
      this.style.color = '#fff'
   }
   function selectChoose() {
      const text = this.innerText
      selectItem.forEach((item) => {
         item.style.color = '#ff4200'
      })
      this.style.color = '#939190'
      selectCurrent.innerText = text
      selectToggle()
   }
}

function sliderRange(selectorRange, spanValue) {
   const inputRange = document.querySelector(selectorRange),
      spanValueRange = document.getElementById(spanValue)

   inputRange.oninput = function () {
      spanValueRange.innerText = this.value + '%'
      const inputRange1 = document.querySelector('.customRange1'),
         inputRange1Span = document.getElementById('constructor_range-value1'),
         inputRange2 = document.querySelector('.customRange2'),
         inputRange2Span = document.getElementById('constructor_range-value2'),
         inputRange3 = document.querySelector('.customRange3'),
         inputRange3Span = document.getElementById('constructor_range-value3'),
         inputRange4 = document.querySelector('.customRange4'),
         inputRange4Span = document.getElementById('constructor_range-value4')

      // inputRange2.value = 100 - +inputRange1.value
      if (
         inputRange3.value >=
         100 - (+inputRange1.value + +inputRange2.value)
      ) {
         inputRange3.value = 100 - +inputRange1.value - +inputRange2.value
      }
      if (inputRange1.value > 100 - (+inputRange2.value + +inputRange3.value)) {
         inputRange1.value = 100 - +inputRange2.value - +inputRange3.value
         console.log('all')
      }
      inputRange4.value =
         100 - +inputRange1.value - +inputRange2.value - +inputRange3.value

      inputRange1Span.innerText = inputRange1.value + '%'
      inputRange2Span.innerText = inputRange2.value + '%'
      inputRange3Span.innerText = inputRange3.value + '%'
      inputRange4Span.innerText = inputRange4.value + '%'
   }
}
function creatNewElInDetails() {
   const addToDetails = document.querySelector('.about_btn')
   addToDetails.addEventListener('click', (event) => {
      event.preventDefault()
      const inputRange1Span = document.getElementById(
            'constructor_range-value1'
         ),
         inputRange2Span = document.getElementById('constructor_range-value2'),
         inputRange3Span = document.getElementById('constructor_range-value3'),
         inputRange4Span = document.getElementById('constructor_range-value4')
      const newCart = document.createElement('li')
      newCart.classList.add('details_progress-item')
      const cartList = document.querySelector('.details_progress-bar')
      newCart.innerHTML = `
         <div
            class="col-md-1 details_progress-item-img"
         >
            <img
               src="assets/img/header/header-details/semen-black.png"
               alt="semen-black"
            />
         </div>
         <div class="col-md-9 item_progress">
            <ul class="col-lg-5 col-md-6 col-sm-11
            progress_percent">
               <li class="progress_precent-item">${inputRange1Span.innerText}</li>
               <li class="progress_precent-item">
               ${inputRange2Span.innerText}
               </li>
               <li class="progress_precent-item">
               ${inputRange3Span.innerText}
               </li>
               <li class="progress_precent-item">
               ${inputRange4Span.innerText}
               </li>
            </ul>
            <div class="progress">
               <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${inputRange1Span.innerText}"
                  aria-valuenow="15"
                  aria-valuemin="0"
                  aria-valuemax="100"
               ></div>
               <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  style="width: ${inputRange2Span.innerText}"
                  aria-valuenow="30"
                  aria-valuemin="0"
                  aria-valuemax="100"
               ></div>
               <div
                  class="progress-bar bg-info"
                  role="progressbar"
                  style="width: ${inputRange3Span.innerText}"
                  aria-valuenow="20"
                  aria-valuemin="0"
                  aria-valuemax="100"
               ></div>
               <div
                  class="progress-bar bg-dark"
                  role="progressbar"
                  style="width: ${inputRange4Span.innerText}"
                  aria-valuenow="20"
                  aria-valuemin="0"
                  aria-valuemax="100"
               ></div>
            </div>
         </div>
         <div class="col-md-1 details_delete">
            <button class="btn-delete">
               <i class="fas fa-times"></i>
            </button>
         </div>
      `
      cartList.append(newCart)
      deleteCart()
   })
}
function deleteCart() {
   document.querySelectorAll('.btn-delete').forEach((item) => {
      item.addEventListener('click', () => {
         item.parentNode.parentNode.remove()
         console.log('asdsadasd')
      })
   })
}
function openSubheaderMenu() {
   const hamburger = document.querySelector('.hamburger'),
      subheader = document.querySelector('header .subheader')
   hamburger.addEventListener('click', () => {
      subheader.classList.toggle('active')
      hamburger.classList.toggle('hamburger_active')
      const logoImg = document.querySelector('.logo img')
      logoImg.classList.toggle('d-none')
      console.log('hallo')
   })
}
sliderRange('.customRange4', 'constructor_range-value4')
sliderRange('.customRange3', 'constructor_range-value3')
sliderRange('.customRange2', 'constructor_range-value2')
sliderRange('.customRange1', 'constructor_range-value1')
creatNewElInDetails()
select()
openDetails()
deleteCart()
openSubheaderMenu()
