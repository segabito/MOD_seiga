// ==UserScript==
// @name        MOD_Seiga
// @namespace   https://github.com/segabito/
// @description MOD_Seiga
// @include     http://seiga.nicovideo.jp/seiga/*
// @version     0.1.0
// @grant       none
// ==/UserScript==


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

        this.initializeBaseLayout();
        this.initializeDescription();
        this.initializeKnockout();
        this.initializeOther();

        this.initializeSettingPanel();

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
        .list_item_cutout.large {
          height: 194px;
        }
        .list_item_cutout.large a {
          height: 194px;
          overflow: visible;
        }
        .list_item_cutout.large a .illust_info, .list_item_cutout.large a .illust_info:hover {
          bottom: 0px;
        }

        .detail .illust_info .discription.topUserInfo, .detail .illust_info .description.topUserInfo {
          {*margin-right: 390px;*}
          min-height: 65px;

          {*background: #ccc;{* debug *}
        }

        {* ユーザー情報 *}
        #detail .illust_info  #ko_watchlist_info.user {
          {*position: absolute;
          right: 0;
          bottom: 58px;*}
          float: right;
          padding: 4px 4px 0;
          background: #f8f8f8;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
        }
        #detail .illust_info  #ko_watchlist_info.user ul li.thum {
          padding-right: 10px;
          width: 60px;
        }
        #detail .illust_info  #ko_watchlist_info.user ul li.thum img {
          width: 60px;
          box-shadow: 2px 2px 2px #DDD;
        }
        #detail .illust_info #ko_watchlist_info.user ul li.user_name {
          padding-right: 10px;
        }
        #detail .illust_info #ko_watchlist_info.user ul li.user_name h2 {
          display: none;
          {*color: #666666;
          display: inline;
          font-size: 83.3%;
          font-weight: normal;
          margin-right: 5px;*}
        }
        #detail .illust_info #ko_watchlist_info.user ul li {
          display: table-cell;
          vertical-align: middle;
        }
        #detail .illust_info #ko_watchlist_info.user ul li.user_name a {
          color: #000000;
        }
        #detail .illust_info #ko_watchlist_info.user ul li.user_name a strong {
          font-size: 15px;
        }
        #detail .illust_info #ko_watchlist_info.user ul li {
          display: table-cell;
          vertical-align: middle;
        }
        #detail .illust_info #ko_watchlist_info.user ul li.user_favorite {
        }
        #detail .illust_info #ko_watchlist_info.user ul li .btn.big, a.btn.big, button.btn.big {
          padding: 8px 8px;
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
          topUserInfo: true
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
        var $illust_main = $('.illust_main:first').detach();
        $('#detail .illust_info:first').after($illust_main);

        if (this.config.get('topUserInfo')) {
          var $watchlist_info = $('#ko_watchlist_info').detach();
          $('#detail .discription, #detail .discription').addClass('topUserInfo').before($watchlist_info);
        }
      },
      initializeDescription: function() {
        var $description = $('#detail .description, #detail .discription');
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
        $('#detail .description').empty().append($desc);
        $('#detail .discription').empty().append($desc.clone()); // TODO

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
            <div class="item" data-setting-name="topUserInfo" data-menu-type="radio">
              <h3 class="itemTitle">投稿者情報を右上に移動 </h3>
              <label><input type="radio" value="true" > する</label>
              <label><input type="radio" value="false"> しない</label>
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
