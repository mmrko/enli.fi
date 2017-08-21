// browser-jsonp
(function(){var e,n,r,o,t,l,u,d;r=function(e){return window.document.createElement(e)},o=window.encodeURIComponent,u=Math.random,e=function(e){var o,l,u,i,a,c,f;if(null==e&&(e={}),c={data:e.data||{},error:e.error||t,success:e.success||t,beforeSend:e.beforeSend||t,complete:e.complete||t,url:e.url||""},c.computedUrl=n(c),0===c.url.length)throw new Error("MissingUrl");return i=!1,c.beforeSend({},c)!==!1&&(u=e.callbackName||"callback",l=e.callbackFunc||"jsonp_"+d(15),o=c.data[u]=l,window[o]=function(e){return window[o]=null,c.success(e,c),c.complete(e,c)},f=r("script"),f.src=n(c),f.async=!0,f.onerror=function(e){return c.error({url:f.src,event:e}),c.complete({url:f.src,event:e},c)},f.onload=f.onreadystatechange=function(){var e,n;if(!(i||"loaded"!==(e=this.readyState)&&"complete"!==e))return i=!0,f?(f.onload=f.onreadystatechange=null,null!=(n=f.parentNode)&&n.removeChild(f),f=null):void 0},a=window.document.getElementsByTagName("head")[0]||window.document.documentElement,a.insertBefore(f,a.firstChild)),{abort:function(){return window[o]=function(){return window[o]=null},i=!0,(null!=f?f.parentNode:void 0)?(f.onload=f.onreadystatechange=null,f.parentNode.removeChild(f),f=null):void 0}}},t=function(){},n=function(e){var n;return n=e.url,n+=e.url.indexOf("?")<0?"?":"&",n+=l(e.data)},d=function(e){var n;for(n="";n.length<e;)n+=u().toString(36).slice(2,3);return n},l=function(e){var n,r,t;return n=function(){var n;n=[];for(r in e)t=e[r],n.push(o(r)+"="+o(t));return n}(),n.join("&")},("undefined"!=typeof define&&null!==define?define.amd:void 0)?define(function(){return e}):("undefined"!=typeof module&&null!==module?module.exports:void 0)?module.exports=e:this.JSONP=e}).call(this);

(function (window, document) {

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
  var galleryBoxElems = Array.prototype.slice.call(document.querySelectorAll('.testimonial__box'))
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
    if(window.FormData !== undefined) { return }

    e.preventDefault()

    if (!offerCheckboxEl.checked) {
      addressContainerEl.children.address.value = ''
    }

    var formData = new FormData(e.target)
    var data = {}

    for (var pair of formData.entries()) {
      var k = pair[0]
      var v = pair[1]
      data[k] = v
    }

    JSONP({
      url: 'https://getsimpleform.com/messages/ajax?form_api_token=cacd2dc1a6ffbf7685e598f5f063b158',
      data: data,
      success: function(data) {
        history.pushState(null, '', '#ota-yhteytta')
        contactFormEl.style.display = 'none'
        formSubmitConfirmationEl.style.display = 'block'
      },
      error: function (e) {
        alert('Lähetys epäonnistui: ' + e.message)
      }
    });
  })

  addressCloseBtnEl.addEventListener('click', function (e) {
    hideAddressField()
  })

  returnToFormLinkContainer.addEventListener('click', function (e) {
    formSubmitConfirmationEl.style.display = 'none'
    contactFormEl.style.display = 'block'
  })

  boxElems.forEach(attachBoxElListener)

  galleryBoxElems.forEach(attachGalleryBoxElListener)

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

  function attachGalleryBoxElListener (el, idx) {
    el.addEventListener('click', function () {
      galleryInit(idx ? idx + 1 : idx)
    })
  }

  debouncedResizeBox()

  var pswpElement = document.querySelector('.pswp');

  var items = [
      {
          src: 'assets/images/gallery/paivakoti_joensuu_1.jpg',
          w: 900,
          h: 575,
          title: 'Päiväkoti 750k-m&sup2; (Joensuu, 2017)'
      },
      {
          src: 'assets/images/gallery/paivakoti_joensuu_2.jpg',
          w: 900,
          h: 320,
          title: 'Päiväkoti 750k-m&sup2; (Joensuu, 2017)'
      },
      {
          src: 'assets/images/gallery/paivakoti_kuopio.jpg',
          w: 900,
          h: 505,
          title: 'Päiväkoti  850k-m&sup2; (Kuopio, 2017)'
      },
      {
          src: 'assets/images/gallery/hoivakoti_lohja.jpg',
          w: 900,
          h: 770,
          title: 'Hoivakoti muistisairaille ikäihmisille 1600k-m&sup2; (Lohja, 2017)'
      },
  ];

  function galleryInit (idx) {
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, { index: idx });

    gallery.listen('afterChange', function() {
      var arr = Array.prototype.slice.call(document.querySelectorAll('img.pswp__img'))
      var inView = arr.filter(function (el) {
        return isElementInViewport(el)
      })
      positionCaption(inView[0])
    });

    gallery.init();
    return gallery
  }

  function positionCaption (el) {
    el = el || document.querySelector('.pswp__img')
    var offset = el.closest('div.pswp__zoom-wrap').getBoundingClientRect().top
    var adjustment = window.innerWidth < 865 ? 54 : 44;
    offset && (document.querySelector('.pswp__caption:not(.pswp__caption--fake)').style.top = offset - adjustment + 'px')
  }

  function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }
})(window, document)
