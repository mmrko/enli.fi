var Tabs = (function() {
  var s;

  return {
    settings: {
      tabs: document.getElementsByClassName('tabs__item'),
      tab: document.getElementsByClassName('tab')
    },

    init: function() {
      s = this.settings;
      this.currentTab = this.prevTab = 0
      this.display();
      this.click();
    },

    display: function(displayIdx) {
      if (!s.tab.length) return

      displayIdx = displayIdx || 0

      if (s.tab.length <= displayIdx) return

      [].forEach.call(s.tab, function(tab, idx) {
        if (idx === displayIdx) return
        tab.style.display = 'none';
        tab.classList.remove('active')
      });

      [].forEach.call(s.tabs, function(tabs, idx) {
        if (idx === displayIdx) return
        tabs.classList.remove('active')
      });

      this.prevTab = this.currentTab
      this.currentTab = displayIdx

      s.tab[displayIdx].style.display = 'block';
      s.tab[displayIdx].classList.add('active');
      s.tabs[displayIdx].classList.add('active');
    },

    click: function() {
      if (!s.tabs.length) return

      var tabs = this;

      [].forEach.call(s.tabs, function(tab, idx) {
        tab.addEventListener('click', function() {
          tabs.prevTab = tabs.currentTab
          tabs.currentTab = idx
          if (tabs.prevTab === tabs.currentTab) return

          s.tab[tabs.prevTab].style.display = 'none';
          s.tab[tabs.prevTab].classList.remove('active');
          s.tabs[tabs.prevTab].classList.remove('active');
          s.tab[tabs.currentTab].style.display = 'block';
          s.tab[tabs.currentTab].classList.add('active');
          s.tabs[tabs.currentTab].classList.add('active');
        });
      });
    }

  }
})();

var Preview = (function() {
  var s;

  return {
    settings: {
      img: document.getElementsByClassName('preview__img'),
      post: document.getElementsByClassName('preview')
    },

    init: function() {
      s = this.settings;
      this.display();
      this.mouseenter();
    },

    display: function() {
      if (s.img.length) {
        [].forEach.call(s.img, function(img, idx) {
          if (idx > 0) img.style.display = 'none';
        });
      }
    },

    mouseenter: function() {
      if (s.post.length) {
        var currentIdx = 0,
            prevIdx = currentIdx;

        [].forEach.call(s.post, function(preview, idx) {
          preview.addEventListener('mouseenter', function() {
            prevIdx = currentIdx;
            currentIdx = idx;

            if (prevIdx !== currentIdx) {
              s.img[prevIdx].style.display = 'none';
              s.img[currentIdx].style.display = 'block';
            }
          });
        });
      }
    }
  }
})();

var ENLI_BOX_HEIGHT = 0

var debouncedResizeBox = debounce(function () {
  ENLI_BOX_HEIGHT = boxElems.reduce(function (h, el) {
    el.classList.add('transition-height')
    if (window.innerWidth < 865) { return h }
    return resizeBox(el)
  }, 0)
}, 250)

var addressContainerEl = document.querySelector('.contact-form__address-container')
var offerContainerEl = document.querySelector('.contact-form__offer-container')
var offerCheckboxEl = document.querySelector('input[name=offer]')
var contactFormEl = document.querySelector('.contact-form')
var addressCloseBtnEl = document.querySelector('.address-close-btn')
var formSubmitConfirmationEl = document.querySelector('.contact-form-submit-message')
var returnToFormLinkContainer = document.querySelector('.contact-form-return-link-container')
var boxElems = Array.prototype.slice.call(document.getElementsByClassName('box'))

document.addEventListener('DOMContentLoaded', function() {
  Tabs.init();
  Preview.init();

  var $tab = document.querySelector('[href="' + location.hash + '"]')
  if ($tab && $tab.tabIndex > 1) {
    Tabs.display($tab.tabIndex - 1)
  }
})

document.getElementsByClassName('site-title')[0].addEventListener('click', function () {
  location.hash = '#etusivu'
  Tabs.display(0)
})

window.addEventListener('resize', debouncedResizeBox)

offerContainerEl.addEventListener('click', function (e) {
  if (e.target.type !== 'checkbox') return
  if (e.target.checked) { return showAddressField() }
  hideAddressField()
})

contactFormEl.addEventListener('submit', function (e) {
  if (!offerCheckboxEl.checked) {
    addressContainerEl.children.address.value = ''
  }

  setTimeout(function () {
    contactFormEl.style.display = 'none'
    formSubmitConfirmationEl.style.display = 'block'
  }, 200)

  history.pushState(null, '', '#ota-yhteytta')

  e.preventDefault()
})

addressCloseBtnEl.addEventListener('click', function (e) {
  hideAddressField()
})

returnToFormLinkContainer.addEventListener('click', function (e) {
  formSubmitConfirmationEl.style.display = 'none'
  contactFormEl.style.display = 'block'
})

boxElems.forEach(attachBoxElListener)

function hideAddressField () {
  offerContainerEl.style.display = 'block'
  addressContainerEl.style.display = 'none'
  offerCheckboxEl.checked = false
}

function showAddressField () {
  offerContainerEl.style.display = 'none'
  addressContainerEl.style.display = 'block'
}

function resizeBox (el) {
  var height = (window.innerHeight - 80 - 4 * 16) / 3
  el.style.height = height + 'px'
  return height
}

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function attachBoxElListener (boxEl, idx) {
  boxEl.addEventListener('click', handleBoxElClick.bind(null, idx))
}

function handleBoxElClick (idx, e) {
  e.preventDefault()

  var cache = handleBoxElClick.__cache || (handleBoxElClick.__cache = {})
  var boxEl = e.currentTarget

  cache.BOX_HEIGHT = ENLI_BOX_HEIGHT || 200

  var siblingIndexes = [ 0, 1, 2 ]
  var siblingBoxElems = siblingIndexes.reduce(function (acc, siblingIdx) {
    if (siblingIdx === idx) return acc
    return acc.concat(boxElems[siblingIdx])
  }, [])

  if (boxEl.classList.contains('maximized')) {
    resizeBox(boxEl)
    boxEl.classList.remove('maximized')
    setTimeout(restoreSiblings.bind(null, siblingBoxElems), 300)
    return
  }

  boxEl.classList.toggle('maximized')
  boxEl.classList.remove('minimized')

  var minimizedHeight = 4 * 16
  var maximizedHeight = parseInt(cache.BOX_HEIGHT, 10) * 2 - minimizedHeight * 2

  siblingBoxElems.forEach(function (siblingEl) {
    siblingEl.classList.add('minimized')
    siblingEl.classList.remove('maximized')
    siblingEl.style.height = minimizedHeight + 'px'
  })

  var lastRow = boxEl.querySelector('.service-list--item:last-child')
  var boxTitle = boxEl.querySelector('.box-title')

  boxEl.style.height = lastRow.offsetHeight + lastRow.getBoundingClientRect().top - boxEl.getBoundingClientRect().top + boxTitle.offsetHeight + 20 + 'px'
}

function restoreSiblings (siblingBoxElems) {
  siblingBoxElems.forEach(function (siblingEl) {
    resizeBox(siblingEl)
    siblingEl.classList.remove('minimized')
  })
}

debouncedResizeBox()
