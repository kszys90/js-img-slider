const init = function () {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach(img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function () {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider';

    const imagesList = document.querySelectorAll(imagesSelector);
    const sliderRootElement = document.querySelector(sliderRootSelector);

    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
}

const initEvents = function (imagesList, sliderRootElement) {
    imagesList.forEach(function (item) {
        item.addEventListener('click', function (e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
        });

    });

    // todo: 
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
    // na elemencie [.js-slider__nav--next]
    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
    navNext.addEventListener('click', function (e) {
        fireCustomEvent(navNext, 'js-slider-img-next')
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
    // na elemencie [.js-slider__nav--prev]
    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
    navPrev.addEventListener('click', function (e) {
        fireCustomEvent(navPrev, 'js-slider-img-prev')
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
    // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
    const zoom = sliderRootElement.querySelector('.js-slider__zoom');
    zoom.addEventListener('click', function (e) {
        const sliderZoom = sliderRootElement.querySelector('.js-slider__zoom')
        if (e.target === sliderZoom) {
            fireCustomEvent(zoom, 'js-slider-close')
        }
    })

}

const fireCustomEvent = function (element, name) {
    console.log(element.className, '=>', name);

    const event = new CustomEvent(name, {
        bubbles: true,
    });

    element.dispatchEvent(event);
}

const initCustomEvents = function (imagesList, sliderRootElement, imagesSelector) {
    imagesList.forEach(function (img) {
        img.addEventListener('js-slider-img-click', function (event) {
            onImageClick(event, sliderRootElement, imagesSelector);
        });
    });

    sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
    sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
    sliderRootElement.addEventListener('js-slider-close', onClose);
}

const onImageClick = function (event, sliderRootElement, imagesSelector) {
    // todo:  
    // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
    // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
    // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
    // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
    // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
    // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany

    const sliderImg = document.querySelector('.js-slider__image')
    const currentImg = event.target.querySelector('img')
    const imgGroup = event.target.getAttribute('data-slider-group-name')
    const figuresList = document.querySelectorAll(imagesSelector)
    const imgList = []
    for (let i = 0; i < figuresList.length; i++) {
        imgList[i] = figuresList[i].querySelector('img')
    }

    sliderRootElement.classList.add('js-slider--active')
    sliderImg.setAttribute('src', currentImg.getAttribute('src'))
    const images = []
    figuresList.forEach(function (e) {
        if (e.getAttribute('data-slider-group-name') === imgGroup) {
            images.push(e.querySelector('.gallery__image'))
        }
    })
    images.forEach(function (e) {
        const thumbsElementProto = document.querySelector('.js-slider__thumbs-item--prototype')
        const newThumbSlider = thumbsElementProto.cloneNode(true)
        newThumbSlider.classList.remove('js-slider__thumbs-item--prototype')
        newThumbSlider.querySelector('img').setAttribute('src', e.getAttribute('src'))
        thumbsElementProto.parentElement.appendChild(newThumbSlider)
        if (newThumbSlider.querySelector('img').getAttribute('src') === currentImg.getAttribute('src')) {
            newThumbSlider.classList.add('js-slider__thumbs-image--current')
        }
    })
}
const onImageNext = function (event) {
    // console.log(this, 'onImageNext');
    // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
    const currFig = document.querySelector('.js-slider__thumbs-image--current')
    const nextFig = currFig.nextSibling
    if (nextFig) {
        const nextImg = nextFig.querySelector('img')

        if (nextImg) {

            currFig.classList.remove("js-slider__thumbs-image--current")
            nextFig.classList.add("js-slider__thumbs-image--current")
            const sliderImg = document.querySelector('.js-slider__image')
            sliderImg.setAttribute('src', nextImg.getAttribute('src'))
        }
    }
    else {
        const thumbs = document.querySelector('.js-slider__thumbs')
        const nextFig = thumbs.children[1]
        currFig.classList.remove("js-slider__thumbs-image--current")
        nextFig.classList.add("js-slider__thumbs-image--current")
        const nextImg = nextFig.querySelector('img')
        const sliderImg = document.querySelector('.js-slider__image')
        sliderImg.setAttribute('src', nextImg.getAttribute('src'))
    }

}

const onImagePrev = function (event) {
    // console.log(this, 'onImagePrev');
    // // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut [src] dla [.js-slider__image]
    const currEl = document.querySelector('.js-slider__thumbs-image--current')
    const prevEl = currEl.previousSibling
    const thumbs = document.querySelector('.js-slider__thumbs')
    if (prevEl) {
        if (currEl === thumbs.children[1]) {
            const childrenNumber = thumbs.children.length - 1
            const prevEl = thumbs.children[childrenNumber]
            const prevImg = prevEl.querySelector('img')
            currEl.classList.remove("js-slider__thumbs-image--current")
            prevEl.classList.add("js-slider__thumbs-image--current")
            const sliderImg = document.querySelector('.js-slider__image')
            sliderImg.setAttribute('src', prevImg.getAttribute('src'))
        }

        else {
            const prevImg = prevEl.querySelector('img')

            if (prevImg) {

                currEl.classList.remove("js-slider__thumbs-image--current")
                prevEl.classList.add("js-slider__thumbs-image--current")
                const sliderImg = document.querySelector('.js-slider__image')
                sliderImg.setAttribute('src', prevImg.getAttribute('src'))
            }
        }

    }
}
const onClose = function (event) {
    // todo:
    // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
    // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
    const currImg = document.querySelectorAll('.js-slider')
    currImg.forEach(function (item) {
        item.classList.remove("js-slider--active")
    })
    const sliderPrototype = document.querySelector('.js-slider__thumbs-item--prototype')
    const thumbs = document.querySelector('.js-slider__thumbs')
    thumbs.innerHTML = ''
    thumbs.appendChild(sliderPrototype)
}