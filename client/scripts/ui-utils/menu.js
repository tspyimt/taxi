
angular.module('Pow', [])
   
    .directive('powMenu', function ($rootScope) {
        return {
            restrict: 'ECMA',
            transclude: false,
            link: function (scope, el, attr) {
                var navMenu = angular.element(el).find('nav');
                var open = false,
                clickEventType = document.ontouchstart !== null ? 'mousedown' : 'touchstart',
                moveEventType  = document.ontouchmove  !== null ? 'mousemove' : 'touchmove' ,
                endEventType   = document.ontouchend   !== null ? 'mouseup'   : 'touchend'  ;
                navMenu.addClass('menu-animate'),
                backdrop = $('.pow-backdrop');

                backdrop.on(clickEventType, function (ev){
                    $rootScope.$broadcast('CLOSE_NAV_MENU');
                })

                $('.main-container').on(clickEventType, function (ev){
                    
                    var startAt = 0,
                        endAt, 
                        posX = 0;

                    if(ev.hasOwnProperty('touches') && ev.touches[0].pageX < 5){
                        console.log(ev.touches[0].pageX)
                        ev.preventDefault();
                        
                        var moveHandler = function (e){
                                posX = e.pageX - startAt;


                                if(moveEventType === 'touchmove') {
                                    posX = e.touches[0].pageX - startAt;
                                }
                                posX = (Math.min( Math.max(0, posX), 250 - startAt)) -250;
                                
                                

                            if(!navMenu.hasClass('open')){
                                navMenu.removeClass('menu-animate');

                                navMenu.css({
                                    /*left:posX + 'px'*/
                                    transform: 'translate3d(' + (posX) + 'px, 0, 0)',
                                    '-webkit-transform': 'translate3d(' + (posX) + 'px, 0, 0)'
                                });
                            }
                        },
                        stopHandler = function () {
                            $('.main-container').off(moveEventType);
                            $('.main-container').off(endEventType);

                            
                            
                            navMenu.addClass('menu-animate');
                            if(((250/2) + posX) > 0){

                                navMenu.addClass('open');
                                backdrop.addClass('open');                                    
                            }else {
                                if(navMenu.hasClass('open')){
                                    navMenu.removeClass('open');
                                    backdrop.removeClass('open');
                                }else {
                                    navMenu.css({
                                        transform: 'translate3d(-250px, 0, 0)',
                                        '-webkit-transform': 'translate3d(-250px, 0, 0)'
                                    });
                                }
                            }
                            posX = 0
                            
                        };




                        if(clickEventType == 'touchstart'){
                            startAt  = ev.touches[0].pageX;
                        }   

                        $('.main-container').on(moveEventType, moveHandler);


                        $('.main-container').on(endEventType, function (){
                            stopHandler()
                        })
                    }
                    

                })

                $rootScope.$on('OPEN_NAV_MENU', function () {
                    navMenu.addClass('open');
                    
                    navMenu.css({
                        transform: '',
                        '-webkit-transform': ''
                    });
                    backdrop.addClass('open');
                });

                $rootScope.$on('CLOSE_NAV_MENU', function () {
                    navMenu.removeClass('open');
                    backdrop.removeClass('open');
                    navMenu.css({
                        transform: '',
                        '-webkit-transform': ''
                    });
                });


            }
        }
    })
    .directive('toggleMenu', function ($rootScope) {
        return {
            restrict: 'ECMA',
            transclude: false,
            link: function (scope, el, attr) {
                angular.element(el).on('click', function () {

                    var menuEl = document.querySelectorAll('pow-menu'),
                        menuHasOpen = angular.element(menuEl).find('nav').hasClass('open');

                    if (!menuHasOpen) {
                        $rootScope.$broadcast('OPEN_NAV_MENU');
                    } else {
                        $rootScope.$broadcast('CLOSE_NAV_MENU');
                    }
                });


            }
        }
    })
    .directive('closeMenu', function ($rootScope) {
        return {
            restrict: 'ECMA',
            transclude: false,
            link: function (scope, el, attr) {

                angular.element(el).on('click', function () {
                    var menuEl = document.querySelectorAll('pow-menu'),
                        menuHasOpen = angular.element(menuEl).find('nav').hasClass('open');

                    $rootScope.$broadcast('CLOSE_NAV_MENU');
                });


            }
        }
    });
    