// ==UserScript==
// @name        MOD_Seiga
// @namespace   https://github.com/segabito/
// @description MOD_Seiga
// @include     http://seiga.nicovideo.jp/seiga/*
// @version     0.0.2
// @grant       none
// ==/UserScript==

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

        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
        

          this.addStyle(__common_css__);

        if (this.config.get('applyCss')) {
          this.addStyle(__css__);
        }
      },
      initializeUserConfig: function() {
        var prefix = 'MOD_Seiga_';
        var conf = {
          applyCss: true
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
