// ==UserScript==
// @name        MOD_Seiga
// @namespace   https://github.com/segabito/
// @description MOD_Seiga
// @include     http://seiga.nicovideo.jp/seiga/*
// @include     http://seiga.nicovideo.jp/tag/*
// @include     http://seiga.nicovideo.jp/illust/*
// @include     http://lohas.nicoseiga.jp/o/*
// @version     0.2.7
// @grant       none
// ==/UserScript==

// ver 0.2.7
// - 全画面表示時に画像クリックでズームが切り替わる対応

// ver 0.2.6
// - サムネイルがカットされなくする対応をタグ検索とイラストトップにも適用

// ver 0.2.5
// - サムネイルがカットされなくする対応。 設定で無効にも出来ます

// ver 0.2.4
// - 右カラム広告のせいで無駄に横スクロールが発生しているのを修正

// ver 0.2.3
// - 市場を近づけた

// ver 0.2.2
// - ホバーしなくてもタイトルと説明文が出るように

// ver 0.2.1
// - タグを説明文の下・説明文の右に置けるように

// ver 0.2.0
// - 動かなくなっていたのでとりあえずまた動くようにした

// ver 0.1.0
// - 設定パネルを追加
// - 投稿者を右上に出せるようにした

// ver 0.0.2
// - ホバーしなくてもタイトルと説明文が出るように
// - 見えないところでタグが増殖していたのを修正

// ver 0.0.1 最初のバージョン

(function() {
  var monkey = (function(){
    'use strict';
    var $ = window.jQuery;


    window.MOD_Seiga = {
      initialize: function() {
        this.initializeUserConfig();
        var path = location.pathname;

        if (path.indexOf('/seiga/') === 0) {
          this.initializeSeigaView();
        } else
        if (path.indexOf('/illust/') === 0) {
          this.initializeIllustTop();
        } else
        if (path.indexOf('/tag/') === 0) {
          this.initializeTagSearch();
        } else
        if (path.indexOf('/o/') === 0) {
          this.initializeFullView();
        }

      },
      initializeSeigaView: function() {
        this.initializeBaseLayout();
        this.initializeDescription();
        this.initializeThumbnail();
        this.initializeKnockout();
        this.initializeOther();

        this.initializeSettingPanel();

        $('body').addClass('MOD_Seiga_View');
        this.initializeCss();
      },
      initializeIllustTop: function() {
        this.initializeThumbnail();
        this.initializeSettingPanel();

        $('body').addClass('MOD_Seiga_Top');
        this.initializeCss();
      },
       initializeTagSearch: function() {
        this.initializeThumbnail();
        this.initializeSettingPanel();

        $('body').addClass('MOD_Seiga_TagSearch');
        this.initializeCss();
      },
       initializeFullView: function() {
        $('body').addClass('MOD_Seiga_FullView');
        this.initializeFullscreenImage();
        this.initializeCss();
      },
      addStyle: function(styles, id) {
        var elm = document.createElement('style');
        elm.type = 'text/css';
        if (id) { elm.id = id; }

        var text = styles.toString();
        text = document.createTextNode(text);
        elm.appendChild(text);
        var head = document.getElementsByTagName('head');
        head = head[0];
        head.appendChild(elm);
        return elm;
      },
      initializeCss: function() {
        var __common_css__ = (function() {/*
          .MOD_SeigaSettingMenu a {
            font-weight: bolder; color: darkblue !important;
          }
          #MOD_SeigaSettingPanel {
            position: fixed;
            bottom: 2000px; right: 8px;
            z-index: -1;
            width: 500px;
            background: #f0f0f0; border: 1px solid black;
            padding: 8px;
            transition: bottom 0.4s ease-out;
            text-align: left;
          }
          #MOD_SeigaSettingPanel.open {
            display: block;
            bottom: 8px;
            box-shadow: 0 0 8px black;
            z-index: 10000;
          }
          #MOD_SeigaSettingPanel .close {
            position: absolute;
            cursor: pointer;
            right: 8px; top: 8px;
          }
          #MOD_SeigaSettingPanel .panelInner {
            background: #fff;
            border: 1px inset;
            padding: 8px;
            min-height: 300px;
            overflow-y: scroll;
            max-height: 500px;
          }
          #MOD_SeigaSettingPanel .panelInner .item {
            border-bottom: 1px dotted #888;
            margin-bottom: 8px;
            padding-bottom: 8px;
          }
          #MOD_SeigaSettingPanel .panelInner .item:hover {
            background: #eef;
          }
          #MOD_SeigaSettingPanel .windowTitle {
            font-size: 150%;
          }
          #MOD_SeigaSettingPanel .itemTitle {
          }
          #MOD_SeigaSettingPanel label {
            margin-right: 12px;
          }
          #MOD_SeigaSettingPanel small {
            color: #666;
          }
          #MOD_SeigaSettingPanel .expert {
            margin: 32px 0 16px;
            font-size: 150%;
            background: #ccc;
          }


        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

        var __css__ = (function() {/*


        {* マイページや投稿へのリンクがあっても、すぐ上にniconico共通のヘッダーがあるのでいらないと思う。ということで省スペース優先で消す。*}
        #header { background: #fff; }
        #header .sg_global_bar {
          display: none;
        }
        #header_cnt { width: 1004px; }

        {* サムネのホバー調整 *}
        .list_item_cutout.middle {
          height: 154px;
          text-align: center;
        }
        .list_item_cutout.middle a {
          height: 100%;
          overflow: visible;
        }
        .list_item_cutout.middle a .illust_info, .list_item_cutout.middle a .illust_info:hover {
          bottom: 0;
        }

        {* サムネのカットなくすやつ。 *}
        .list_item_cutout.mod_no_trim  .thum img {
          display: none;
        }


        .list_item_cutout.mod_no_trim  .thum {
          display: block;
          width: 100%;
          height: calc(100% - 40px);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
          -moz-background-size: contain;
          -webkit-background-size: contain;
          -o-background-size: contain;
          -ms-background-size: contain;
         }

        .list_item.mod_no_trim  .thum img {
          display: none;
        }

        .list_item.mod_no_trim  .thum {
          display: block;
          width: 100%;
          height: 0;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
          -moz-background-size: contain;
          -webkit-background-size: contain;
          -o-background-size: contain;
          -ms-background-size: contain;
        }
        .MOD_Seiga_View .list_item.mod_no_trim  .thum {
        }
        .list_item.mod_no_trim .thum:hover, .list_item_cutout.mod_no_trim .thum:hover {
          background-size: cover;
        }

        .MOD_Seiga_Top .list_item_cutout.mod_no_trim  .thum {
          height: calc(100% - 50px);
        }
        .MOD_Seiga_Top .list_item_cutout.mod_no_trim a {
          height: 100%;
          width: 100%;
        }
        .MOD_Seiga_Top .list_item_cutout.mod_no_trim.large a .illust_info {
          bottom: 0px !important;
          background-color: rgba(60, 60, 60, 1);
          padding: 10px 40px;
        }
        .MOD_Seiga_Top .list_item_cutout.mod_no_trim.large {
          width: 190px;
          height: 190px;
        }
        .MOD_Seiga_Top .rank_box .item_list.mod_no_trim .more_link a {
          width: 190px;
        }

        {* タイトルと説明文・投稿者アイコンだけコンクリートの地面に置いてあるように感じたので絨毯を敷いた *}
        .MOD_Seiga .im_head_bar .inner {
          background-color: #FFFFFF;
          border-color: #E8E8E8;
          border-radius: 5px;
          border-style: solid;
          border-width: 0 0 1px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          display: block;
          margin-top: 20px;
          margin-bottom: 20px;
          margin-left: auto;
          margin-right: auto;
          padding: 15px;
          position: relative;
          width: 974px;
        }

        .MOD_Seiga .im_head_bar .inner .user {
          right: 15px;
        }


        {* タグの位置調整 *}
        .illust_main .mod_tag-top.illust_sub_info {
          padding-bottom: 25px;
          padding-top: 0;
        }


        .illust_sub_info.mod_tag-description-bottom {
          margin-top: 15px;
        }
        .im_head_bar .illust_tag h2 {
          float: left;
          font-size: 116.7%;
          line-height: 120%;
          margin: 4px 10px 0 -2px;
          overflow: hidden;
        }
        .im_head_bar .illust_sub_info  input#tags {
          margin-bottom: 15px;
          margin-top: 5px;
          padding: 4px 10px;
          width: 280px;
        }
        .im_head_bar .illust_sub_info ul li.btn {
          bottom: 15px;
          position: absolute;
          right: 15px;
        }

        {* タグ右上 *}
        .description.mod_tag-description-right {
          float: left;
        }
        .illust_sub_info.mod_tag-description-right {
          width: 300px;
          float: right;
          margin: 0;
        }
        .mod_tag-description-right .tag {
          background: none repeat scroll 0 0 rgba(0, 0, 0, 0);
          border: medium none;
          margin: 0;
        }
        .mod_tag-description-right .tag a {
          padding: 0 5px;
        }
        .mod_tag-description-right .tag li {
        }
        .mod_tag-description-right .tag li a {
          padding: 0 5px 0 0;
          border: 0;
        }
        .im_head_bar .illust_sub_info.mod_tag-description-right ul li.btn.active {
        }
        {* 右下だと被ることがあるので仕方なく *}
        .im_head_bar .illust_sub_info.mod_tag-description-right ul li.btn {
          display: inline-block;
          position: relative;
          bottom: auto; right: auto;
        }

        #ichiba_box {
          width: 1004px;
          margin: 0 auto 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        #content.illust { padding: 0; }

        #related_info .ad_tag { display: none;}

        {* 右カラム広告のせいで無駄に横スクロールが発生しているのを修正 *}
        .related_info .sub_info_side {
          overflow-x: hidden;
        }

        .MOD_Seiga_FullView #content.illust_big .illust_view_big {
          margin: 0 auto;
        }

        .MOD_Seiga_FullView .controll {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .MOD_Seiga_FullView:hover .controll {
          opacity: 1;
        }

        .MOD_Seiga_FullView .illust_view_big img {
          {*transform: scale(1); -webkit-transform: scale(1);
          transition: transform 0.3s ease, -webkit-transform 0.3s ease;*}
        }

        .MOD_Seiga_FullView:not(.mod_noScale) .illust_view_big img {
          position: absolute;
          top: 0;
          left: 0;
                  transform-origin: 0 0 0;
          -webkit-transform-origin: 0 0 0;
        }

        .MOD_Seiga_FullView.mod_contain {
          overflow: hidden;
        }
        .MOD_Seiga_FullView.mod_cover {
        }
        .MOD_Seiga_FullView.mod_contain .illust_view_big img,
        .MOD_Seiga_FullView.mod_cover   .illust_view_big img {
          {*display: none;*}
        }

        .MOD_Seiga_FullView             .illust_view_big {
          background-repeat: no-repeat;
          background-position: center center;
        }
        .MOD_Seiga_FullView.mod_contain .illust_view_big {
          background-size: contain;
        }
        .MOD_Seiga_FullView.mod_cover   .illust_view_big {
          background-size: cover;
        }



*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');


          this.addStyle(__common_css__);

        if (this.config.get('applyCss')) {
          this.addStyle(__css__);
        }
      },
      initializeUserConfig: function() {
        var prefix = 'MOD_Seiga_';
        var conf = {
          applyCss: true,
          topUserInfo: true,
          tagPosition: 'description-bottom',
          noTrim: true
        };

        this.config = {
          get: function(key) {
            try {
              if (window.localStorage.hasOwnProperty(prefix + key)) {
                return JSON.parse(window.localStorage.getItem(prefix + key));
              }
              return conf[key];
            } catch (e) {
              return conf[key];
            }
          },
          set: function(key, value) {
            window.localStorage.setItem(prefix + key, JSON.stringify(value));
          }
        };
      },
      initializeBaseLayout: function() {
        var $description = $('#content .description, #content .discription').addClass('description');
//        var $illust_main = $('.illust_main:first').detach();
//        $('#detail .illust_info:first').after($illust_main);

        var tagPos = this.config.get('tagPosition');
        if (tagPos !== 'default') {
          var $subInfo = $('#detail .illust_sub_info').detach();
          if (tagPos === 'top') {
            $subInfo.addClass('mod_tag-top');
            $('#detail .detail_inner .illust_wrapper .inner').before($subInfo);
          } else
          if (tagPos === 'description-bottom' || tagPos === 'description-right') {
            $subInfo.addClass('mod_tag-' + tagPos);
            $('.description').addClass('mod_tag-' + tagPos);
            $description.after($subInfo);
          }
        }

        $('#related_info').after($('#ichiba_box'));

        if (this.config.get('topUserInfo')) {
//          var $watchlist_info = $('#ko_watchlist_info').detach();
//          $('#detail .discription, #detail .discription').addClass('topUserInfo').before($watchlist_info);
        }
      },
      initializeDescription: function() {
        var $description = $('#content .description, #content .discription');
        if ($description.length < 1) { return; } // 春画で死なないようにするため
        var html = $description.html();

        // 説明文中のURLの自動リンク
        var linkmatch = /<a.*?<\/a>/, links = [], n;
        html = html.split('<br />').join(' <br /> ');
        while ((n = linkmatch.exec(html)) !== null) {
          links.push(n);
          html = html.replace(n, ' <!----> ');
        }
        html = html.replace(/(https?:\/\/[\x21-\x3b\x3d-\x7e]+)/gi, '<a href="$1" target="_blank" class="otherSite">$1</a>');
        for (var i = 0, len = links.length; i < len; i++) {
          html = html.replace(' <!----> ', links[i]);
        }
        html = html.split(' <br /> ').join('<br />');

        var $desc = $('<div>' +  html + '</div>');
        $('#content .description').empty().append($desc);

      },
      initializeThumbnail: function() {
        if (this.config.get('noTrim') !== true) { return; }

        var treg = /^(http:\/\/lohas.nicoseiga.jp\/+thumb\/+.\d+)([a-z\?]*)/;
        $('.list_item_cutout, #main .list_item').each(function() {
          var $this = $(this);
          var $thum = $this.find('.thum');
          var $img  = $thum.find('img');
          var src   = $img.attr('src') || '';
          if ($thum.length * $img.length < 1 || !treg.test(src)) return;
          // TODO: 静画のサムネの種類を調べる
          var url = RegExp.$1 + 'q?';//RegExp.$2 === 't' ? src : RegExp.$1 + 'q?';
          //console.log('url', url);
          $thum.css({'background-image': 'url("' + url + '")'});
          $this.addClass('mod_no_trim');
        });
      },
      initializeKnockout: function() {

      },
      initializeOther: function() {
        $('body').addClass('MOD_Seiga');
      },
      initializeSettingPanel: function() {
        var $menu   = $('<li class="MOD_SeigaSettingMenu"><a href="javascript:;" title="MOD_Seigaの設定変更">MOD_Seiga設定</a></li>');
        var $panel  = $('<div id="MOD_SeigaSettingPanel" />');//.addClass('open');
        var $button = $('<button class="toggleSetting playerBottomButton">設定</botton>');

        $button.on('click', function(e) {
          e.stopPropagation(); e.preventDefault();
          $panel.toggleClass('open');
        });

        var config = this.config;
        $menu.find('a').on('click', function() { $panel.toggleClass('open'); });

        var __tpl__ = (function() {/*
          <div class="panelHeader">
          <h1 class="windowTitle">MOD_Seigaの設定</h1>
          <p>設定はリロード後に反映されます</p>
          <button class="close" title="閉じる">×</button>
          </div>
          <div class="panelInner">
            <!--<div class="item" data-setting-name="topUserInfo" data-menu-type="radio">
              <h3 class="itemTitle">投稿者情報を右上に移動 </h3>
              <label><input type="radio" value="true" > する</label>
              <label><input type="radio" value="false"> しない</label>
            </div>-->

            <div class="item" data-setting-name="noTrim" data-menu-type="radio">
              <h3 class="itemTitle">サムネイルの左右カットをやめる </h3>
              <label><input type="radio" value="true" >やめる</label>
              <label><input type="radio" value="false">やめない</label>
            </div>


            <div class="item" data-setting-name="tagPosition" data-menu-type="radio">
              <h3 class="itemTitle">タグの位置 </h3>
              <label><input type="radio" value="&quot;description-bottom&quot;">説明文の下</label>
              <label><input type="radio" value="&quot;description-right&quot;">説明文の右</label>
              <label><input type="radio" value="&quot;top&quot;">画像の上</label>
              <label><input type="radio" value="&quot;default&quot;">画像の下(標準)</label>
            </div>

            <div class="expert">
              <h2>上級者向け設定</h2>
            </div>
            <div class="item" data-setting-name="applyCss" data-menu-type="radio">
              <h3 class="itemTitle">MOD_Seiga標準のCSSを使用する</h3>
              <small>他のuserstyleを使用する場合は「しない」を選択してください</small><br>
              <label><input type="radio" value="true" > する</label>
              <label><input type="radio" value="false"> しない</label>
            </div>
          </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
        $panel.html(__tpl__);
        $panel.find('.item').on('click', function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = JSON.parse($this.find('input:checked').val());
          console.log('seting-name', settingName, 'value', value);
          config.set(settingName, value);
        }).each(function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = config.get(settingName);
          $this.addClass(settingName);
          $this.find('input').attr('name', settingName).val([JSON.stringify(value)]);
        });
        $panel.find('.close').click(function() {
          $panel.removeClass('open');
        });


        $('#siteHeaderRightMenuFix').after($menu);
        $('body').append($panel);
      },
      initializeFullscreenImage: function() {
        var $body = $('body'), $container = $('.illust_view_big'), $img = $container.find('img'), scale = 1;
        var width = $img.outerWidth, height = $img.outerHeight();
        var $window = $(window);

        var isLargerThanWindow = function() {
          return width > $window.innerWidth() || height > $window.innerHeight();
        };
        var clearCss = function() {
          $body.removeClass('mod_contain').removeClass('mod_cover').removeClass('mod_noScale');
          $container.css({width: '', height: ''});
          $img.css({'transform': '', '-webkit-transform': '', top: '', left: ''});
        };
        var contain = function() {
          clearCss();
          $body.addClass('mod_contain');
          scale = Math.min(
            $window.innerWidth() / $img.outerWidth(),
            $window.innerHeight() / $img.outerHeight()
          );
          var css;
          $img.css({
            'transform':         'scale(' + scale + ')',
            '-webkit-transform': 'scale(' + scale + ')',
            'left':  ($window.innerWidth()  - $img.outerWidth()  * scale) / 2 + 'px',
            'top':   ($window.innerHeight() - $img.outerHeight() * scale) / 2 + 'px'
          });
          $container.width($window.innerWidth());
          $container.height($window.innerHeight());
//          $container.css('background-image', 'url("' + $img.attr('src') + '")');

        };
        var cover = function() {
          clearCss();
          $body.addClass('mod_cover').css('overflow', 'scroll');
          scale = Math.max(
            $window.innerWidth() / $img.outerWidth(),
            $window.innerHeight() / $img.outerHeight()
          );
          $img.css({
            'transform':         'scale(' + scale + ')',
            '-webkit-transform': 'scale(' + scale + ')',
          });
          // ウィンドウサイズの計算にスクロールバーの幅を含めるための措置 おもにwindows用
          $body.css('overflow', '');
        };
        var noScale = function() {
          clearCss();
          $body.addClass('mod_noScale');
          scale = 1;
          $container.css('background-image', '');
        };

        var onclick = function(e) {
          if (e.button > 0) { return; }
          // TODO: クリックした位置が中心になるようにスクロール
          if ($body.hasClass('mod_noScale')) {
            contain();
          } else
          if ($body.hasClass('mod_contain')) {
            cover();
          } else {
            //var x = scale * e.clientX, y = scale * e.clientY;
            noScale();
          }
        };
        var update = function() {
          if ($body.hasClass('mod_contain')) {
            contain();
          } else
          if ($body.hasClass('mod_cover')) {
            cover();
          }
        };

//        $body.addClass('mod_noScale');
        contain();
        $img.on('click', onclick);
        $window.on('resize', update);
        $img.on('load.MOD_Seiga', function() {
          update();
          $img.off('load.MOD_Seiga');
        });
      }
    };

    window.MOD_Seiga.initialize();

  });

  var script = document.createElement("script");
  script.id = "MOD_SeigaLoader";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("charset", "UTF-8");
  script.appendChild(document.createTextNode("(" + monkey + ")()"));
  document.body.appendChild(script);

})();
