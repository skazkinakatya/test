const arrowRight=document.querySelector('.arrowRight');
const arrowLeft=document.querySelector('.arrowLeft');
const sity=document.querySelector('#sity');
const foundSities=document.querySelector('.foundSities');
const searchCity=document.querySelector('#searchSity');
const searchResults=document.querySelector('.searchResults');
let Cities=[];
let searchInterval=null;

const leftBtns=[
    arrowRight, 
    document.querySelector('#University'),
    document.querySelector('#Collage')

];
const rightBtns=[
    arrowLeft, 
    document.querySelector('#Feedback'),
    document.querySelector('#Document')
];

fetch('https://proverili.ru/api/areas', { method: 'POST' }) //Получение городов
    .then(res => { //Парсинг ответа с сервера
        if (res.ok) {
            return res.json()
        }
        else {
            console.log('error')
            throw new Error
        }
    })
    .then(data => { //Преобразование ответа с сервера в массив данных в памяти
        for (const municipalityKey in data) {
            for (const cityKey in data[municipalityKey].cities) {
                Cities.push(
                    {
                        city: data[municipalityKey].cities[cityKey].name,
                        municipality: data[municipalityKey].name,
                    }
                )
            }
        }
    })
    .catch(error => {//Обработка ошибки
        console.log(error)
    })
function changeAppearance(tooShow, tooHide) { // Реализация скрытия и показов скрытых пунктов меню
    for (let i= 0; i < tooShow.length; i++) {
        tooShow[i].classList.remove('hidden');
        tooShow[i].classList.add('flex');
    };
    for (let i= 0; i < tooHide.length; i++) {
        tooHide[i].classList.remove('flex');
        tooHide[i].classList.add('hidden');
    };
};
function addSelector(string, pos, len) { //Выделение текста
    return string.slice(0, pos) + '<mark>' + string.slice(pos, pos + len) + '</mark>' + string.slice(pos + len)
}
function appendCityElement(element, index, searchText) { //Создание и добавление эл-та в список городов в поиске
    let newElement=document.createElement('div');
            let cityName=document.createElement('span');
            let cityMunName=document.createElement('span');
            newElement.append(cityName);
            newElement.append(cityMunName);
            cityMunName.innerHTML=element.municipality;
            cityName.innerHTML=addSelector(element.city, index, searchText.length);
            searchResults.append(newElement);
            newElement.addEventListener('click', () => {
                sity.innerHTML = element.city;
            })
}
function searchForCity(){ //Реализация поиска городов
    clearInterval(searchInterval);
    searchInterval=null;
    searchResults.innerHTML="";
    let searchText=searchCity.value.trim().toUpperCase();
    for (let i = 0; i < Cities.length; i++) {
        let element=Cities[i];
        let index=element.city.toUpperCase().indexOf(searchText);
        if(index===0){
            appendCityElement(element, index, searchText);
        }
    }
};
arrowRight.addEventListener('click', function (event) {
    changeAppearance(rightBtns, leftBtns);
});
arrowLeft.addEventListener('click', function (event) {
    changeAppearance(leftBtns, rightBtns);
});
sity.addEventListener('click', function (event) { //Откртытие блока поиска и первичное заполнение 
    foundSities.classList.remove('hidden');
    foundSities.classList.add('shown');
    searchResults.innerHTML="";
    for (let i = 0; i < Cities.length; i++) {
        let element=Cities[i];
        appendCityElement(element, 0, "");
    }
});

searchCity,addEventListener('keyup', function () { //Старт поиска с задержкой 
    if(searchInterval!=null){
        clearInterval(searchInterval);
        searchInterval=null;
    }
    searchInterval=setInterval(searchForCity , 300);
});
