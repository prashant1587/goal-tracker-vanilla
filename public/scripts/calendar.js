

const Calendar = (function (){
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const shortDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = moment().month();
    let year = moment().year();
    let goalsObject = getItemFromStorage('store') || {};
    let currentGoal = 0;
    document.getElementById("calendar").classList.add("hidden-drop");

    function addElement(parentId, elementTag, elementId, html, cssClass) {
        // Adds an element to the document
        const p = document.getElementById(parentId);
        const newElement = document.createElement(elementTag);
        newElement.setAttribute('id', elementId);
        newElement.innerHTML = html;
        cssClass && newElement.classList.add(cssClass);
        p.appendChild(newElement);
        return newElement;
    }

    function removeElement(elementId) {
        // Removes an element from the document
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
        return null;
    }

    function init(){
        document.getElementById("calendar").classList.remove("hidden-drop");
        drawCalendarMonths();
        loadYears();
        document.getElementById("curMonth").innerHTML = months[month];
        document.getElementById("curYear").innerHTML = year;
        addDaysOfWeek();
        loadCalendarDays();
    };

    function loadGoals() {
        const keys = Object.keys(goalsObject);
        if(keys.length>0) {
            for (let key in goalsObject){
                if(goalsObject.hasOwnProperty(key)){
                    const element = addElement('side-panel', 'div', goalsObject[key].name+'-'+key, goalsObject[key].name, 'name-goal');
                    (function (element) {
                        console.log(element);
                        element.addEventListener("click", (event, element) => clickedAction(event, this));
                    }(element));
                }
            }
            currentGoal = keys[0];
            init();
        }
    }

    function clickedAction(event, that) {
        console.log(that);
        const idSplit = event.target.id.split('-');
        const keyFromId = idSplit[idSplit.length-1];
        currentGoal = keyFromId;
        console.log(currentGoal);
        init();

    }

    function addDaysOfWeek() {
        if(document.getElementById('days').children.length===0){
            for(let i = 0; i < shortDays.length;i++) {
                let dayOfWeek = document.createElement("div");
                dayOfWeek.setAttribute("class", "day-of-week");
                dayOfWeek.innerText = shortDays[i];
                document.getElementById('days').appendChild(dayOfWeek);
            }
        }
    }

    function drawCalendarMonths() {
        document.getElementById('months').classList.add("hidden-drop");
        if(document.getElementById('months').children.length > 0){
            return;
        }
        for(let i = 0; i< months.length; i++) {
            const doc = document.createElement('div');
            doc.innerText = months[i];
            doc.classList.add('dropdown-item');

            doc.onclick = (function() {
                let selectedMonth = i;
                return function() {
                    month = selectedMonth;
                    document.getElementById("curMonth").innerHTML = months[month];
                    loadCalendarDays();
                    return month;
                }
            })();
            document.getElementById('months').appendChild(doc);
        }
    }

    function loadYears(){
        if(document.getElementById('years').children.length > 0){
            return;
        }
        // whichever date range makes the most sense
        var startYear = 1990;
        var endYear = 2100;
        document.getElementById("years").classList.add("hidden-drop");
        for(var i = startYear; i <= endYear; i++)
        {
            var doc = document.createElement("div");
            doc.innerHTML = i;
            doc.classList.add("dropdown-item");

            doc.onclick = (function(){
                var selectedYear = i;
                return function(){
                    year = selectedYear;
                    document.getElementById("curYear").innerHTML = year;
                    loadCalendarDays();
                    return year;
                }
            })();
            document.getElementById("years").appendChild(doc);
        }
    }

    function getDaysInMonth(year, month) {
        if(year && month) {
            const format = 'YYYY-MM';
            const monthWithYear = ''+ year+ '-'+ (month+1);
            return moment(monthWithYear, format).daysInMonth();
        }
        return moment().daysInMonth();
    }

    function loadCalendarDays(){
        if(!year && !month){
            year = moment().year();
            month = moment().month();
        }
        document.getElementById("calendarDays").innerHTML = '';
        const monthWithYear = ''+ year+ '-'+ (month+1);
        const daysInMonth = getDaysInMonth(year, month);
        const startOfCalendar = moment(monthWithYear+ '-'+1, "YYYY MM DD").days();
        addStartingBlanks(startOfCalendar);
        addDates(daysInMonth);
        addRemainingDays(startOfCalendar,daysInMonth);
    }

    function addStartingBlanks(startOfCalendar) {
        for(let i = 0;i<startOfCalendar;i++){
            const d = document.createElement('div');
            d.classList.add('day');
            d.classList.add('blank');
            document.getElementById("calendarDays").appendChild(d);
        }
    }

    function addDates(daysInMonth) {
        for(let i = 1;i<=daysInMonth;i++){
            const d = document.createElement('div');
            d.id  = 'calendarday_'+i;
            d.className = 'day';
            d.innerHTML = i;
            if(goalsObject[currentGoal].storageObject[year] && goalsObject[currentGoal].storageObject[year][month]) {
                if(goalsObject[currentGoal].storageObject[year][month].days.indexOf(i)> -1){
                    addCross(d, i);
                }
            }
            d.onclick = (function(d, i) {

                return function(event) {
                    // let cross = null;
                    // if(d.classList.contains('close-added')){
                    //     d.classList.remove("close-added");
                    //     const crossEle = document.getElementById('calendarday_'+i + 'cross');
                    //     d.removeChild(crossEle);
                    // }else {
                    //     cross = addCross(d, i);
                    // }
                    // setSelectionToObject(event,i);
                    toggleCross(d, i, event);
                }
            })(d, i);
            document.getElementById("calendarDays").appendChild(d);
        }
    }

    function addRemainingDays(startOfCalendar,daysInMonth) {
        let remainingDays = 0;
        if(startOfCalendar===0){
            remainingDays = daysInMonth===28?0:35-daysInMonth;
        }else{
            remainingDays = 35-daysInMonth-startOfCalendar;
        }
        for(let i = 0;i<remainingDays;i++){
            const d = document.createElement('div');
            d.classList.add('day');
            d.classList.add('blank');
            document.getElementById("calendarDays").appendChild(d);
        }
    }

    function toggleCross(d, i, event) {
        let cross = null;
        if(d.classList.contains('close-added')){
            d.classList.remove("close-added");
            const crossEle = document.getElementById('calendarday_'+i + 'cross');
            d.removeChild(crossEle);
        }else {
            cross = addCross(d, i);
        }
        setSelectionToObject(event,i);
    }

    function addCross(d, i) {
        d.classList.add("close-added");
        const cross = document.createElement("div");
        cross.id  = 'calendarday_'+i + 'cross';
        cross.classList.add("close");
        d.appendChild(cross);
        return cross;
    }

    function setSelectionToObject (event,i) {
        event.stopPropagation();
        event.preventDefault();
        let obj = { ...goalsObject[currentGoal].storageObject};
        obj[year] = obj[year]||{};
        obj[year].count = obj[year].count || 0;
        obj[year][month] = obj[year][month] || {count: 0, days:[]};
        if(obj[year][month].days.indexOf(i)>-1){
            obj[year][month].days.splice( obj[year][month].days.indexOf(i), 1);
            obj[year][month].count--;
            obj[year].count--;
        }else {
            obj[year][month].days.push(i);
            obj[year][month].count++;
            obj[year].count++;
        }
        console.log(obj[year]);
        goalsObject[currentGoal].storageObject = { ...obj };
        setItemIntoStorage('store', goalsObject);
    }

    function setItemIntoStorage(key, item) {
        const stringifiedItem = JSON.stringify(item);
        localStorage.setItem(key, stringifiedItem);
    }

    function getItemFromStorage(key) {
        const item = localStorage.getItem(key);
        if(item!=null) {
            return JSON.parse(item);
        }
        return null;
    }

    var actionObject = {};
    actionObject.toggle = function(event){
        event.childNodes.forEach(element => {
            console.log(element);
            if(element.classList && element.classList.contains("dropdown")){
                element.classList.contains("hidden-drop") ? element.classList.remove("hidden-drop") : element.classList.add("hidden-drop");
            }
        });
    }

    function getModalWindow() {
        const modalBackdrop = addElement('body','div', 'modal-backdrop','', 'modal-backdrop');
        const modalDiv = addElement('modal-backdrop','div', 'modal','', 'modal');
        
        const inputTag = addElement('modal','input', 'goal-name','');
        // inputTag.addEventListener('keyup');
        const closeButton = addElement('modal','button', 'goal-set','Submit');
        closeButton.addEventListener('click', modalClosed);
    }

    function modalClosed() {
        const value = document.getElementById("goal-name").value;
        console.log(value);
        if(value){
            updateGoalObject(value);
            removeElement('modal-backdrop');
            init();
        }
        
    }

    function updateGoalObject(goalName) {
        let obj = { ...goalsObject};
        const keys = goalsObject ? Object.keys(goalsObject).sort((a,b) => a-b) : [];
        const key = keys.length>0 ? parseInt(keys[keys.length-1]) + 1 : 1;    
        obj[key]  = {'name': goalName, 'storageObject' : {}};
        goalsObject = {...obj}
        currentGoal = key;
        const element = addElement('side-panel', 'div', name+key, goalName, 'name-goal');
        (function (element) {
            console.log(element);
            element.addEventListener("click", (event, element) => clickedAction(event, element));
        }(element));
        setItemIntoStorage('store', goalsObject);
    }

    actionObject.addNewGoal = function(){
        getModalWindow();
    }
    loadGoals();
    return actionObject;

    
})();
