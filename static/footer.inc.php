<?php global $dataBlocks, $dataModulesLinks, $version; ?>
    </main>
    <footer class="footer">
      <div class="wrapper">
        <div class="footer__left">
          <p class="footer__copyrights"><?= $dataBlocks['contacts']['copyright'] ?></p>
          <?php if (isset($dataBlocks['social']['items']) && count($dataBlocks['social']['items'])) { ?>
          <div class="social">
              <ul class="social__list">
              <?php foreach($dataBlocks['social']['items'] as $arItem) {?>
              <li class="social__item"><a href="<?= $arItem['link'] ?>" title="<?= quote($arItem["name"])?>"  alt="<?= quote($arItem["name"])?>"  rel="nofollow" target="_blank" class="social__link social__link--<?= $arItem['class']?>"><?= $arItem['name']?></a></li>
              <?php } ?>
              </ul>
          </div>
          <?php } ?>


          <?php if (isset($dataBlocks['contacts']) && is_array($dataBlocks['contacts'])) { ?>
          <?php if (isset($dataBlocks['contacts']["address"]) && !empty($dataBlocks['contacts']["address"])) { ?>
          <p class="footer__adress"><?= $dataBlocks['contacts']["address"]?></p>
          <?php } ?>
          <div class="footer__phones">
                 <a class="footer__phones-link" href="tel:83432270205">+7 (343) 227-02-05</a>
                 <a class="footer__phones-link" href="tel:73432270206">+7 (343) 227-02-06</a>
          </div>
          <?php if (isset($dataBlocks['contacts']["email"]) && !empty($dataBlocks['contacts']["email"])) { ?>
          <div class="footer__emails"><a class="footer__emails-link" href="mailto:<?= $dataBlocks['contacts']["email"]?>"><?= $dataBlocks['contacts']["email"]?></a></div>
          <?php } ?>
          <?php } ?>

          <div class="developers">
              <a class="developers__href" href="https://dextra.ru" target="_blank" title="<?= strip_tags($dxLang[$version]['N_DEVELOPER'])?> Dextra" alt="<?= strip_tags($dxLang[$version]['N_DEVELOPER'])?> Dextra"><span class="developers__dextra">DEXTRA</span><?= $dxLang[$version]['N_DEVELOPER_TEXT']?></a>
          </div>
        </div>
        <?php include_once(TEMPLATES_FOLDER . "/menu/menu_bottom.inc.php"); ?>
      </div>
    </footer>

    <script type="text/javascript">
    function ajaxPopupClose(){
        var t = '<?= $dataModulesLinks["$nick"]?>'; 
        console.log(t); 
        if (history.pushState) {history.pushState(null,null,t)} else {location.assign(t)}
    }
    function ajaxPopup(itemId, itemLink) { //Ajax
        var itemId = parseInt(itemId);
        var module = document.getElementById('card-'+itemId) ? document.getElementById('card-'+itemId).getAttribute('data-module') : false;
        var pageURL = window.location.href;
        var url = new URL(pageURL);
        if (module) {
          url.searchParams.set('id', itemId);
          //url.searchParams.set('action', 'get_news');
  
          url.searchParams.set('action', 'get_'+module);
          url.searchParams.set('ajax', '1');
          console.log(pageURL);
          console.log(itemLink);
  
          document.getElementById('one-'+module+'-content').innerHTML = '';
  
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.setRequestHeader('Content-type', 'text/html; charset=UTF-8');
          xhr.send();
          xhr.onload = function() {
              responseObj = xhr.responseText;
  
              document.getElementById('one-'+module+'-content').innerHTML = responseObj;
  
              var nodelist = document.getElementsByClassName("js-close-popup");
              var i;
              for (i = 0; i < nodelist.length; i++) {
                nodelist[i].setAttribute('onclick', 'ajaxPopupClose();');
              } 
              if (history.pushState){
                  history.pushState(null, null, itemLink);
              }
          };
        } else {return false;}
    }
    </script>
    <div class="hidden-blocks">
      <div class="popup-bg js-popup-overflow"></div>
      <div class="popup" id="one-news">
        <button class="popup__close js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
        <div class="news-popup wis-content" id="one-news-content">
          <h2></h2>
          <data class="news-popup__data"></data>
          <button class="news-popup__btn btn js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
        </div>
      </div>
      <div class="popup" id="call-us">
        <button class="popup__close js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
      </div>

      <div class="popup popup--search" id="search">
        <button class="popup__close js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
        <div class="search__form search__form--popup">
          <form class="js-validate" action="<?= $dataModulesLinks["search"] ?>" method="GET">
            <input type="hidden" name="search" value="1" />
            <input class="search__input" type="text"  name="q" data-req="req" placeholder="Поиск по сайту" maxlength="255" />
            <button class="search__btn" type="submit">Поиск</button>
          </form>
        </div>
      </div>

      <div class="popup" id="projects">
        <button class="popup__close js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
        <div class="project-popup wis-content" id="one-projects-content">
          <h2>Очень-очень большой заголовок новости</h2>
          <data class="news-popup__data">12/07/2019</data>
          <p>Компания была создана 5 июня 2019 года в Екатеринбурге. В нее сейчас входит дочерняя компания «Континент» которая на 100% принадлежит компании LEXX TECHNOLOGY CORP. Компания никогда не была банкротом и не участвовала в разбирательствах по слиянию или поглощению.</p>
          <p>Непосредственно и через наши дочерние компании мы занимаемся производственным бизнесом, инжинирингом и продажей электрооборудования, в частности: систем экономии электроэнергии, системы стабилизации, систем оперативного постоянного тока, систем гарантированного электроснабжения удалённых объектов и источников бесперебойного питания, строительством центров обработки данных, разработкой решений в области электроснабжения, АСУТП, цифровым производством.</p>
          <p>Также, в компанию LEXX TECHNOLOGY CORP входит АО «Инфосеть». Данная компания целиком и полностью осуществляет функции реализации проектов по строительству и дальнейшему обслуживанию стационарных Центров Обработки Данных. </p>
          <div class="project-popup__slider">
            <div class="swiper-container js-projects-popup-slider">
              <div class="swiper-wrapper">
                <div class="swiper-slide"><img class="project-popup__slider-img" src="/img/products-image.jpg" alt=""/></div>
                <div class="swiper-slide"><img class="project-popup__slider-img" src="/img/default-img.jpg" alt=""/></div>
                <div class="swiper-slide"><img class="project-popup__slider-img" src="/img/news/img-1.jpg" alt=""/></div>
                <div class="swiper-slide"><img class="project-popup__slider-img" src="/img/news/img-2.jpg" alt=""/></div>
                <div class="swiper-slide"><img class="project-popup__slider-img" src="/img/news/img-3.jpg" alt=""/></div>
              </div>
              <div class="swiper-navigation">
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
              </div>
            </div>
          </div>
          <p>Компания планирует рост продаж путем расширения производства для выполнения контрактных обязательств крупнейших российских корпораций, дальнейшего развития филиальной сети в России, выхода на рынок СНГ, Европы, Ближнего Востока, Соединенных Штатов, Стран Латинской Америки. Компания стремится быть эксклюзивным представителем крупнейших Европейских и Американских компаний в своей отрасли на российском рынке.</p>
          <button class="news-popup__btn btn js-close-popup" type="button"><?= $dxLang[$version]['BTN_CLOSE'] ?></button>
        </div>
      </div>
    </div>

  <? /*
  <script>
        var nodelist = document.getElementsByClassName("js-close-popup");
        var i;
        for (i = 0; i < nodelist.length; i++) {
          nodelist[i].setAttribute('onclick', "ajaxPopupClose();");
        } 
  </script> */?>
  </body>
  <script src="/static/js/polyfill.js"></script>
  <script src="/static/js/vendor.min.js"></script>
  <script src="/static/js/script.min.js"></script>
  <script>
    <?php 
    $popupItem = array();
    if ($nick=="news" && isset($_REQUEST["nick"]) && strpos($dataModulesLinks["$nick"], $_SERVER['REQUEST_URI']) !== false && $_REQUEST["nick"]):
        $popupItem = sqlRow("
                   SELECT * 
                     FROM `". TABLE_PREFIX ."news` 
                    WHERE `nick`='".trim($_REQUEST["nick"])."'  
                      AND `enabled`=1 AND TO_DAYS(`date`) <= TO_DAYS(NOW()) 
                      AND `version_id`='".$version."' 
                    LIMIT 1
        ");
    elseif ($nick=="projects" && isset($_REQUEST["nick"]) && strpos($dataModulesLinks["$nick"], $_SERVER['REQUEST_URI']) !== false && $_REQUEST["nick"]):
        $popupItem = sqlRow("
                   SELECT * 
                     FROM `". TABLE_PREFIX ."projects` 
                    WHERE `nick`='".trim($_REQUEST["nick"])."'  
                      AND `enabled`=1 
                      AND `version_id`='".$version."' 
                    LIMIT 1
        ");
        $popupItem["gallery"] = array();
    endif;
    if (!empty($popupItem)): ?>
    //ajaxPopup('<?= $item["id"]?>',window.location.href);
    alert('<?= $popupItem["id"]?>');
    document.getElementById('card-<?= $popupItem["id"]?>').click();

    //ajaxPopup('31','kompaniya-simvol-prinyala-uchastie-v-osnaschenii-koncertno-estradnogo-kompleksa-artek-arena-mdc-arte');
    //document.getElementById('card-31').click();

    <?php endif;?>
  </script>
</html>