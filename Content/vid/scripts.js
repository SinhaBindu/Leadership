"use strict";
// main.js
(function($){
  
  var _ua = (function(u){
    return {
      Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
        || u.indexOf("ipad") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
        || u.indexOf("kindle") != -1
        || u.indexOf("silk") != -1
        || u.indexOf("playbook") != -1,
      Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
        || u.indexOf("iphone") != -1
        || u.indexOf("ipod") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
        || u.indexOf("blackberry") != -1
    }
  })(window.navigator.userAgent.toLowerCase());

  // init
  $(function(){
    
	  if(_ua.Tablet || _ua.Mobile){
	      $(".js-footerViewSwitch").addClass("-active");
	      if(localStorage.getItem("switchScreen") == 1) {
	        //$("head").prepend('<meta name="viewport" content="width='+(1024 + 'px, initial-scale=' + (document.documentElement.clientWidth / 1024))+'">');
	    	  setTimeout(function(){
	    		  $("head").prepend('<meta name="viewport" content="width='+(1024 + 'px, initial-scale=' + (0.1))+'">');
	    	  }, 2000); 
	        $(".js-footerViewSwitch_item-pc").addClass('-active');
	          console.log('init scale desktop = '+ document.documentElement.clientWidth / 1024);
	      } else {
	        $("head").prepend('<meta name="viewport" content="width=device-width, initial-scale=1">');
	        $(".js-footerViewSwitch_item-sp").addClass('-active');
	          console.log('int scale in else mobile = '+1);
	      }

	      $(".js-footerViewSwitch_item-pc, .js-footerViewSwitch_item-sp").on('click', function(ev) {
	        localStorage.setItem("switchScreen", $(this).attr("class").indexOf("js-footerViewSwitch_item-pc") != -1 ? 1 : 2);

	        location.reload();
	        return false;
	      });

	    }else{
	      $("head").prepend('<meta name="viewport" content="width=device-width, initial-scale=1">');
	      return false;
	    }
  });
    
  // ロード完了後に諸々実行
  $(window).on('load',function(){
   if(_ua.Tablet || _ua.Mobile){
      if(localStorage.getItem("switchScreen") > 0){
        $('html,body').animate({scrollTop:0},'1');
      }
    }
  });

})(jQuery);


// NOTE: gulp-concat で js/_lib 配下が展開される。諸事情で import はできない。


// register.js
// TODO: ACJ という名前をオブジェクトに使ってよいか確認する必要あり
// TODO: できれば ACJ を Class 化したい
(function($){
  if (window.ACJ) return false;

  var ACJ = window.ACJ = {
    // scripts: {},
    breakePoints: {
      large: Infinity,
      medium: 960,
      small: 600
    },
    samples: {},
    ready: []
    // done: [] // TODO: 処理済みの script を保持しておきたい
  }

  ACJ.process = function(script){
    if (typeof script !== "function") throw new Error("ACJ.script required function")
    return script();
  }

  // TODO: register は script を受け付ける想定にしているが、自由度が高すぎるので string で script の名前を渡し別途定義した script を実行するほうがいいかもしれない。
  ACJ.register = function(script){
    if (ACJ.processed) {
      ACJ.process(script);
    } else {
      ACJ.ready.push(script);
    }
  }

  // init
  $(function(){
    _.each(ACJ.ready, ACJ.process);
    ACJ.processed = true;
    
  });
})(jQuery);


// accorrdion.js
// accordion
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setAccordion';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setAccordion").setAccordion(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        trigger: ".js-setAccordion_trigger",
        target: ".js-setAccordion_target"
      },
      classNames: {
        // Active 用の class 設計は相談が必要。
        // sample では aria-hidden, aria-expanded を使ってるのでそれを正とできると理想。
        triggerActive: "-active",
        targetActive: "-active",
      }
    }, options);

    var initAccordion = function($accordion, $triggers, $targets){
      var activationCond = $accordion.data('accordion-activate');
      var accordionSpeed = $accordion.data('accordion-speed') || 'normal';
      // window size を確認し、Accordion が有効か確認

      var checkWindowCond = window.hoge = function(){
        var windowWidth = $(window).width();
        var bpCond = _.map(ACJ.breakePoints, function(bp,key){
          return (bp >= windowWidth) ? key : false;
        })
        return _.last(_.without(bpCond, false)) || 'large';
      }
      var windowCond = checkWindowCond()
      var isActivated = activationCond && activationCond[checkWindowCond()]

      if (!activationCond || isActivated) $targets.hide().attr('aria-hidden', true);

      // window 幅変更に対応
      $(window).on('resize', _.throttle(function(){
        var $activeTargets = $targets.filter('[aria-expanded=true]');
        var currentWindowCond = checkWindowCond();
        var hasCond = !!activationCond;
        var isCurrentActivated = hasCond && activationCond[currentWindowCond];
        var $activeTargets;

        if (
            hasCond &&
            windowCond !== currentWindowCond &&
            isCurrentActivated !== isActivated
          ){
          windowCond = currentWindowCond;
          isActivated = isCurrentActivated;
          if (isCurrentActivated){
            // bp が変化していて activationCond が true に変化したときのみ accordion をたたむ
            hideAccordions();
          } else {
            // bp が変化していて activationCond が false に変化したときのみ accordion を無効にする
            voidAccordions();
          }
        }

        $activeTargets = $targets.filter('[aria-expanded=true]');
        $activeTargets.each(function(){
          var $target = $(this);
          var $inner = $target.children().first();
          $target.height($inner.height());
        });
      }, 100));

      var voidAccordions = function(){
        $triggers.removeClass(settings.classNames.triggerActive);
        $targets.attr('aria-hidden', null)
                .attr('aria-expanded', null)
                .css({
                  'height': '',
                  'display': ''
                })
                .removeClass(settings.classNames.targetActive);
      }

      var hideAccordions = function(){
        $triggers.removeClass(settings.classNames.triggerActive);
        $targets.attr('aria-hidden', true)
                .attr('aria-expanded', false)
                .stop()
                .slideUp(accordionSpeed, removeStyle)
                .removeClass(settings.classNames.targetActive);
      }

      var showAccordion = function($trigger){
        var $target = $trigger.next(settings.selectors.target) ||
                      $trigger.next.find(settings.selectors.target);
        var targetIsHidden = $target.attr('aria-hidden') === 'true';
        var $targetInner = $target.children().first();
        var $targetAccordion = $trigger.next(settings.selectors.target).find('.js-setAccordion_trigger');
        
        $trigger.addClass(settings.classNames.triggerActive)
        $target.attr('aria-hidden', false)
               .attr('aria-expanded', true)
               .stop()
               .slideDown(accordionSpeed, removeStyle)
               .addClass(settings.classNames.targetActive);
        if ($trigger.hasClass('js-open-child-accordion')){
            showAccordion($targetAccordion)

        }
      }

      var removeStyle = function(){
        $targets.css({
          height: 'auto',
          padding: '',
          margin: ''
        });
      }

      // click 時に開閉。 css transition の都合上 inner の高さをはかって target に高さを当てる。
      $triggers.on('click', function(ev){
        ev.preventDefault();
        // accordion-activate のルールに従って、window 幅に応じて処理をスルー。
        if (activationCond && !activationCond[checkWindowCond()]) return;

        var $trigger = $(this);
        var $target = $trigger.next(settings.selectors.target) ||
                      $trigger.next.find(settings.selectors.target);
        var targetIsHidden = $target.attr('aria-hidden') === 'true';

        hideAccordions();
        if (targetIsHidden) showAccordion($trigger);

      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      var $accordion = $(this);
      var $triggers = $accordion.find("> " + settings.selectors.trigger);
      var $targets = $accordion.find("> " + settings.selectors.target);

      initAccordion($accordion, $triggers, $targets);

      this[namespace + "Processed"] = true;

      return this;
    });
  }
  
  // ロード完了後に諸々実行
  $(window).on('load',function(){
    $(".c-latestUpdateInfoList_content .c-latestUpdateInfoList_accordion:first-child .c-latestUpdateInfoList_accordionTrigger").trigger("click");
  });
})(jQuery);


// action-button.js
// アクション付きボタン
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setActionButton';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setActionButton").setActionButton(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      delay: 1000,
      selectors: {
        trigger: '.js-setActionButton-trigger',
        tooltip: '.js-setActionButton-tooltip',
        stateTarget: '.js-setActionButton-hasState'
      },
      classes: {
        active: '-active',
        logout: '-logout'
      }
    }, options);

    var initActionButton = function($elem){
      var $trigger = $elem.find(settings.selectors.trigger);
      var $tooltip = $elem.find(settings.selectors.tooltip);
      var toggleSpeed = $elem.data("tooltip-speed") || "slow";
      var $stateTarget = $elem.find(settings.selectors.stateTarget);
        var delayTime = $elem.data("delay-time") || settings.delay;
        
      $trigger.on('click', function(ev){
        ev.preventDefault();
        if ($stateTarget.is("." + settings.classes.active)) {
//          $stateTarget.removeClass(settings.classes.active)
//          $tooltip.clearQueue()
//                  .stop()
//                  .fadeOut("fast");
        } else {
//            if (!$stateTarget.is("." + settings.classes.logout)) {
//	            $stateTarget.addClass(settings.classes.active)
//       }
//          $tooltip.clearQueue()
//                  .stop()
//                  .fadeIn(toggleSpeed)
//                  .delay(delayTime)
//                  .fadeOut(toggleSpeed);
        }
      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initActionButton($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// bar.js
// js 発火機構のテスト
(function($){
  var ACJ = window.ACJ;
  var namespace = 'bar';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-bar").bar(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
    }, options);

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// carousel.js
// カルーセル
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setCarousel';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setCarousel").setCarousel(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var initCarousel;
    var settings = $.extend({
      selectors: {
        item: ".slick-slide",
        removeTrigger: ".js-setCarousel-remove",
        removeWrapper: ".js-setRemoveContents",
        videos: ".js-videoPlayer"
      },
      speed: {
        slow: 600,
        normal: 400,
        fast: 200
      }
    }, options);

    initCarousel = function($elem){
      var $removeTrigger = $elem.find(settings.selectors.removeTrigger);
      var $removeWrapper = $elem.parents(settings.selectors.removeWrapper);
      var responsive = $elem.data('responsive')
      var pouseVideo = function(){
        var $videos = $elem.find(settings.selectors.videos);
        _.each($videos, function(video){
          if (video && video.pauseVideo) video.pauseVideo();
        });
      }
      var hasYouku = function(){
	    return !!$elem.find('[data-video-provider=youku]').length;
	  }
      var slickOption = {
        arrows: !!$elem.data('arrows'),
        autoplay: !!$elem.data('autoplay'),
        autoplaySpeed: $elem.data('autoplay-speed') || 3000,
        centerMode: !!$elem.data('center-mode'),
        dots: !!$elem.data('dots'),
        fade: !!$elem.data('fade'),
        infinite: !!$elem.data('infinite'),
        slidesToShow: $elem.data('slides-to-show'),
        slidesToScroll: $elem.data('slides-to-scroll'),
        speed: settings.speed[$elem.data('speed')] || settings.speed.normal,
        variableWidth: !!$elem.data('variable-width')
      }

      if (responsive && responsive.length){
    	  if(typeof responsive != "object"){
  			responsive = JSON.parse(responsive)
            }
        slickOption.responsive = _.each(responsive, function(option){
          option.breakpoint = ACJ.breakePoints[option.breakpoint];
          option.settings = $.extend(_.clone(slickOption), option.settings);
        });
      }

      // Youku Player を含む場合、強制的に autoplay と infinite を無効化する
      // Youku Player のAPIが不安定なため autoplay, infinite の正常動作が期待できないため
      if (hasYouku()) {
        slickOption.autoplay = false;
        slickOption.infinite = false;
      }
        
      $elem.slick(slickOption).on('beforeChange', pouseVideo);
        
      $removeTrigger.on('click', function(ev){
        ev.preventDefault();
        var $item = $(this).parents(settings.selectors.item);
        var $itemAll = $item.siblings(':not(.slick-cloned)').addBack();
        var itemIndex = $itemAll.index($item);
        if($itemAll.length > 1) {
          $item.animate({"opacity": 0}, 300, function(){
            $elem.slick('slickRemove',itemIndex);
          });
        } else {
          $removeWrapper.fadeOut(300, function(){
            $(this).remove();
          });
        }
      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initCarousel($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// fb-responsive.js
// Facebook ページプラグインのレスポンシブ対応
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setFBResponsive';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setFBResponsive").setFBResponsive(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        "FBPage": ".fb-page"
      }
    }, options);

    var initFBResponsive = function($FBResponsive){
      window.onload = function(){
        var htmlTemplate = $FBResponsive.html();
        var windowWidth = $(window).width();
        var defaultWidth = $FBResponsive.width();
        var resize = function(){
          var currentWindowWidth = $(window).width();
          if (windowWidth === currentWindowWidth) return;

          var currentWidth = $FBResponsive.width();

          windowWidth = currentWindowWidth;

          if (defaultWidth !== currentWidth && currentWidth < 500 || defaultWidth < 500) {

            $FBResponsive.html(htmlTemplate);
            window.FB.XFBML.parse();
            defaultWidth = currentWidth;
          }
        }
        $(window).on('resize', _.debounce(resize, 300));
      }
    }
      
    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initFBResponsive($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


"use strict";
// footer.js
// Global Footer のインタラクション
(function($){
  var ACJ = window.ACJ;
  var namespace = 'gFooter';
  var rootClassName = 'js-footer';

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $('.' + rootClassName).gFooter(); }
  }

  ACJ.register(ACJ.samples.gFooter.default);
  $(function(){
    ACJ.register(ACJ.samples.setModalDialog.default);
  });


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var initNav, initToPageTop;
    var settings = $.extend({
      selectors: {
        "gnavList": ".js-footerNav_child",
        "gnavItem": ".js-footerNav_category",
        "gnavTrigger": ".js-footerNav_parent",
        "gnavDropdown": ".js-footerNav_child",
        "toPageTop": ".js-footerPageTop"
      },
      classNames: {
        gnavActive: '-active'
      }
    }, options);

    // グローバルナビゲーション子階層
    initNav = function ($footer) {
      var $trigger = $footer.find(settings.selectors.gnavTrigger);
      var $allDropdown = $footer.find(settings.selectors.gnavDropdown);
      var navSpeed = $footer.data('nav-speed') || 'normal';
      var removeStyle = function(){
        $allDropdown.css({
          height: 'auto',
          padding: '',
          margin: ''
        });
      }
      var toggle = function(){
        return function (ev) {
          var $dropdownParent = $(this);
          var $dropdown = $dropdownParent.parent().find(settings.selectors.gnavDropdown);
          var isDropdownHidden = $dropdown.is(":hidden");
          var navSpeed = isDropdownHidden ? navSpeed : 0;
          var method;
          if (!$dropdown.length || $(window).width() > ACJ.breakePoints.small) return;

          ev.preventDefault();

          method = (isDropdownHidden)
                 ? { "htmlClass": "addClass", "slide": "slideDown" }
                 : { "htmlClass": "removeClass", "slide": "slideUp" };


          $dropdown.stop()[method.slide](navSpeed, function(){
            $(this).css('display', '')[method.htmlClass](settings.classNames.gnavActive);
            removeStyle();
          });
          $dropdownParent[method.htmlClass](settings.classNames.gnavActive);
        }
      }

      $trigger.on('click', toggle());
    }

    // ページトップへリンクの動作。
    initToPageTop = function ($footer) {
      var $window = $(window);
      var $toPageTop = $footer.find(settings.selectors.toPageTop);
      var visibleHeight = $toPageTop.data('visible-height') || 200;
      var scrollSpeed = $toPageTop.data('scroll-speed') || "normal";
      var getScrollTop = function() {
        return $window.scrollTop();
      }
      var toggle = function(show){
        show ? $toPageTop.stop().fadeIn() : $toPageTop.stop().fadeOut();
      }


      // Icon font のレンダリングが不安定な場合があるので少し待つ。
      setTimeout(function(){
        toggle(getScrollTop() > visibleHeight)
      }, 100)

      $window.on('scroll', _.throttle(function(){
        toggle(getScrollTop() > visibleHeight)
      }, 200));

      $toPageTop.on('click', function(ev){
        ev.preventDefault();
        $('html,body').animate({scrollTop:0}, scrollSpeed);
      });

    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      var $footer = $(this);

      initNav($footer);
      initToPageTop($footer);

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);




// gallery.js
// ギャラリー
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setGallery';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setGallery").setGallery(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        "galleryItem": ".c-gallery_itemLink"
      }
    }, options);

    var initModalGallery = function($gallery){
      var $galleryItem =$gallery.find(settings.selectors.galleryItem);

      var $galleryItem_imgs = $galleryItem.map(function(item){
            var $el = $(this).find('img');
            	if($el.length > 0){
            		return this;
            	}
            });
			      $galleryItem_imgs.fancybox({
        helpers:  {
          overlay: {
            locked: true
          },
          title	: {
              type: 'inside'
          },
          thumbs : {
              width: 50,
              height: 50
          }
        }
      });


    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initModalGallery($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


"use strict";
// header.js
// Global Header のインタラクション
(function($){
  var ACJ = window.ACJ;
  var namespace = 'gHeader';
  var rootClassName = 'js-header';

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $('.' + rootClassName).gHeader(); }
  }

  ACJ.register(ACJ.samples.gHeader.default);
  $(function(){
    ACJ.register(ACJ.samples.setModalDialog.default)
  });

  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var initNav, initSearch, initMenu;
    var settings = $.extend({
      selectors: {
        "gnavList": ".js-headerNav_list",
        "gnavItem": ".js-headerNav_item",
        "gnavTrigger": ".js-headerNav_item > a",
        "gnavDropdown": ".js-headerNav_dropdown",
        "gnavDropdownClose": ".js-headerNav_dropdownClose",
        "search": ".js-headerSearch",
        "searchTrigger": ".js-headerButton-search > a",
        "searchCloseTrigger": ".js-headerButton-close-search > a",
        "menu": ".js-header_menu",
        "menuTrigger": ".js-headerButton-menu > a",
        "menuCloseTrigger": ".js-headerButton-close-menu > a"
      },
      classNames: {
        gnavActive: '-active',
        searchActive: '-active',
        headerMenuOpen: 'js-headerMenuOpen',
        menuActive: '-active'
      }
    }, options);

    // グローバルナビゲーション子階層
    initNav = function ($header) {
      var $triggers = $header.find(settings.selectors.gnavTrigger);
      var $triggers2 = $header.find(settings.selectors.gnavItem);
      var $closeTriggers = $header.find(settings.selectors.gnavDropdownClose);
      var $allDropdown = $header.find(settings.selectors.gnavDropdown);
      var isBPSmall = function(){ return $(window).width() <= ACJ.breakePoints.small; }
      var isBPMedium = function(){ return $(window).width() <= ACJ.breakePoints.medium; }
      var currentBPSmall = isBPSmall();
      var toggle = function(mode){
        return function (ev) {
          var $currentTrigger = '';
	          if (mode === 'open' || mode === 'closeAll') {
	            $currentTrigger = $(this);
	          } else if ( mode === 'close') {
	            $currentTrigger = $(this).find('a');
	          }else{
	            $currentTrigger = $(this);
              }
	          var $dropdownParent = $currentTrigger.parents(settings.selectors.gnavItem);
          var $dropdown = $dropdownParent.find(settings.selectors.gnavDropdown);
          var navSpeed = $header.data('nav-speed') || 'normal'
          var removeStyle = function(){
            $(this).css({
              height: 'auto',
              padding: '',
              margin: ''
            });
          }

          if (!$dropdown.length && ev) {
            return;
          }

          if (ev) ev.preventDefault();

          if (mode === 'closeAll') {
            $allDropdown.stop().slideUp(0, removeStyle);
            $triggers.removeClass(settings.classNames.gnavActive);
          } else if ($dropdown.is(":hidden") || mode === 'open') {
            if (!isBPSmall()) {
              // BreakePoint small 以上の場合他のドロップダウンを閉じる。
              $allDropdown.stop().slideUp(0, removeStyle);
              $triggers.removeClass(settings.classNames.gnavActive);
            }
            $dropdown.stop().slideDown(navSpeed, removeStyle);
            $currentTrigger.addClass(settings.classNames.gnavActive);
          } else if ( mode === 'close') {
            $dropdown.stop().slideUp(0, removeStyle);
            $currentTrigger.removeClass(settings.classNames.gnavActive);
          } else {
            $dropdown.stop().slideUp(0, removeStyle);
            $currentTrigger.removeClass(settings.classNames.gnavActive);
          }
        }
      }

      var mouseTrigger = function(mode){
        $triggers.off();
        $triggers2.off();
        if (!isBPMedium()) {
            $triggers.on('mouseover', toggle('open'));
            $triggers2.on('mouseleave', toggle('close'));
        }else{
            $triggers.on('click', toggle());
        }
        $closeTriggers.on('click', toggle('closeAll'));
      }
	      mouseTrigger();

      $(window).on('resize', _.throttle(function(){
        mouseTrigger();
        //if (currentBPSmall === isBPSmall()) return;
        toggle('closeAll')();
        currentBPSmall = isBPSmall();
      }, 100));
    }

    // saerch UI
    initSearch = function ($header) {
      var $search = $header.find(settings.selectors.search);
      var $searchTrigger = $header.find(settings.selectors.searchTrigger);
      var $searchCloseTrigger = $search.find(settings.selectors.searchCloseTrigger);
      var showSearch, hideSearch;

      showSearch = function(){
        $search.addClass(settings.classNames.searchActive);
        $search.prop("tabIndex", 0).focus();
      }

      hideSearch = function(){
        $search.removeClass(settings.classNames.searchActive);
        $searchTrigger.prop("tabIndex", 0).focus();
      }

      $searchTrigger.on('click', function(ev){
        ev.preventDefault();
        showSearch();
      });

      $searchCloseTrigger.on('click', function(ev){
        ev.preventDefault();
        hideSearch();
      });
    }

    // Menu UI
    initMenu = function ($header) {
      var $menu = $header.find(settings.selectors.menu);
      var $menuTrigger = $header.find(settings.selectors.menuTrigger);
      var $menuCloseTrigger = $menu.find(settings.selectors.menuCloseTrigger);
      var $body = $('body');
      var menuSpeed = $header.data('menu-speed') || 'normal'
      var showMenu, hideMenu;

      showMenu = function(){
        $body.addClass(settings.classNames.headerMenuOpen)
        $menu.stop().fadeIn(menuSpeed, function(){
          $(this).addClass(settings.classNames.menuActive).css('display', '');
        })
        $menu.prop("tabIndex", 0).focus();
      }

      hideMenu = function(){
        $body.removeClass(settings.classNames.headerMenuOpen)
        $menu.stop().fadeOut(menuSpeed, function(){
          $(this).removeClass(settings.classNames.menuActive).css('display', '');
        })
        $menuTrigger.prop("tabIndex", 0).focus();
      }

      $menuTrigger.on('click', function(ev){
        ev.preventDefault();
        showMenu();
      });

      $menuCloseTrigger.on('click', function(ev){
        ev.preventDefault();
        hideMenu();
      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      var $header = $(this);

      initNav($header);
      initSearch($header);
      initMenu($header);

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);



// match-height.js
// 高さ揃え
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setMatchHeight';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setMatchHeight").setMatchHeight(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
    }, options);

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      var $elem = $(this);
      var $target = $elem.find('[data-mh]').length ? $elem : $elem.find('> *');
      $target.matchHeight();

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);



// modal-dialog.js
// モーダル
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setModalDialog';
  var rootClassName = 'js-setModalTrigger';

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setModalTrigger").setModalDialog(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      classNames: {
        dialog: "js-modalDialog",
        fog: "js-modalDialog-fog",
        content: "js-modalDialog-contents",
        open: "js-modalDialog-open",
        closeTrigger: "js-modalDialog-closeTrigger",
        openIcon: this.data('open-icon'),
        closeIcon: this.data('close-icon'),
        slick: 'slick-slider'
      }
    }, options);

    var initModalDialog = function($elem){
      var $body = $('body');
      var contentId = $elem.attr('href');
      var shown = !contentId || $elem.data('dialog-shown');
      var dialogSpeed = $elem.data('dialog-speed') || 'normal';
      var $content, $dialog, $fog, $closeTrigger;
      var createDialog, show, hide;

      if (contentId) {
        $content = $body.find('#' + contentId.replace(/^#/, '')).addClass(settings.classNames.content);
      } else { // href 指定がない場合 .js-setModalTrigger 自体をモーダルコンテンツとみなす
        $content = $elem;
      }

      createDialog = function(){
        var $parent = $content.parent('.' + settings.classNames.dialog);
        if  ($parent.length) {
          $dialog = $parent;
          $dialog.data('is-multiple-triggers', true);
        } else  {
          $dialog = $('<div />').addClass(settings.classNames.dialog);
          $fog = $('<div />').addClass(settings.classNames.fog);
          $closeTrigger = $content.find('.' + settings.classNames.closeTrigger);
          $dialog.append($fog).append($content);
          $body.append($dialog);

          $closeTrigger.on('click', hide);
          $fog.on('click', hide);
        }
      }

      show = function(ev){
        if (ev) ev.preventDefault();
        if (settings.classNames.closeIcon) {
          $elem.parent().addClass(settings.classNames.closeIcon);
          $elem.parent().removeClass(settings.classNames.openIcon);
        }
        $body.addClass(settings.classNames.open);
        $dialog.stop().fadeIn(dialogSpeed, function(){
          var $switchImagesStage = $content.find('.' + settings.classNames.slick);
          var index =  $switchImagesStage.data('slideGoTo');

          $content.attr('tabIndex', '0').focus();

          setTimeout(function(){
            $switchImagesStage.slick('setPosition');
          },100);

          if (typeof index  === 'number') {
            setTimeout(function(){
              $switchImagesStage.slick('setPosition');
              $switchImagesStage.slick('slickGoTo', index);
              $switchImagesStage.data('slideGoTo', null);
            },100);
          }
        });
      }

      hide = function(ev){
        if (ev) ev.preventDefault();
        if (settings.classNames.openIcon) {
          $elem.parent().addClass(settings.classNames.openIcon);
          $elem.parent().removeClass(settings.classNames.closeIcon);
        }
        $dialog.stop().fadeOut(dialogSpeed, function(){
          $body.removeClass(settings.classNames.open);
          if (!$dialog.data('is-multiple-triggers')) $elem.attr('tabindex', '0').focus();
        });
      }

      createDialog();

      if (shown) show();
      if (contentId) $elem.on('click', show);
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initModalDialog($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// more-contents.js
// 汎用 もっと見る
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setMoreContents';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setMoreContents").setMoreContents(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        openTrigger: '.js-setMoreContents-openTrigger',
        closeTrigger: '.js-setMoreContents-closeTrigger',
        target: '.js-setMoreContents-target'
      },
      classes: {
        inited: '-inited',
        active: '-active'
      }
    }, options);

    var initMoreContents = function($more){
      var $openTrigger = $more.find(settings.selectors.openTrigger);
      var $closeTrigger = $more.find(settings.selectors.closeTrigger);
      var $target = $more.find(settings.selectors.target);
      var toggleSpeed = $more.data('more-contents-speed') || 'normal';
      var toggle, show, hide;

      toggle = function(){
        if ($target.is(':hidden')) {
          show();
        } else {
          hide();
        }
      }

      show = function(){
        $openTrigger.parent().slideUp(toggleSpeed);
        $target.slideDown(toggleSpeed, function(){
          $more.addClass(settings.classes.active);
          $openTrigger.css('display', '');
          $target.css('display', '');
        });
      }

      hide = function(){
        $openTrigger.parent().slideDown(toggleSpeed);
        $target.slideUp(toggleSpeed, function(){
          $more.removeClass(settings.classes.active);
          $openTrigger.css('display', '');
          $target.css('display', '');
        });
      }

      $more.addClass(settings.classes.inited);
      $openTrigger.on('click', show);
      $closeTrigger.on('click', hide);
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initMoreContents($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// remove-contents.js
// 汎用 領域を閉じる
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setRemoveContents';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setRemoveContents").setRemoveContents(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        trigger: '.js-setRemoveContents-trigger'
      }
    }, options);

    var initRemoveContents = function($contents){
      var $trigger = $contents.find(settings.selectors.trigger);
      $trigger.on('click', function(ev){
        ev.preventDefault();
        $contents.slideUp(function(){
          $contents.remove();
        });
      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initRemoveContents($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// search-box.js
// 検索ボックス
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setSearchBox';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setSearchBox").setSearchBox(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        root: ".js-setSearchBox",
        input: ".js-setSearchBox_input",
        delete: ".js-setSearchBox_delete",
        searchBoxBody: ".js-setSearchBox_suggest",
        header: ".js-header"
      },
      classNames: {
        suggestActive: "js-suggest-active"
      }
    }, options);

    var initSuggest = function ($elem) {
      var $input = $elem.find(settings.selectors.input);
      var $delete = $elem.find(settings.selectors.delete);
      var $searchBoxBody = $elem.find(settings.selectors.searchBoxBody);
      var deleteAll, show, hide, toggle, isBPSmall, scrollTo;

      $searchBoxBody.hide();

      deleteAll = function (ev) {
        if (ev) ev.preventDefault();
        $input.val("");
        $elem.removeClass(settings.classNames.suggestActive);
        hide();
      }

      show = function (ev) {
        if (ev) ev.preventDefault();
        $searchBoxBody.stop().fadeIn(100);
        $elem.addClass(settings.classNames.suggestActive);
      }

      hide = function (ev) {
        if (ev) ev.preventDefault();
        $searchBoxBody.stop().fadeOut(100);
        $elem.removeClass(settings.classNames.suggestActive)
      }

      toggle = function () {
        $input.val() ? show() : hide();
      }
      isBPSmall = function() {
	    return $(window).width() <= ACJ.breakePoints.small;
	  }
	
      scrollTo = function () {
        if (!isBPSmall() || $input.parents(settings.selectors.header).length) return;
        $("html,body").animate({scrollTop: $input.offset().top});
      }
      $delete.on('click', deleteAll);
      $input.on('keydown keyup', _.throttle(toggle, 100));
      $input.on('focus', scrollTo);
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initSuggest($(this))

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// switch-images.js
// 画像切り替えコンポーネント
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setSwitchImages';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setSwitchImages").setSwitchImages(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        stage: ".js-setSwitchImages_stage",
        controller: ".js-setSwitchImages_controller"
      },
      classNames: {
        active: "-active"
      },
      speed: {
        fast: 200,
        normal: 400,
        slow: 600
      }
    }, options);

    var initGallery = function($gallery){
      var $stage = $gallery.find(settings.selectors.stage);
      if ($stage.children().length <= 1) return;
      var $controller = $gallery.find(settings.selectors.controller);
      var slickStageOption = {
        "adaptiveHeight": true,
        "autoplay": $gallery.data('gallery-autoplay'),
        "fade": $gallery.data('gallery-stage-fade'),
        "speed": settings.speed[ $gallery.data('gallery-stage-speed') ],
        "infinite": $gallery.data('gallery-infinite')
      };
      var slickControllerOption = {
        "fade": $gallery.data('gallery-thumbs-fade'),
        "variableWidth": true,
        "slidesToShow": 5,
        "slidesToScroll": 5,
        "speed": settings.speed[ $gallery.data('gallery-thumbs-speed') ],
        "infinite": $gallery.data('gallery-infinite')
      };

      $stage.slick(slickStageOption);
      $controller.slick(slickControllerOption);

      $stage.on('afterChange', function(ev, slick, currentIndex){
        $controller.slick('slickGoTo', currentIndex)
        $controller.slick('getSlick')
                  .$slides.removeClass(settings.classNames.active)
                  .eq(currentIndex)
                  .attr('tabIndex', 0)
                  .addClass(settings.classNames.active);
      });

      $stage.slick('getSlick').$slides.on('click', function(ev){
        ev.preventDefault();
        $stage.slick('slickNext');
      });

      $controller.on('click', '.slick-slide', function(ev){
        ev.preventDefault();
        var slick = $controller.slick('getSlick');
        var currentIndex = $(ev.currentTarget).data('slick-index') % slick.slideCount;
        $stage.slick('slickGoTo', currentIndex);
      })
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initGallery($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// switch-search-size.js
// 検索結果アイテムのサイズ切り替え
(function($){
  var ACJ = window.ACJ;
  var namespace = 'switchSearchSize';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-switchSearchSize").switchSearchSize(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        trigger: ".js-switchSearchSize-trigger",
        triggerSmall: ".js-switchSearchSize-triggerSmall",
        triggerLarge: ".js-switchSearchSize-triggerLarge",
        triggerNoImage: ".js-switchSearchSize-triggerNoImage",
        target: ".js-switchSearchSize-target",
        targetBody: ".c-searchResultList_body",
        targetMain: ".c-searchResultList_main",
        targetDivision: ".c-articleList_util.l-division, .c-articleList_main > a > .l-division"
      },
      classNames: {
        active: "-active",
        noImage: "-noImage",
        horizontal: "l-division-horizontal",
        vertical: "l-division-vertical",
        colSingleSize: "l-rowCol-1col",
        colTripleSize: "l-rowCol-3col l-rowCol-2col-md l-rowCol-1col-sm"
      }
    }, options);

    var setSwitchSearchSize = function($elem){
      var $triggers = $elem.find(settings.selectors.trigger);
      var $target = $('body').find(settings.selectors.target);
      var $body = $target.find(settings.selectors.targetBody);
      var $main = $target.find(settings.selectors.targetMain);
      var $division = $target.find(settings.selectors.targetDivision);

      var switchSize = {
        "small" : function(){
          clean();
          $body.addClass(settings.classNames.colSingleSize);
          $division.addClass(settings.classNames.horizontal);
        },
        "large" : function(){
          clean();
          $body.addClass(settings.classNames.colTripleSize);
          $division.addClass(settings.classNames.vertical);
        },
        "no-image" : function(){
          clean();
          $body.addClass(settings.classNames.colSingleSize);
          $division.addClass(settings.classNames.vertical);
          $main.addClass(settings.classNames.noImage);
        },
      };

      var clean = function(){
        $body.removeClass(settings.classNames.colSingleSize);
        $body.removeClass(settings.classNames.colTripleSize);
        $division.removeClass(settings.classNames.horizontal);
        $division.removeClass(settings.classNames.vertical);
        $main.removeClass(settings.classNames.noImage);
      }

      $triggers.on('click', function(ev){
        ev.preventDefault();
        var $trigger = $(this);

        $triggers.removeClass(settings.classNames.active);
        $trigger.addClass(settings.classNames.active);
        switchSize[$trigger.data('switch-size')]();
        $body.find('.l-rowCol_item').matchHeight._update();
      });
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      setSwitchSearchSize($(this));

    //  this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// tab.js
// タブ
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setTab';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setTab").setTab(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        tabs: ".js-setTab-tabs",
        trigger: ".js-setTab-tabsTrigger",
        contents: ".js-setTab-contents",
        item: ".js-setTab-contentsItem"
      },
      classNames: {
        inited: "-inited",
        tabActive: "-active",
        contentActive: "-active"
      }
    }, options);

    var initTab = function($elem){

      var isDouble = !!$elem.data('tab-double');
      var $tabs = $elem.find(settings.selectors.tabs)
      var $trigger = $tabs.find(settings.selectors.trigger);
      var $contents = $elem.find(settings.selectors.contents);
      var $item = $elem.find(settings.selectors.item);
      var $tabsBottom, $triggerBottom, onClickTrigger, initCurrent, moveCurrent;

      // 下部タブの生成
      // data-tab-double="true" のときに下部タブを表示する。
      if (isDouble) {
        $tabsBottom = $tabs.clone();
        $triggerBottom = $tabsBottom.find(settings.selectors.trigger);
        $elem.append($tabsBottom);
      }

      // タブの初期位置を決定
      // data-current=true が指定されている場合そのタブを。そうでなければ1個目を初期位置とする。
      initCurrent = function(){
        var $first = $trigger.first();
        var $current = $trigger.filter('[data-current=true]');
        var currentTargetId;
        $current =  $current.length ? $current : $first;
        currentTargetId = $current.find('a').attr('href').replace('#', '');
        moveCurrent(currentTargetId);
      }

      // タブの current 位置を変更
      // 下部タブを表示する場合に連動が必要。
      moveCurrent = function(targetId){
		var currentIndex = $item.filter('#' + targetId).index();
        var move = function($trigger){
          $trigger.removeClass(settings.classNames.tabActive)
                  .eq(currentIndex)
                  .addClass(settings.classNames.tabActive);
        }

        move($trigger);
        if (isDouble) move($triggerBottom);

        $item.removeClass(settings.classNames.contentActive)
             .stop().hide()
             .eq(currentIndex)
             .addClass(settings.classNames.contentActive)
             .stop().show();
      }

      onClickTrigger = function(ev){
        ev.preventDefault();
        var targetId = $(this).find('a').attr('href').replace('#', '');

        moveCurrent(targetId)
      }

      $trigger.on('click', onClickTrigger);
      if (isDouble) $triggerBottom.on('click', onClickTrigger);

      initCurrent();

    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initTab($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// ticker.js
// ティッカー
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setTicker';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setTicker").setTicker(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        slideStage: '.js-setTicker-slideStage',
        trigger: '.js-setTicker-trigger',
        data: '.js-setTicker-data'
      },
      classNames: {
        slide: 'js-setTicker-slide',
        data: 'js-setTicker-data',
        slickSlider: 'slick-slider',
        inited: '-inited',
        open: '-open',
        active: '-active'
      }
    }, options);

    var initTicker = function($ticker){
      var $data = $ticker.find(settings.selectors.data);
      var $trigger = $ticker.find(settings.selectors.trigger);
      var $slide = $data.clone()
                        .attr('class', null)
                        .addClass(settings.classNames.slickSlider);
      var $slideStage = $ticker.find(settings.selectors.slideStage);
      var slickOption = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: $ticker.data('autoplay-speed') || 3000
      }
      var toggle;

      toggle = function(ev){
        ev.preventDefault();

        var isOpen = $ticker.is('.' + settings.classNames.open);
        var methods = isOpen ?
                    {
                      "play": "slickPause",
                      "htmlClass": "removeClass",
                      "fade": "fadeIn",
                      "slide": "slideUp",
                      "slick": slickOption
                    } : {
                      "play": "slickPause",
                      "htmlClass": "addClass",
                      "fade": "fadeOut",
                      "slide": "slideDown",
                      "slick": "unslick"
                    };

        var switchClass = function(){
          $ticker[methods.htmlClass](settings.classNames.open);
          $trigger[methods.htmlClass](settings.classNames.active);
        }

        if (isOpen) switchClass();

        $slide[methods.fade]("fast", function(){
          $slide.slick(methods.slick);
        });
        $data[methods.slide]("fast", function(){
          switchClass();
        });
      }

      $slideStage.append($slide);
      $slide.slick(slickOption);
      $ticker.addClass(settings.classNames.inited);
      $trigger.on('click', toggle);
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initTicker($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);


// toggle-checkboxes.js
// チェックボックスの全選択・全解除
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setToggleCheckboxes';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setToggleCheckboxes").setToggleCheckboxes(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        trigger: ".js-setToggleCheckboxes-trigger"
      },
      classNames: {
        active: "-active"
      }
    }, options);
    var setToggleCheckboxes = function($elem){
      var $triggers = $elem.find(settings.selectors.trigger);
      var $targets = $elem.find(":checkbox");

      var toggle = {
        activate: function(){
          $targets.prop("checked", true);
        },
        cancel: function(){
          $targets.prop("checked", false);
        }
      }

      var checkCheckboxes = function(){
        var checkedLength = $targets.filter(":checked").length;
        var allLength = $targets.length;
        $triggers.removeClass(settings.classNames.active);
        if (checkedLength === 0) {
          $triggers.filter('[data-toggle-check=cancel]').addClass(settings.classNames.active);
        } else if(checkedLength === allLength){
          $triggers.filter('[data-toggle-check=activate]').addClass(settings.classNames.active);
        }
      }

      $targets.on('change', checkCheckboxes)

      $triggers.on('click', function(ev){
        ev.preventDefault();

        var $trigger = $(this);

        toggle[$trigger.data('toggle-check')]();
        $triggers.removeClass(settings.classNames.active);
        $trigger.addClass(settings.classNames.active);
      });
      checkCheckboxes();
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      this[namespace + "Processed"] = true;

      setToggleCheckboxes($(this));

      return this;
    });
  }
})(jQuery);


// video-player.js
// 各種 video API を実行する wrapper
// NOTE: ページ表示後の動画追加ロードには対応していない。

(function($){
  var ACJ = window.ACJ;
  var namespace = 'videoPlayer';
  var rootClassName = 'js-' + namespace;
  var initYoutubeEnded;
  var videos = [];
  var episodeVideos=[];
  var videosList = [];
  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-videoPlayer").videoPlayer(); }
  }


  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var setVideo, createPlayer;
    var initYoutubePlayer;
    var createYoutube, createYouku, resetYouku, createBilibili, resetYouku, createFreeHTML;
    var pauseCarousel, playCarousel;
    var addVideoInterface;

    var settings = $.extend({
    }, options);
    // Video の meta を収集して videos に貯める
    setVideo = function($elem){
        if(settings.episode ==undefined){
                  var video = {};
      video.$target = $elem;
      video.provider = $elem.attr('data-video-provider');
      video.videoId = $elem.attr('data-video-id');
      video.freeHTML = $elem.attr('data-free-html');
			videos.push(video);
			videosList.push(video)
            createPlayer(videosList)
        }  else{
				episodeVideos = [];
             var episodeActive = {};
            episodeActive.$target = $elem;
            episodeActive.provider = $elem.attr('data-video-provider');
            episodeActive.videoId = $elem.attr('data-video-id');
            episodeActive.freeHTML = $elem.attr('data-free-html');
            episodeVideos.push(episodeActive)
            createPlayer(episodeVideos)
        }
    }

    createPlayer = function(videos){
      initYoutubePlayer();
      createYoutube(videos);
      createYouku(videos);
      createBilibili(videos);
      createFreeHTML(videos);
    }

    addVideoInterface = function(elem){
      // Youku の player API はドキュメントどおりに動かないのでスキップ
      var isYouku = $(elem).data('video-provider') === "youku";
        
      elem.playVideo = function(){
        if (!isYouku && elem._player && elem._player.playVideo) elem._player.playVideo();
      }
      elem.pauseVideo = function(){
        if (!isYouku &&elem._player && elem._player.pauseVideo){
          elem._player.pauseVideo();
        } else if (isYouku) {
          resetYouku(elem);
        }
      }
      elem.stopVideo = function(){
        if (!isYouku && elem._player && elem._player.stopVideo) elem._player.stopVideo();
      }
    }

    // Youtube Player 作成の前準備
    initYoutubePlayer = function () {
      if (initYoutubeEnded) return;
      var tag = document.createElement('script');
      var firstScriptTag = document.getElementsByTagName('script')[0];
      tag.src = "https://www.youtube.com/iframe_api";
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      initYoutubeEnded = true;
    }

    createYoutube = function(videos){
      var players = [];
      var states = {
        "-1": 'not started',
        "0": 'finished',
        "1": 'playing',
        "2": 'stoped',
        "3": 'buffering',
        "5": 'cued'
      }
      var createPlayer;
      /* AA implement for player tracking */
      createPlayer = function(video) {
        if (video.inited || video.provider !== "youtube") return;
        var elemId = 'yt-' + video.videoId + _.uniqueId();
        var onPlayerStateChange;
        var onPlayerReady;
        
        onPlayerStateChange = function(state){
          var events = state;
          state = states['' + state.data];
          var video_info = events.target.getVideoData();
          var video_name = "YouTube:"+ video_info.title;
          var video_current_time = events.target.getCurrentTime();
          
          if (state === 'playing' || state === 'buffering'){
        	  pauseCarousel(video.$target);
          }
          if(state === 'playing'){
              if("s" in window && video_current_time < 1){
                  s.Media.open(video_name,events.target.getDuration(),"YouTube Player");
              }
              
              if("s" in window){
                  s.Media.play(video_name,video_current_time);                            
              }
          }
          if (state === 'stoped' || state === 'finished'){
        	  playCarousel(video.$target);
          }
          if (state === 'stoped'){
              if("s" in window){
                  s.Media.stop(video_name,video_current_time);
              }
          }
//          if (state === 'finished'){
//              if("s" in window){
//            	  s.Media.close(video_name);
//              }
//          }
        }
        
        onPlayerReady = function(state){
            var video_info = state.target.getVideoData();
            var video_name = "YouTube:"+ video_info.title;

            if("s" in window){
                s.Media.open(video_name,state.target.getDuration(),"YouTube Player");
            }
        }
        video.$target.html($('<div />').attr('id', elemId));
        video.$target[0]._player = new YT.Player(elemId, {
          videoId: video.videoId,
          playerVars: {rel: 0},
          events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
          }
        });
        /* AA implement for video tracking */
        window.YTPlayer = video.$target[0]._player;
        addVideoInterface(video.$target[0]);
      }
      setTimeout(function(){ _.each(videos, createPlayer);},1000)
      if(!("onYouTubeIframeAPIReady" in window)){
        window.onYouTubeIframeAPIReady = function(){
        _.each(videos, createPlayer);
          if(settings.episode ==1){
          }
        }
      }
    }

    createYouku = function(videos){
    
      var createPlayer = function(video, index) {
        if (video.inited || video.provider !== "youku") return;
        var elemId = 'yk-' + video.videoId + _.uniqueId();
        video.$target.html($('<div />').attr('id', elemId));
        video.$target[0]._player = new YKU.Player(elemId, {
          styleid: '0',
          client_id: window.youku_client_id,
          vid: video.videoId,
          newPlayer: true,
          events: {
	       onPlayStart: function (){
	       video.$target.data('youku-played', true);
	       pauseCarousel(video.$target);
	       }
	    }
       });

        addVideoInterface(video.$target[0]);
        video.inited = true;  
      }

      // create All Youku Player
      _.each(videos, createPlayer);
    }
    
    resetYouku = function(elem){
        var $elem = $(elem);
        if (!$elem.data('youku-played')) return;
        var video = {
          $target: $elem,
          provider: $elem.data('video-provider'),
          videoId: $elem.data('video-id')
        }
        $elem.empty();
        setTimeout(function(){
          createYouku([ video ]);
        },100)
        $elem.data('youku-played', false);
      }
    
    createBilibili = function(videos){
        var createPlayer = function(video, index) {
          if (video.inited || video.provider !== "bilibili") return;
         // video.$target.html($('<embed height="415" width="544" quality="high" allowfullscreen="true" type="application/x-shockwave-flash" src="//static.hdslb.com/miniloader.swf" flashvars="'+video.videoId+'&page=1" pluginspage="//www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash"></embed>'));
          video.$target.html($('<iframe src="//www.bilibili.com/blackboard/player.html?'+video.videoId+'&page=1&as_wide=1" scrolling="no" border="0" frameborder="no" framespacing="0" style="width:100%;height:100%"></iframe>'));
          video.inited = true;
        }
        // create All Bilibili Player
        _.each(videos, createPlayer);

      }
    createFreeHTML = function(videos){
        var createPlayer = function(video, index) {
          if (video.inited || video.provider !== "freehtml") return;
          video.$target.html(video.freeHTML);
          video.inited = true;
        }
        // create All free HTML Player
        _.each(videos, createPlayer);

      }
    pauseCarousel = function(player){
      var $carousel = $(player).parents('.js-setCarousel');
      if ($carousel.length) $carousel.slick("slickSetOption", "autoplay", false, true);
    }

    playCarousel = function(player){
      var $carousel = $(player).parents('.js-setCarousel');
      var autoplay = !!$carousel.data('autoplay');
      if ($carousel.length) $carousel.slick("slickSetOption", "autoplay", autoplay, true);
    }

    this.each(function(){
     if(settings.episode ==1){
            setVideo($(this));
            return this;
        } else {
            if (this[namespace + "Processed"]) return this;
            setVideo($(this));
            this[namespace + "Processed"] = true;
            return this;
        }
    });
    if(settings.episode ==1){createPlayer(episodeVideos);} else{createPlayer(videosList);}

  }
})(jQuery);

// bar.js
// js 発火機構のテスト
(function($){
$(function(){
  if (!$('.js-youkuSandbox').length) return;
  $('.js-youkuSandbox').each(function(){
    var $player = $(this);
    var elemId = $player.attr('id');
    var player = new YKU.Player(elemId,{
      styleid: '0',
      client_id: "7ae53cb402f0b8f9",
      vid: $player.data('video-id'),
      newPlayer: false,
      events: {
        onPlayerReady: function(){ console.log("onPlayerReady", arguments); },
        onPlayStart: function(){ console.log("onPlayStart", arguments); },
        onPlayEnd: function(){ console.log("onPlayEnd", arguments); }
      }
    });

    function playVideo(){
      player.playVideo();
    }

    function pauseVideo(){
      player.pauseVideo();
    }

    $player.parent().find('.js-youkuSandbox_play').on('click', function(ev){
      ev.preventDefault();
      player.playVideo();
    });

    $player.parent().find('.js-youkuSandbox_pause').on('click', function(ev){
      ev.preventDefault();
      player.pauseVideo();
    });
  });
});
})(jQuery);

// bar.js
// スクロールしてもっと見る
(function($){
  var ACJ = window.ACJ;
  var namespace = 'setMoreContentsScroll';
  var rootClassName = 'js-' + namespace;

  // NOTE: script に名前をつけて固定化する案のメモ
  //   ACJ.scripts[namespace] = function(){
  //     $(rootClassName).bar()
  //   }

  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
  ACJ.samples[namespace] = {
    default: function() { $(".js-setMoreContentsScroll").setMoreContentsScroll(); }
  }

  $.fn[namespace] = function(options){
    if (!this.length) return false;

    var settings = $.extend({
      selectors: {
        target: '.c-linkList_item'
      }
    }, options);

    var initMoreContentsScroll = function($more){
      var $window = $(window);
      var $target = $more.find(settings.selectors.target);
      var toggleSpeed = $more.data('more-contents-speed') || 'normal';
      
      if ($target.length < 5) return false;
      
      var contentBottom = $more.offset().top + $more.height();
      var getDisplayBottom = function() {
        return $window.scrollTop() + $window.height();
      }

      $window.on('scroll', _.throttle(function(){
        if(contentBottom - getDisplayBottom() < -100) {
          $target.fadeIn(toggleSpeed);
          $target.css('display', 'inline-block');
        }
      }, 200));
    }

    this.each(function(){
      if (this[namespace + "Processed"]) return this;

      initMoreContentsScroll($(this));

      this[namespace + "Processed"] = true;

      return this;
    });
  }
})(jQuery);

// bar.js
// サイトジャックのサイドを固定
(function($){
	var ACJ = window.ACJ;
	  var namespace = 'setSitejackBg';
	  var rootClassName = 'js-' + namespace;

	  // NOTE: script に名前をつけて固定化する案のメモ
	  //   ACJ.scripts[namespace] = function(){
	  //     $(rootClassName).bar()
	  //   }

	  // NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
	  ACJ.samples[namespace] = {
	    default: function() { $(".js-setSitejackBg").setSitejackBg(); }
	  }

	  $.fn[namespace] = function(options){

	    var $window = $(window);
	    var $siteJackEl = $(".c-siteJack_container");
	    var $languageMessage = $('.c-languageMessage');
	    
	    var $sitejackImgHeight = 0;
	    
	    if($siteJackEl.length > 0 && $(".c-siteJack_container img").length > 0){
	    	$sitejackImgHeight = $(".c-siteJack_container img").offset().top +  $(".c-siteJack_container img").height();
	    }else if($languageMessage.length > 0 && !$languageMessage.is(':hidden')){
	    	$sitejackImgHeight = $languageMessage.height();
	    }
	    var $sitejackBgPostion = "center " + $sitejackImgHeight + "px";

	    var setSitejackImgHeight = function(){
	      $('.g-wrapper').css('background-position', $sitejackBgPostion);
	    }
	    setSitejackImgHeight();

	    $window.on('scroll', _.throttle(function(){
	      if($('.gijp-header_menu').offset()){
	    	  if($window.scrollTop() > $('.gijp-header_menu').offset().top) {
	  	        $('.g-wrapper').css('background-attachment', 'fixed');
	  	        $('.g-wrapper').css('background-position', 'center top');
	  	        $('.gijpC-siteJack').css('position', 'fixed');
	  	      }else{
	  	        $('.g-wrapper').css('background-attachment', 'scroll');
	  	        $('.g-wrapper').css('background-position', $sitejackBgPostion);
	  	        $('.gijpC-siteJack').css('position', 'absolute');
	  	      }
	      }
	    }, 200));
  }
})(jQuery);

//bar.js
//タグの省略
(function($){
var ACJ = window.ACJ;
var namespace = 'setTagCompress';
var rootClassName = 'js-' + namespace;

// NOTE: script に名前をつけて固定化する案のメモ
//   ACJ.scripts[namespace] = function(){
//     $(rootClassName).bar()
//   }

// NOTE: Aigis の markdown が " などを勝手にエスケープしちゃうので苦肉の策で引数の例をすべて列挙
ACJ.samples[namespace] = {
 default: function() { $(".gifl-compressTag").setTagCompress(); }
}

$.fn[namespace] = function(options){

 if (!this.length) return false;

 var initCompressTag = function($elem){
   
   var $trigger = $elem;
   var $triggerItem = $elem.find(".gifl-compressTag_trigger");

   $trigger.on('click', function(ev){

     if($triggerItem.is('.-active')) {
       $("+.gifl-compressTag_items",$trigger).fadeOut();
       $triggerItem.removeClass("-active");
     } else {
       $("+.gifl-compressTag_items",$trigger).fadeIn();
       $triggerItem.addClass("-active");
     }
   });
 }

 this.each(function(){
   if (this[namespace + "Processed"]) return this;

   initCompressTag($(this));

   this[namespace + "Processed"] = true;

   return this;
 });
 
}
})(jQuery);

/* AA implement for tracking facebook */
window.fbAsyncInit = function() {
    FB.Event.subscribe('edge.create',        
        function() {
            console.log("edge.create");
            if("_satellite" in window){
                window._satellite.track("facebookLike");
            }
        }
    );
};

/*--- Code by Adobe ---*/
$(document).ready(function(){
    /*--- Added this script to solve the issue 588 ----*/
$('.c-link_item-disable').on('click', function(e){e.preventDefault()})
$(".c-badge-red").closest(".gl10-badge").css("background", "none")
/* added social media tracking */ 
if("twttr" in window){
    twttr.ready(function (twttr) {
        if("_satellite" in window){
            twttr.events.bind('tweet',function(ev){
                window._satellite.track("twitterTweet");
            });
        }
    });
}
})

//Added for minification

function registerACJForMoreComponents() {
	 ACJ.register(ACJ.samples.setMoreContents.default);
}
function registerACJForCarousel() {
	ACJ.register(ACJ.samples.setCarousel.default);
}


function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}
$(document).ready(function(){
    setTimeout(function(){
		var mYear = $_GET('year'),
    mMonth = $_GET('month');
if((mYear != null && mMonth != "null") && (mMonth != null && mMonth != "null")){
    console.log($("#latestarticles1").offset())
     $('html, body').animate({
        'scrollTop' : $("#latestarticles1").offset().top
    });
}
    }, 2000)
})
