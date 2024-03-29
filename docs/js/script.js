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

	//////////////////////////////////////////// Select2 ////////////////////////////////////////////

// Селект похожий на обычный
$('.js-select-once-1').select2({ 
	minimumResultsForSearch: -1,
	width: 'auto',
	dropdownCssClass: "select-once-1-dropdown",
});

// Селект похожий на обычный
$('.js-select-once-2').select2({ 
	minimumResultsForSearch: -1,
	width: 'auto',
	dropdownCssClass: "select-once-2-dropdown",
});;
	/*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/
var ScrollElement = function(elem) {
	let isResponsive = elem.hasClass('responsive');
	var body = elem.find('.scroll__body');
	var wBody = body.width();
	if(isResponsive === true){
		let oneElementWidth;
		if(w > BREAKPOINT_md1){
			oneElementWidth = (wBody - (3*16)) / 4;
		}else if(w > BREAKPOINT_872){
			oneElementWidth = (wBody - (4*16)) / 3;
		}else if(w > BREAKPOINT_552){
			oneElementWidth = (wBody - (3*16)) / 2;
		}else{
			oneElementWidth = (wBody - (2*16)) / 1;
		}
		if(w > BREAKPOINT_md3){elem.find('.cardReviews').css('width', oneElementWidth+'px');}
	}
	var scroll = elem.find('.scroll__scroll');
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = $('.js-scroll-button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = $('.js-scroll-button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');
	var paddingLeft = parseFloat(scroll.css('padding-left'));
	var paddingRight = parseFloat(scroll.css('padding-right'));

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() +  paddingLeft + paddingRight - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			if(isResponsive){
				if(w > BREAKPOINT_md1){
					var stepScroll = (elem.width()+16) * 1;
				}else if(w < BREAKPOINT_md3){
					var stepScroll = elem.width() * 0.8;
				}else{
					var stepScroll = (elem.width()-16) * 1;
				}
			}else{
				var stepScroll = elem.width() * 0.8;
			}
			
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
		
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){
	if(!(w < BREAKPOINT_md4 && $(this).hasClass('js-not-md4'))){
		new ScrollElement($(this));
	}
});
;
	/////////////////// Скрипты для попапов ///////////////////////////

var popup = $(".popup");
var lastOpen = false;

// Показать попапы при клике
$(document).on("click", ".js-popup-open", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	openPopup($(this).data('popupid'));
});

// Открыть попап
function openPopup(popupID) {
	if(lastOpen !== popupID){
		if(lastOpen !== false){close_popup();}
		lastOpen = popupID;
		$('#'+popupID).addClass('open');
		bodyLock();
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".js-popup-open").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс open)
    if (popup.has(e.target).length === 0 && popup.hasClass('open') && popupTarget === 0 && $('.js-micropopup-lottery').has(e.target).length === 0){
	    close_popup();
	}
});

// Скрыть попап при нажатии на клавишу "Esc"
$(document).on("keydown", function (e) {
	if(e.which === 27){
		close_popup();

		// Закрыть слайдер отзывов 
		if($activeSlidersReviews !== null){closeSliderReviews();}

		// Закрыть сторисы
		closeStories();
	}
});

// Блокировка скролла при открытии попапа
function bodyLock() {
	$body.addClass('lock');
}

// Разблокировка скролла при закрытии попапа
function bodyUnLock() {
	$body.removeClass('lock');
}

// Закрыть popup
function close_popup() {
	$(".popup").removeClass('open');
	bodyUnLock();
	lastOpen = false;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(document).on("click", ".js-popup-close", function(e){
	e.preventDefault();
	close_popup();
});;
	// Инициируем обработчики валидации
function initValidators() {
	// Валидируем поля формы перед отправкой
	$('.js-validation-form').submit(function (e) {
		if($(e.originalEvent.submitter).hasClass('js-submit-without-validate') === true){return true;}

		let isSubmitForm = true;
		$(this).find("._validate").each(function(){
			let validateType = $(this).data('validation-type');
			let value = $(this).val();
			let error = false;
			for (var i = 0; i < validateType.length; i++) {
				let isValid = validator[validateType[i]](value);
				if(isValid !== true){error = isValid; break;}
			}
			if(error !== false){
				isSubmitForm = false;
				$(this).addClass('_error');
				$(this).closest('.js-validation-block').find('.js-validation-error').text(errorMessage[error]);
			}
		});

		if(isSubmitForm === false){
			$(this).find('.js-form-submit').addClass('disabled');
		}
		return isSubmitForm;
	});

	// Про фокусе поля убираем у него ошибку
	$(".js-validation-form ._validate").on("focus change", function(){
		if($(this).hasClass('_error')){
			$(this).removeClass('_error');
			$(this).closest('.js-validation-block').find('.js-validation-error').text('');
		}

		let errorsCount = $(this).closest(".js-validation-form").find('._error').length;
		if(errorsCount === 0){
			$(this).closest(".js-validation-form").find('.js-form-submit').removeClass('disabled');
		}
	});
}
initValidators();

// Все виды валидации
let validator = {
	req: function (value) {
		if(value === ""){return "required";}
		return true;
	},
	tel: function (value) {
		if(value === ""){return true;}
		if(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){8,14}(\s*)?$/.test(value) === false){return "wrongTelephone";}
		return true;
	},
	email: function (value) {
		if(value === ""){return true;}
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value) === false){return "wrongEmail";}
		return true;
	},
	name: function (value) {
		if(value === ""){return true;}
		if(value.length < 2){return "wrongNameShort";}
		if(value.length > 100){return "wrongNameLong";}
		return true;
	},
	password: function (value) {
		if(value === ""){return true;}
		if(/^[a-zA-Z0-9]+$/.test(value) === false){return "passwordOnlyLatin";}
		if(/^[^-() /]*$/.test(value) === false){return "passwordWithoutCharacters";}
		if(value.length < 8){return "wrongPasswordShort";}
		if(value.length > 100){return "wrongPasswordLong";}
		if(parseInt(value.substr(0, 1))){return "passwordFirstSymbolLeter";}
		return true;
	},
	passwordMatch: function (value) {
		let firstPasswordValue = $('.js-password-match').val();
		if(firstPasswordValue !== value){return "passwordNotMatch";}
		return true;
	},
	reqAddress: function (value) {
		if(value === ""){return "requiredAddress";}
		return true;
	},
	bankCard: function (value) {
		if(value === ""){return true;}
		if(/[-0-9]{16}/.test(value) === false){return "wrongWankCard";}
		return true;
	},
	reqImage: function (value) {
		if(value === ""){return "requiredImage";}
		return true;
	}
};

// Показать/скрыть пароль
$(".js-showHidePassword").click(function(){
	var parent = $(this).closest('.js-showHidePasswordParent');
	if (parent.find('input').attr('type') === 'password'){
		parent.find('input').attr('type', 'text');
		$(this).addClass('active');
	} else {
		parent.find('input').attr('type', 'password');
		$(this).removeClass('active');
	}
});

// Все виды ошибок
let errorMessage = {
	"required" : "Поле обязательное для заполнения",
	"wrongTelephone": "Неверный формат номера телефона",
	"wrongEmail": "Неверный формат электронной почты",
	"wrongNameShort": "Cлишком короткое значение (мин. 2 символа)",
	"wrongNameLong": "Cлишком длинное значение (макс. 100 символов)",
	"wrongPasswordShort": "Пароль должен содержать больше 8 символов",
	"wrongPasswordLong": "Пароль должен содержать меньше 80 символов",
	"passwordOnlyLatin": "Пароль должен содержать только латинские буквы и цифры",
	"passwordWithoutCharacters": "Пароль не должен содержать спецсимволы (),/- []",
	"passwordFirstSymbolLeter": "Пароль должен начинаться с буквы",
	"passwordNotMatch": "Пароли не совпадают",
	"requiredAddress" : "Выберите адрес доставки",
	"wrongWankCard": "Поле должно содержать 16 цифр",
	"requiredImage": "Необходимо прикрепить скриншот"
};;
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
$(document).on("click", "#js-stopRunner", function(e){
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

const IS_USE_LOTTERY_POPUP = true; // Использовать лотерею
const IS_USE_LEAVING_POPUP = false; // Использовать попап при уходе
const IS_USE_TITLE_CHANGER = false; // Использовать анимированный title


const downloadPopupDelay = 15; // задержка (сек.) Загрузить ajax-ом попапы через ХХ сек
const leavingDelay = 60; // задержка (сек.) - После загрузки ajax-ом попапов

// ********* Отслеживаем уход и возвращение на страницу ********** //

var isExistUser;
var timer_leaving;
// Отслеживаем уход со страницы
$(document).on("mouseleave", function(){
	clearTimeout(timer_leaving);
	timer_leaving = setTimeout(function() {userLongGone();}, leavingDelay * 1000);
});


// Пользователь вернулся на страницу
$(document).on("mouseenter", function(){
	clearTimeout(timer_leaving);
	isExistUser = true;
});

// Пользователь отсутствовал указанное количество времени
function userLongGone() {
	isExistUser = false;
	/* Если попапы получения приза загружены и приз до сих пор не получен и попап "Забрать приз" закрыт
		 и попап lottery закрыт и попап prizeReceive закрыт то открыть попап "Забрать приз" */
	if(isLoadedPopupsLottery === true && localStorage.getItem('get-gift') === null && 
		isOpenMicropopupLottery === false && $("#prizeReceive").hasClass('open') === false && $("#lottery").hasClass('open') === false){
		show_hide_micropopupLottery(true);
	}

	// Запустить анимацию title если не запущена
	if(animTitle === false && IS_USE_TITLE_CHANGER === true){animateTitle();}

	// Показать попап при уходе если выполняются условия
	if(sessionStorage.getItem('vizit') == null && isLoadedPopupLeaving === true && $('#userLeaving').hasClass('open') === false && 
		$("#prizeReceive").hasClass('open') === false && $("#lottery").hasClass('open') === false){
		openPopup('userLeaving');
		sessionStorage.setItem('vizit', 'vizit');
	}
}

// ********************** Анимируем title ************************ //

var titleDefault = $('title').text();
var titleAnimate = $('title').data('title');
if(titleAnimate != undefined){
	titleAnimate = titleAnimate.split("||");
}
var titleLoop = 0;
var animTitle = false;
// Анимируем title при условии что приз еще не получен и задан data-title для title
function animateTitle() {
	if(localStorage.getItem('get-gift') == null && titleAnimate != undefined){
		$('title').text(titleAnimate[titleLoop]);
		titleLoop++;
		if(titleLoop >= titleAnimate.length){titleLoop = 0;}
		if(isExistUser === false){
			animTitle = true;
			setTimeout(function() {animateTitle();}, 1500);
		}else{
			animTitle = false;
			$('title').text(titleDefault);
		}
	}
}

// ************** Логика открытия попапов лотереи **************** //

var $micropopupLottery;
var isOpenMicropopupLottery = false;
// Показать/скрыть микропопап "Забрать приз"
function show_hide_micropopupLottery(showPopup) {
	if(showPopup === false){
		$micropopupLottery.addClass('closing-anim');
		setTimeout(function() {
			$micropopupLottery.removeClass('show-anim closing-anim');
		}, 300);
	}else{
		$micropopupLottery.addClass('show-anim');
	}
	isOpenMicropopupLottery = showPopup;
}

// Скрыть микропопап "Забрать приз" при клике на кнопку "Скрыть"
$(document).on("click", ".js-hide-micropopup-lottery", function(){
	show_hide_micropopupLottery(false);
});

// Клик по попапу "Забрать приз"
$(document).on(isMobile ? "touchend" : "mousedown", ".js-micropopup-lottery", function (e) {
	if($(e.target).hasClass('js-hide-micropopup-lottery') === false){
		initWheel();
		openPopup('lottery');
		show_hide_micropopupLottery(false);
	}
});

// ********************* Подгрузка попапов *********************** //

var isLoadedPopupsLottery = false;
var isLoadedPopupLeaving = false;
// Подгрузка попапов лотереи и ухода со страницы методом load через 15 сек
setTimeout(function() {
	$('body').append('<div id="popupsLoaded_1"></div><div id="popupsLoaded_2"></div>');
	// Если пользователь не получил подорок только тогда грузим попапы лотереи 
	if(localStorage.getItem('get-gift') === null && IS_USE_LOTTERY_POPUP === true){
		$("#popupsLoaded_1").load(pathPopups + " #popups-lottery", function(response, status){
			commonAction(status, "ВНИМАНИЕ!!! Ошибка при загрузке попапов лотереи");
			if(status == 'success'){
				// Запоминаем если пользователь получил подарок
				$(".js-get-gift").submit(function(e){
					e.preventDefault();
					localStorage.setItem('get-gift', 'exist');

					let request = $(this).serialize();
					$.ajax({
						url : '/ajax/gen_coupon.php',
						data: request,
						success: function() {
							alert('Мы выслали скидочный купон на вашу почту!');
						}
					});
					$("#prizeReceive").removeClass('open');
				});

				// Показать микропопап лотереи
				$micropopupLottery = $('.js-micropopup-lottery');
				show_hide_micropopupLottery(true);

				// Дополнительная логика
				isLoadedPopupsLottery = true;
			}
		});
	}

	// Если за текущую сессию пользователь при уходе еще не увидел попап #userLeaving
	if(sessionStorage.getItem('vizit') == null && IS_USE_LEAVING_POPUP === true){
		$("#popupsLoaded_2").load(pathPopups + " #userLeaving", function(response, status){
			commonAction(status, "ВНИМАНИЕ!!! Ошибка при загрузке попапа при уходе со страницы");
			if(status == 'success'){
				// Дополнительная логика
				isLoadedPopupLeaving = true;
			}
		});
	}
}, downloadPopupDelay * 1000);

// Общие действия для 2-х load загрузок
function commonAction(status, msg){
	if(status === "error"){
		console.log(msg);
	}else{ // Если попапы успешно загружены
		// Переопределяем попапы
		popup = $(".popup");

		// Перезапускаем валидаторы
		$('.js-validation-form').unbind("submit");
		$(".js-validation-form ._validate").unbind("focus change");
		initValidators();
	}
};

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
	let video = $activeSlidersReviews.find('video');
	if(video.length !== 0){
		video.prop('muted', true).prop('controls', false);
		video.get(0).pause();
	}
	$('.feedbackSliderControls').removeClass('active');
	$body.removeClass('lock');
	$activeSlidersReviews = null;
}

/////////////////////////////// Простые слайдеры  //////////////////////////////////////

// Простой слайдер
$('.js-simpleSlider').slick({
	prevArrow: $('.js-simpleSlider-parent .sliderBtn.btn-prev'),
	nextArrow: $('.js-simpleSlider-parent .sliderBtn.btn-next'),
});

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

	// В слайдере уходе ховера с картинки, делаем активной первую картинку
	$(document).on("mouseleave", ".useful__card", function(){
		let imageWrap = $(this).find('.useful__imageWrap.initImage');
		if(imageWrap.length !== 0){
			imageWrap.find('img').removeClass('active');
			imageWrap.find('img:first-child').addClass('active');
			imageWrap.closest('.useful__image').find('.useful__dots span').removeClass('active');
			imageWrap.closest('.useful__image').find('.useful__dots span:first-child').addClass('active');
		}
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

/* Отследить инициализацию слайдера js-sliderBig. Чтобы избежать мигания картинок, до 
   инициализации слайдера скрываем все слайды кроме первого */
$('.js-sliderBig').on('init', function(event, slick){
  $('.js-sliderBig').removeClass('preInit');
});

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
					html += '<use class="st-1" xlink:href="'+pathSprite+'#pause"/>';
					html += '<use class="st-2" xlink:href="'+pathSprite+'#play_w16in24"/>';
				html += '</svg>';

				html += '<svg class="timescale__control svgWithState volumn w24 js-stories-volumn '+isMuted+'">';
					html += '<use class="st-1" xlink:href="'+pathSprite+'#volumn-on"/>';
					html += '<use class="st-2" xlink:href="'+pathSprite+'#volumn-off"/>';
				html += '</svg>';
			html += '</div>';
			html += '<svg class="timescale__control close w24 js-close-stories">';
				html += '<use xlink:href="'+pathSprite+'#close"/>';
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
let totalityHeight = totalityFixed.outerHeight();
// Фиксируем блок подтверждения заказа при доскролле до него
function fixedCardOnScroll(scrollTop) {
	if(totalityFixed.length === 0 || w > BREAKPOINT_md3){return false;}

	let bottomAnchor = $(document).height() - h - (totalityFixed.height() * 5);
	let topAnchor = anchorTotalityFixed.offset().top - h;

	if((scrollTop > topAnchor && scrollTop < bottomAnchor && isFixedTotality === false) || 
		 ((scrollTop < topAnchor || scrollTop > (bottomAnchor+totalityHeight+32)) && isFixedTotality === true)){
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

//////////////////////////// Обрабатываем загрузку картинки /////////////////////////////

$("#i-user-image").change(function(){
	$('#image-file-error').text('');
	if($(this)[0].files[0] !== undefined){
		let isUpload = uploadFile($(this)[0].files[0]);
		if(isUpload === true){
			$('.js-image-downloader').text($('.js-image-downloader').data('text-change'));
			$('#user-image-name').removeClass('dn').text($(this)[0].files[0].name);
		}
	}
});

function uploadFile(file) { // Загрузка файла
	// Проверка типа файла
	if(!['image/jpeg','image/png','image/gif'].includes(file.type)){
		$('#image-file-error').text('Разрешены только изображения.');
		$("#i-user-image").val('');
		return false;
	}

	// Проверить размер файла (меньше 2 МБ)
	if(file.size > 2 * 1024 * 1024){
		$('#image-file-error').text('Файл должен быть менее 2 МБ.');
		return false;
	}

	// Когда картинка загружена показываем ее в блоке preview
	var reader = new FileReader();
	reader.onload = function (e) { // Когда картинка загружена	
		$('#formPreview').removeClass('dn').html(`<img loading="lazy" src="${e.target.result}" alt="Фото">`);
	};
	reader.onerror = function (e) {
		alert('Ошибка');
	};
	reader.readAsDataURL(file);

	return true;
}

///////////////////////////////////// Прочее ///////////////////////////////////////////

let isLess_md4;
// Логика dropdown
function dropdown() {
	const DROPDOWN_SLIDE_DURATION = 300;
	isLess_md4 = w < BREAKPOINT_md4;
	// Открыть/закрыть dropdown
	$(document).on("click", ".js-dropdown-head", function(){
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
	showAlertPupup(msg);
});

// Показать всплывашку снизу поцентру экрана
function showAlertPupup(message) {
	$('.simpleMessage').remove();
	$body.append('<div class="simpleMessage">'+message+'</div>');
}

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
	let bottomAnchor = $(document).height() - h - (fixedCard.height() * 2);
	if((scrollTop > h && scrollTop < bottomAnchor && isFixedCard === false) || 
		 ((scrollTop < h || scrollTop > bottomAnchor) && isFixedCard === true)){
		isFixedCard = !isFixedCard;
		fixedCard.toggleClass('active', isFixedCard);
	}
}

// Превращает картинку img в background-image
function ibg(){ 
		let ibg=document.querySelectorAll(".ibg");
		for (var i = 0; i < ibg.length; i++) {
			if(ibg[i].querySelector('img')){
				ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
			}
		}
	}
ibg();

// Для блок-инпутов inputTextBtn если инпут не пустой тогда кпопка красная
$(".js-inputTextBtn-change input").on("input", function(){
	if($(this).val() === ""){
		$(this).closest('.js-inputTextBtn-change').find('.inputBtn').addClass('inputBtn_gray');
	}else{
		$(this).closest('.js-inputTextBtn-change').find('.inputBtn').removeClass('inputBtn_gray');
	}
});

// Если это страница ввода кода при входе, включаем таймер до повторной отправки кода
let $resendCodeText = $('.js-rest-time-resend-code');
let restSecondToResend = 59;
if($resendCodeText.length !== 0){
	let TIMER_CODE = setInterval(function(){
		$resendCodeText.text(restSecondToResend);
		restSecondToResend--;
		if(restSecondToResend === 0){
			clearInterval(TIMER_CODE);
			$('.js-rest-time-exist').remove();
			$('.js-rest-time-missing').removeClass('dn');
		}
	}, 1000);
}

// Проверка продукции, скролл до блока "Вы получили скидку" ecли он есть
const elem = $(".js-goto-form");
if(elem.length !== 0){
	setTimeout(function() {
		$('html, body').animate({scrollTop: elem.offset().top - 200}, 500);
	}, 500);
}

// Блок "Топ месяца". Открытие/закрытие выпадающего списка
$(".js-topOfMonth-trigger").click(function(){
	let isActive = $(this).hasClass("active");
	$(this).toggleClass("active", !isActive);
	$(".js-topOfMonth-content").slideToggle(300);
});

let isHideTopOfMonthBlock = false;
// Закрытие блока "Топ месяца" при клике вне блока
$(document).on(isMobile ? "touchend" : "mouseover", function (e) {
	if($(".js-topOfMonth-body").has(e.target).length === 0 && isHideTopOfMonthBlock === false){
	    isHideTopOfMonthBlock = true;
	    if($(".js-topOfMonth-trigger").hasClass("active")){
	    	$(".js-topOfMonth-content").slideToggle(150);
	    	$(".js-topOfMonth-trigger").removeClass("active");
	  	}
		}
});

/////////////////////////////////////////////////////////////////////////////////////////

	$(document).on("click", function(e){
		if(e.ctrlKey){
			
		}
	});
});