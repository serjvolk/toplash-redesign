$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_1045 = 1044.98;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_872 = 871.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		h = $(window).outerHeight();
		initSlider();
		dropdownResize();
		moveDOMelement();
	});

	// Действия при скролле
	$(window).scroll(function(){
  	let scrollTop = $(window).scrollTop();
  	startingVideoOnScroll(scrollTop);
  	fixedElementOnScroll(scrollTop);
  	fixedCardOnScroll(scrollTop);
	});

	@@include('_select2-user.js');
	@@include('_scroll.js');
	@@include('_popup.js');
	@@include('_validation.js');

//////////////////////// Показать картинки отзывов ////////////////////////////

let $activeSlidersReviews = null;
// Открыть слайдер с картинками отзывов
$(".js-detect-grid .imageFeedback__item").click(function(){
	if($activeSlidersReviews === null){
		let $parent = $(this).closest('.js-detect-grid');
		let index = $(this).index();

		$parent.removeClass('imageFeedback').addClass("isSliderReviews");
		$parent.find('video').prop('muted', false).prop('controls', true);
		$body.addClass('lock');
		$('.feedbackSliderControls').addClass('active');
		$activeSlidersReviews = $parent;

		$parent.slick({
			prevArrow: $('.feedbackSliderControls .sliderBtn.btn-prev'),
			nextArrow: $('.feedbackSliderControls .sliderBtn.btn-next'),
			initialSlide: index
		});
		/*$parent.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			$parent.find('video').get(0).pause();
		});*/
	}
});

// Действие для закрытия слайдера
$(".js-close-SliderReviews").click(function(){
	closeSliderReviews();
});

// Действие для закрытия слайдера
$(document).on("click", function(e){
	if($activeSlidersReviews !== null && $(e.target).hasClass('imageFeedback__wrap')){
		closeSliderReviews();
	}
});

// Закрыть слайдер с картинками отзывов
function closeSliderReviews() {
	$activeSlidersReviews.slick('unslick');
	$activeSlidersReviews.removeClass('isSliderReviews').addClass("imageFeedback");
	$activeSlidersReviews.find('video').prop('muted', true).prop('controls', false);
	$activeSlidersReviews.find('video').get(0).pause();
	$('.feedbackSliderControls').removeClass('active');
	$body.removeClass('lock');
	$activeSlidersReviews = null;
}

/////////////////////////////// Простые слайдеры  //////////////////////////////////////

// Отследить инициализацию слайдера в корзине
$('.js-cartSlider').on('init', function(event, slick){
  $('.js-cartSlider-slideCount').text(slick.slideCount);
});

// Слайдер в корзине
$('.js-cartSlider').slick({
	prevArrow: $('.js-cartSlider-control.btn-prev'),
	nextArrow: $('.js-cartSlider-control.btn-next'),
});


$('.js-cartSlider-slideCount').text();
// Узнать текущий слайд для слайдера в корзине
$('.js-cartSlider').on('afterChange', function(event, slick, currentSlide, nextSlide){
	let currentNumberSlide = (currentSlide ? currentSlide : 0) + 1;
	$('.js-cartSlider-currentSlide').text(currentNumberSlide);
	$('.js-cartSlider-slideCount').text(slick.slideCount);
});

// Слайдер-банер на главной странице
$('.js-slider-baner').slick({
	prevArrow: $('.js-slider-baner-parent .sliderBtn.btn-prev'),
	nextArrow: $('.js-slider-baner-parent .sliderBtn.btn-next'),
	dots: true,
	autoplay: true,
	autoplaySpeed: 3500
});

// Слайдер в начале страницы "страница отзывы"
$('.js-sliderBig-reviews').slick({
	prevArrow: $('.js-sliderBig-reviews-parent .sliderBtn.btn-prev'),
	nextArrow: $('.js-sliderBig-reviews-parent .sliderBtn.btn-next'),
	//autoplay: true,
	//autoplaySpeed: 3500,
	dots: true
});

let isInitSlick = false;
// Слайдер в блоке useful
function initSlider() {
	if(w < BREAKPOINT_md2){
		if(isInitSlick === false){
			isInitSlick = true;
			$('.js-slider-useful').slick({
				slidesToShow: 2,
				prevArrow: $('.useful .sliderBtn.btn-prev'),
				nextArrow: $('.useful .sliderBtn.btn-next'),
				responsive:[
					{ 
						breakpoint: BREAKPOINT_552,
						settings: {
							slidesToShow: 1,
						}
					}
				]
			});
		}
	}else{
		if(isInitSlick === true){
			isInitSlick = false;
			$('.js-slider-useful').slick('unslick');
		}
	}
}
initSlider();

//////////////// Слайдер на главной странице: Самые популярные продукты Toplash ////////////////////

// Инициализация слайдера
$('.js-slider-popular').slick({
	slidesToShow: 3,
	prevArrow: $('.popular .sliderBtn.btn-prev'),
	nextArrow: $('.popular .sliderBtn.btn-next'),
	responsive:[
		{ 
			breakpoint: BREAKPOINT_1045,
			settings: {
				slidesToShow: 2,
			}
		},{ 
			breakpoint: BREAKPOINT_552,
			settings: {
				slidesToShow: 1,
			}
		}
	]
});

if(isMobile === false){
	// Создать hover области для картинок внутри слайдера .js-slider-popular
	$(".js-hover-image-slider .useful__imageWrap").each(function(){
		let countImage = $(this).find('img').length;
		if(countImage > 1){
			$(this).addClass('initImage');
			$(this).find('img:first-child').addClass('active');
			let areas = '<div class="useful__hoverArea">';
			let dots = '<div class="useful__dots">';
			for (let i = 0; i < countImage; i++) {
				areas += "<span></span>";
				dots += i === 0 ? "<span class='active'></span>" : "<span></span>";
			}
			areas += '</div>';
			dots += '</div>';
			$(this).closest('.useful__image').append(areas + dots);
		}
	});

	// В слайдере при ховере на картинку, показываем другую картинку
	$(document).on("mouseenter", ".js-hover-image-slider .useful__hoverArea > span", function(){
		let index = $(this).index();
		let parent = $(this).closest('.useful__image');
		parent.find('img').removeClass('active');
		parent.find('.useful__imageWrap img:eq('+index+')').addClass('active');

		parent.find('.useful__dots span').removeClass('active');
		parent.find('.useful__dots span:eq('+index+')').addClass('active');
	});
}

// Функция ниже позволяет отфильтровать слайды пу указанному классу (.filter)
$(".js-filter-slider .scroll__item a").click(function(e){
	e.preventDefault();
	let filter = $(this).data('filter');
	$(".js-filter-slider .scroll__item a").removeClass('btn-2_active');
	$(this).addClass('btn-2_active');

	if(filter === 'all'){
		$('.js-slider-popular').slick('slickUnfilter').slick('slickFilter', '.useful__col'); // Отменяем фильтровку
	}else{
		$('.js-slider-popular').slick('slickUnfilter').slick('slickFilter', '.'+filter); // Фильтруем
	}

	let slickListWidth = $(".js-slider-popular .slick-list").width();
	let slickTrackWidth = $(".js-slider-popular .slick-track").width();
	if(slickTrackWidth < slickListWidth){
		$('.popular .sliderBtn').hide();
	}else{
		$('.popular .sliderBtn').show();
	}
});

//////////////////// Слайдер в начале страницы "СТРАНИЦА ТОВАРА" ////////////////////////

// Узнать ID слайда с презентацией
let slidePresentationID = $('.sliderBig__item .js-presentation-video').parent().index();

// Инициализация слайдера
$('.js-sliderBig').slick({
	prevArrow: $('.product .sliderBtn.btn-prev'),
	nextArrow: $('.product .sliderBtn.btn-next'),
	//autoplay: true,
	//autoplaySpeed: 3500,
	dots: true
});

// Отслеживаем действие -> перелистывание слайда
$('.js-sliderBig').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  $('.js-scrollPreview .scrollPreview__item').removeClass('active');
  $('.js-scrollPreview .scrollPreview__item:eq('+nextSlide+')').addClass('active');
  let scrollLeft = $('.js-scrollPreview').scrollLeft();
  let widthScroll = parseInt($('.js-scrollPreview').width());
  nextSlide = parseFloat(nextSlide);

  let startVisibility = scrollLeft;
  let endVisibility = scrollLeft + widthScroll;

  let leftItem = nextSlide * 96;
  let rightItem = (nextSlide * 96) + 80;

  let setScroll = false;
  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
  if(leftItem < startVisibility){setScroll = leftItem;}

  if(setScroll !== false){
  	$('.js-scrollPreview').animate({scrollLeft: setScroll}, 300);
  }

  // Логика автовоспроизведения видео
  let $video = $(slick.$slides.get(nextSlide)).find('video');
  let isSlideWithVideo = $video.length;
  if(isSlideWithVideo === 1){
  	$video.trigger('play');
  }else{
  	$('.sliderBig__item video').trigger('pause');
  }
});

// Клик по слайду в превью блоке
$(".js-scrollPreview .scrollPreview__item").click(function(){
	var index = $(this).index();
	$('.js-sliderBig').slick('goTo', index);
});

// Клик по "как пользоваться", тоесть открыть презентационное видео
$(".js-view-presentation-video").click(function(){
	$('.js-sliderBig').slick('goTo', slidePresentationID);
});

/////////////////////////////////////// Отзывы //////////////////////////////////////////

// Просчитываем где отображать кнопку показать больше
$(".cardReviews__text .textLay").each(function(){
	var lh = parseFloat($(this).css('line-height'));
	if($(this).height() > (lh * 4)){
		$(this).closest(".cardReviews__text").addClass('hidden');
		$(this).closest(".cardReviews").find('.cardReviews__button').addClass('js-hide-text');
	}
});

// Нажатие на кнопку показать больше
$(document).on("click", ".cardReviews .js-hide-text", function(){
	$(this).toggleClass('active');
	$(this).closest(".cardReviews__content").find(".cardReviews__text").toggleClass('hidden');
});


///////////////////////////// Логика бургер-меню ///////////////////////////////////////

const $burger = $(".js-burger");
const $menu = $(".js-menu");
const $overlayMenu = $(".js-overlayMenu");
let isActiveMenu = false;
// Открыть/закрыть меню / Скрыть меню при клике вне блока меню
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	let isBurger = $burger.has(e.target).length === 1 ? true : false;
	let isChildMenu = $menu.has(e.target).length === 1 ? true : false;
	let isMenu = $(e.target).hasClass("js-menu");
	
	let newStateMenu = isActiveMenu;
	if(isBurger){
		newStateMenu = !newStateMenu;
	}else if(isBurger === false && isMenu === false && isChildMenu === false){
		newStateMenu = false;
	}

	if(newStateMenu !== isActiveMenu){
		isActiveMenu = newStateMenu;
		$burger.toggleClass('active', isActiveMenu);
		$menu.toggleClass('active', isActiveMenu);
		$overlayMenu.toggleClass('active', isActiveMenu);
		if(w < BREAKPOINT_md4){$body.toggleClass('lock', isActiveMenu);}
	}
});

///////////////////////// Блок историй (подобие инстаграм) /////////////////////////////

const TIME_SLIDE_DURATION = 5000; // Длительность слайда с картинкой
let isInitStoriesSlider = false;
// Открыть истории
$('.js-stories').click(function(e){
	let isItem = $(e.target).closest('.about__item').length;
	if(isItem === 1){ // Показать сторис
		let id = $(e.target).closest('.about__item').data('id');
		let idCount = $('.stories__item[data-id="'+id+'"]').not('.slick-cloned').length;
		let index = $('.stories__item[data-id="'+id+'"]').not('.slick-cloned').index();

		$('.js-stories').addClass('active');
		$body.addClass('lock');
		
		if(isInitStoriesSlider === false){
			$('.js-sliderStories').slick({
				prevArrow: $('.stories__body .sliderBtn.btn-prev'),
				nextArrow: $('.stories__body .sliderBtn.btn-next'),
				initialSlide: index,
			})
			$('.js-sliderStories').slick('goTo', index);
		}else{
			$('.js-sliderStories').slick('goTo', index-1);
		}
		isInitStoriesSlider = true;
	}else{ // Скрыть сторисы
		if($(e.target).hasClass("stories__body")){
			closeStories();
		}
	}
});

let $lastVideoPlaying = null;
// Переключение на новый слайд
$('.js-stories').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	let currentID = $(slick.$slides.get(nextSlide)).data('id');
	let subslideCount = $('.stories__item[data-id="'+currentID+'"]').not('.slick-cloned').length;
	let subSlideID = 0;
	if(subslideCount !== 1){subSlideID = $(slick.$slides.get(nextSlide)).data('sub-id');}

	// Определяем наличие видео в слайде
	let $video = $(slick.$slides.get(nextSlide)).find('video');
	let isSlideWithVideo = $video.length;
	let duration = null;
	if($lastVideoPlaying !== null){
		$lastVideoPlaying.get(0).pause();
	  $lastVideoPlaying = null;
	}
	if(isSlideWithVideo === 1){
		duration = $video[0].duration * 1000;
		$video[0].currentTime = 0;
		$video.get(0).play();
		$lastVideoPlaying = $video;
	}

	let delay = duration > 0 ? duration : TIME_SLIDE_DURATION;
	isStoped = false;
	$('.js-timescale').remove();
	$('.js-sliderStories').append(addTimescale(subslideCount, subSlideID, delay));
	calcScrollbarStories(currentID);
	autoSlide(delay);
});

// Логика вертикального скроллбара
function calcScrollbarStories(currentID) {
	let h = $(window).height();
	let heightItem = $('.about__item[data-id="'+currentID+'"]').outerHeight();
	let marginTop = heightItem * currentID;
	let itemStart = (h / 2) - (heightItem / 2) - 8;
	let setScroll = marginTop - itemStart;
	$('.js-stories .scroll__body').animate({scrollTop: setScroll}, 300);
}

let timeoutNextSlide = null, startSlideTime;
// Автопереключение слайдов
function autoSlide(delay = TIME_SLIDE_DURATION) {
	startSlideTime = new Date().getTime();
	clearTimeout(timeoutNextSlide);
	timeoutNextSlide = setTimeout(function() {
		$('.js-sliderStories').slick('slickNext');
	}, delay);
}

// Создание панели управления слайдом
function addTimescale(count, itemActive, duration = TIME_SLIDE_DURATION) {
	let isMuted = storiesVideoMuted === false ? "" : "active";

	let html = '<div class="timescale js-timescale" style="--stories-duration: '+duration+'ms;">';
		html += '<div class="timescale__lines">';
			for (var i = 0; i < count; i++){
				let timescale_leftClass = i === itemActive ? "active" : i < itemActive ? "complete" : "";
				html = html + '<div class="timescale__item"><div class="timescale__left '+timescale_leftClass+'"></div></div>';
			}
		html += '</div>';
		html += '<div class="f-jcsb-aic mt-16">';
			html += '<div class="d-flex">';
				html += '<svg class="timescale__control svgWithState w24 js-stories-pause">';
					html += '<use class="st-1" xlink:href="img/sprite/icons-sprite.svg#pause"/>';
					html += '<use class="st-2" xlink:href="img/sprite/icons-sprite.svg#play_w16in24"/>';
				html += '</svg>';

				html += '<svg class="timescale__control svgWithState volumn w24 js-stories-volumn '+isMuted+'">';
					html += '<use class="st-1" xlink:href="img/sprite/icons-sprite.svg#volumn-on"/>';
					html += '<use class="st-2" xlink:href="img/sprite/icons-sprite.svg#volumn-off"/>';
				html += '</svg>';
			html += '</div>';
			html += '<svg class="timescale__control close w24 js-close-stories">';
				html += '<use xlink:href="img/sprite/icons-sprite.svg#close"/>';
			html += '</svg>';
		html += '</div>';
	html += '</div>';
	return html;
}
	
// Закрыть сторисы
$(document).on("click", ".js-close-stories", function(){
	closeStories();
});

// Закрыть сторисы
function closeStories() {
	clearTimeout(timeoutNextSlide);
	if($lastVideoPlaying !== null){
		$lastVideoPlaying.get(0).pause();
	  $lastVideoPlaying = null;
	}
	$('.js-stories').removeClass('active');
	$body.removeClass('lock');
}

let isStoped = false, leftTimeSlide;
// Остановить автопрокрутку сторисов
$(document).on("mousedown", ".js-stories-pause", function(e){
	if(isStoped === false){
		isStoped = true;
		$(this).addClass('active');
		$('.timescale__left').addClass('pause');
		let nowTime = new Date().getTime();
		leftTimeSlide = nowTime - startSlideTime;
		clearTimeout(timeoutNextSlide);
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).pause();
		}
	}else{
		isStoped = false;
		$(this).removeClass('active');
		$('.timescale__left').removeClass('pause');
		if($lastVideoPlaying !== null){
			$lastVideoPlaying.get(0).play();
		}
		let durationSlide = $lastVideoPlaying !== null ? $lastVideoPlaying.get(0).duration * 1000 : TIME_SLIDE_DURATION;
		autoSlide(durationSlide - leftTimeSlide);
	}
});

let storiesVideoMuted = false;
// Включение/Отключение звука на видео
$(document).on("click", ".js-stories-volumn", function(e){
	storiesVideoMuted = !storiesVideoMuted;
	$('.stories__item video').prop('muted', storiesVideoMuted);
	$(this).toggleClass('active');
});

///////////////////////////// Видео в блоке serum ///////////////////////////////////////

let animateItem = $('.js-animate-item');
let videoSerum = $('.js-video-serum');
let btnControlVideoSerum = $(".js-toggle-video-serum");
let isPlayedVideoSerum = null;
 // Запустить видео при доскролле до видео
function startingVideoOnScroll(scrollTop) {
	if(animateItem.length === 0){return false;}

	let topAnimateItem = animateItem.offset().top - h;
	if(scrollTop > (topAnimateItem + 40)){
		if(isPlayedVideoSerum === null){
			isPlayedVideoSerum = true;
			playStopVideoSerum();
		}
	}
}

// Запустить/Остановить видео в блоке serum
function playStopVideoSerum() {
	let stateButtonText = isPlayedVideoSerum === true ? "Пауза" : "Воспроизвести";
	if(isPlayedVideoSerum === true){
		videoSerum.get(0).play();
	}else{
		videoSerum.get(0).pause();
	}
	btnControlVideoSerum.find('span').text(stateButtonText);
	btnControlVideoSerum.find('svg').toggleClass('active', isPlayedVideoSerum);
}

// Клик по "Пауза" / "Воспроизвести" видео в блоке serum
btnControlVideoSerum.click(function(){
	isPlayedVideoSerum = isPlayedVideoSerum === true ? false : true;
	playStopVideoSerum();
});

//////////////////////////////////// Корзина ///////////////////////////////////////////

$('.js-mask-tel').mask("+7(999)999-99-99"); // Маска для телефонов
$('.js-mask-card').mask("9999-9999-9999-9999"); // Маска для банковских карточек

let isFixedTotality = false;
let totalityFixed = $('.js-totalityFixed');
let anchorTotalityFixed = $('.js-totalityFixed-anchor');
// Фиксируем блок пожтверждения заказа при доскролле до него
function fixedCardOnScroll(scrollTop) {
	if(totalityFixed.length === 0 || w > BREAKPOINT_md3){return false;}

	let topAnchor = anchorTotalityFixed.offset().top;
	let aF = scrollTop+h;
	if((aF > topAnchor && isFixedTotality === false) || (aF < topAnchor && isFixedTotality === true)){
		isFixedTotality = !isFixedTotality;
		totalityFixed.toggleClass('active', isFixedTotality);
	}
}

// В зависимости от разрешения экрана меняем расположение блоков местами
var movementBlockStateDESC = true;
function moveDOMelement (){
	if(w < BREAKPOINT_md3 && movementBlockStateDESC === true){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-desc').data('id');
			$(this).appendTo('.js-movement-block-to-mob[data-id='+id+']');
			movementBlockStateDESC = false;
		});
	}else if(w > BREAKPOINT_md3 && movementBlockStateDESC === false){
		$(".js-movement-block").each(function(){
			var id = $(this).closest('.js-movement-block-to-mob').data('id');
			$(this).appendTo('.js-movement-block-to-desc[data-id='+id+']');
			movementBlockStateDESC = true;
		});
	}
}
moveDOMelement();

//////////////////////////////// Логика колеса-крутилки ///////////////////////////////

// Получить случайное число в диапазоне 
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

var chance = [["10%", 30],["275 p.", 30],["8%", 10],["230 p.", 30],["5%", 1],["20%", 5],["180 p.", 10],["12%", 30],["115 p.", 1],["450 p.", 5]];
// Считаем вероятности и выдаем дроп ID
function giveDrop() {
	var lengthChance = 0, dropID;
	var lineChance = [0];
	for(var i = 0; i < chance.length; i++){
		lengthChance += chance[i][1];
		lineChance[i+1] = lengthChance;
	}
	var randomNumber = getRandomIntInclusive(1, lengthChance);
	for (var i = 1; i < lineChance.length; i++) {
		if(randomNumber > lineChance[i-1] && randomNumber <= lineChance[i]){
			dropID = i - 1;
		}
	}
	return dropID;
}

// Возвращает градусы на которых должно остановиться колесо
function degWheel(dropID) {
	var dropStep = 360 / chance.length;
	var percent10 = dropStep * 20 / 100;
	var dropDEGstart = (dropID * dropStep) + percent10;
	var dropDEGend = ((dropID * dropStep) + dropStep) - percent10;
	var dropDEG = getRandomIntInclusive(Math.round(dropDEGstart), Math.round(dropDEGend));
	return dropDEG;
}

// Узнать силу вращения
function speedWheel() {
	if(w < BREAKPOINT_md4){
		var heightRunner = $('#js-runner').width();
		var heightParent = $('#js-gradient').width();
	}else{
		var heightRunner = $('#js-runner').height();
		var heightParent = $('#js-gradient').height();
	}
	
	var diffRunner = heightParent - heightRunner;
	var speed = diffRunner * 100 / heightParent;
	return Math.round(speed);
}

const minWheel = 5;  // Минимально кругов при минимальной скорости
const maxWheel = 30; // Максимально кругов при максимальной скорости
const minTime = 5000; // Минимальное время вращения
const maxTime = 7000; // Максимальное время вращения
// Высчитываем время вращения и конечное аоложение колеса
function positionWheel(speed, dropDEG) {
	var diff = (maxWheel - minWheel) / 100;
	var wheelCount = Math.round(minWheel + (diff * speed));
	var totalDeg = (wheelCount * 360) + dropDEG;

	var diffTime = (maxTime - minTime) / 100;
	var timeCount = Math.round(minTime + (diffTime * speed));
	return [timeCount, totalDeg];
}

// Последовательные действия для колеса-крутилки
function sequentialActionsWheel() {
	blockWheel = true;
	var dropID = giveDrop();
	var dropDEG = degWheel(dropID);
	var speed = speedWheel();
	var position = positionWheel(speed, dropDEG);

	// Вращаем колесо
	$("#animated").attr("style", "--circle-deg:"+position[1]+"deg; --circle-time:"+position[0]+"ms;");
	$("#animated").attr("class", "active");

	// Печатаем значение выпавшего дропа в нужные места и показываем попап "Вы получили скидку"
	$('#js-sv-drop-id').val(dropID);
	$('#js-sv-drop-value').val(chance[dropID][0]);
	$('#js-discount-type').text(chance[dropID][0]);
	setTimeout(function() {
		openPopup('prizeReceive');
	}, position[0] + 100);
	
}

// Нажатие на кнопку "Вращать"
$("#js-stopRunner").click(function(e){
	if(blockWheel === false){
		$('#js-runner').addClass('paused');
		sequentialActionsWheel();
	}
});

var blockWheel = true;
// Запускаем все необходимое для правельной работы колеса-крутилки
function initWheel() {
	if(w < BREAKPOINT_md4){
		$('#js-runner').addClass('activeMOB');
	}else{
		$('#js-runner').addClass('activeDESC');
	}
	blockWheel = false;
}

///////// Логика попапа ухода со страницы, получить подарок, анимировать title  //////////////

const startDelay = 60; // задержка (сек.) - После открытия сайта
const leavingDelay = 60; // задержка (сек.) - После ухода с сайта

// Паказать скрыть анимированно всплывашку "Ваш подарок"
function showGift() {
	if(localStorage.getItem('get-gift') == null){
		if($('.animate-display').hasClass('show-anim')){
			$('.animate-display').addClass('closing-anim');
			setTimeout(function() {
				$('.animate-display').removeClass('show-anim closing-anim');
			}, 300);
		}else{
			$('.animate-display').addClass('show-anim');
		}
	}
}

// Скрыть всплывашку "Ваш подарок"
$(".targetPrize").click(function(){
	showGift();
});

var bbW = false;
// Oткрыть попап с лотереей
$('.js-open-popup-lottery').on(isMobile ? "touchend" : "mousedown", function (e) {
	if($(e.target).hasClass('targetPrize') === false){
		initWheel();
		openPopup('lottery');
		bbW = true;
		$('.animate-display').addClass('closing-anim');
		setTimeout(function() {
			$('.animate-display').removeClass('show-anim closing-anim');
		}, 300);
	}
});

var popupLeaving = 'userLeaving';
var existUser = true;
var timer_llk;
var blockMouseLeaving = true;
setTimeout(function() {blockMouseLeaving = false; }, 10000);
// Отслеживаем уход со страницы
$(document).on("mouseleave", function(){
	if(blockMouseLeaving === true){return false;}
	if($('#'+popupLeaving).length !== 0 && $("#prizeReceive").hasClass('open') === false){
		if(sessionStorage.getItem('vizit') == null){
			if($('#'+popupLeaving).hasClass('open') === false){
				openPopup(popupLeaving);
			}
			sessionStorage.setItem('vizit', 'vizit');
		}
		existUser = false;
		clearTimeout(timer_llk);
		timer_llk = setTimeout(function() {noUser();}, leavingDelay * 1000);
	}
});

$(document).on("mouseenter", function(){
	if(existUser === false){
		existUser = true;
	}
});

// Запоминаем если пользователь получил подарок
$(".js-get-gift").submit(function(){
	localStorage.setItem('get-gift', 'exist');
});

// Пользователь ушел со страницы и отсутствовал минуту
function noUser() {
	if(existUser === false){
		if($('.animate-display').hasClass('show-anim') === false && bbW === false){showGift();}
		if(animTitle === false){animateTitle();}
	}
}

var titleDefault = $('title').text();
var titleAnimate = $('title').data('title');
if(titleAnimate != undefined){
	titleAnimate = titleAnimate.split("||");
}
var titleLoop = 0;
var animTitle = false;
// Анимируем title
function animateTitle() {
	if(localStorage.getItem('get-gift') == null){
		if(titleAnimate == undefined){return false;}
		$('title').text(titleAnimate[titleLoop]);
		titleLoop++;
		if(titleLoop >= titleAnimate.length){titleLoop = 0;}
		if(existUser === false){
			animTitle = true;
			setTimeout(function() {animateTitle();}, 1500);
		}else{
			animTitle = false;
			$('title').text(titleDefault);
		}
	}
}

// Показать через минуту всплывашку про подарок
if($('.animate-display').length !== 0){
	setTimeout(function() {if(!$('.animate-display').hasClass('show-anim')){showGift();}}, startDelay * 1000);
}

///////////////////////////////////// Прочее ///////////////////////////////////////////

let isLess_md4;
// Логика dropdown
function dropdown() {
	const DROPDOWN_SLIDE_DURATION = 300;
	isLess_md4 = w < BREAKPOINT_md4;
	// Открыть/закрыть dropdown
	$('.js-dropdown-head').click(function(){
		if($(this).closest('.js-dropdown-item').hasClass('less-md4') && w > BREAKPOINT_md4){return false;}
		$(this).closest('.js-dropdown-item').toggleClass('active');
		let active = $(this).closest('.js-dropdown-item').hasClass('active');
		let body = $(this).closest('.js-dropdown-item').find('.js-dropdown-body');
		active ? body.slideDown(DROPDOWN_SLIDE_DURATION) : body.slideUp(DROPDOWN_SLIDE_DURATION);
	});

	// Отследить состояние dropdown
	function initDropdown(slideDuration) {
		let duration = slideDuration === undefined ? DROPDOWN_SLIDE_DURATION : slideDuration;
		$(".js-dropdown-item").each(function(){
			if($(this).hasClass('less-md4') && w > BREAKPOINT_md4){return false;}
			let active = $(this).hasClass('active');
			let body = $(this).find('.js-dropdown-body');
			active ? body.slideDown(duration) : body.slideUp(duration);
		});
	}
	initDropdown(0);
}
dropdown();

// Дополнительная логика dropdown при resize
function dropdownResize() {
	let temp = w < BREAKPOINT_md4;
	if(temp !== isLess_md4){
		isLess_md4 = temp;
		if(isLess_md4 === false){
			$(".js-dropdown-item.less-md4").each(function(){
				$(this).removeClass('active');
				$(this).find('.js-dropdown-body').slideDown(0);
			});
		}else{
			$(".js-dropdown-item.less-md4").each(function(){
				$(this).find('.js-dropdown-body').slideUp(0);
			});
		}
	}
}

// Прокрутка в самое начало страницы
$(".js-goto-top").click(function(){
	$('html, body').animate({scrollTop: 0},500);
});

// Задаем рейтинг продукта в звездочках
$(".js-rating").each(function(){
	let rating = $(this).data('rating');
	for(let i = 1; i < 6; i++){
		let icon = i <= rating ? "star-fill" : "star";
		$(this).append('<svg><use xlink:href="'+pathSprite+'#'+icon+'"/></svg>');
	}
});

// Узнать сколько картинок в отзывах и задать нужную grid-сетку
	$(".js-detect-grid").each(function(){
		let countChild = $(this).children().length;
		$(this).addClass("child-" + countChild);
	});

	let iterationsDetectVideoDuration = {count: 0, max: 25};
// Узнать есть ли видосики в блоке с отзывами
function detectDurationVideo() {
	if(iterationsDetectVideoDuration.count > iterationsDetectVideoDuration.max){return false;}
	iterationsDetectVideoDuration.count++;
	$(".js-detect-grid .imageFeedback__item video").each(function(){
		let duration = $(this)[0].duration.toFixed(0);
		if(duration === "NaN"){
			setTimeout(function() {detectDurationVideo();}, 1000);
			return false;
		}
		let m = duration % 60;
		let min = Math.floor(duration / 60);
		let result = (min < 10 ? '0' : '') + min + ':' + (m < 10 ? '0' : '') + m;
 		let html = '<span class="imageFeedback__duration">'+result+'</span>';
 		html += '<span class="btnRound btnPlayVideo">';
		html += '<svg class="w16"><use xlink:href="img/sprite/icons-sprite.svg#play"/></svg>';
		html += '</span>';
 		$(this).closest('.imageFeedback__wrap').append(html);
 	});
}
setTimeout(function() {detectDurationVideo();}, 10);

// Показать нужный набор
$(".js-goto-set").click(function(e){
	e.preventDefault();
	$(".js-goto-set").removeClass('btn-2_active');
	$(this).addClass('btn-2_active');
	let setId = $(this).data('set-id');

	$('.set').removeClass('active');
	$('.set[data-id="'+setId+'"]').addClass('active');
});

// Копирование текста в буфер обмена
function copy_in_buffer(txt) {
	var $tmp = $("<textarea>");
	$("body").append($tmp);
	$tmp.val(txt).select();
	document.execCommand("copy");
	$tmp.remove();
}

// Клик на скопировать ссылку
$(".js-copy-text").click(function(){
	let txt = $(this).data('copy-text');
	let msg = $(this).data('copy-message');
	copy_in_buffer(txt);
	$('.simpleMessage').remove();
	$body.append('<div class="simpleMessage">'+msg+'</div>');
});

// Редактировать персональную информацию
$(".js-personal-edit").click(function(){
	$(this).addClass('dn');
	$(this).closest('.js-validation-form').find('input').removeAttr('disabled');
	$(this).closest('.js-validation-form').find('.js-form-submit').removeClass('dn');
});


let isFixedCard = false;
let fixedCard = $('.js-fixed-card');
// Фиксируем карточку товара
function fixedElementOnScroll(scrollTop) {
	if((scrollTop > h && isFixedCard === false) || (scrollTop < h && isFixedCard === true)){
		isFixedCard = !isFixedCard;
		fixedCard.toggleClass('active', isFixedCard);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

	$(document).on("click", function(e){
		if(e.ctrlKey){
			console.log(timeoutNextSlide);
		}
	});
});