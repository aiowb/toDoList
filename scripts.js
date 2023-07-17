// Beginn der Funktion, die ausgeführt wird, wenn das Dokument bereit ist
$(document).ready(function() {
    // Hier nutzen wir den Webstorage (localStorage) um die Ordner zu speichern und wieder abzurufen
    let folders = localStorage.getItem('folders');
    // Wenn Daten vorhanden sind, verwandle sie in ein JavaScript-Objekt. Wenn nicht, verwende ein Standard-Array von Ordnern
    folders = folders ? JSON.parse(folders) : [
        { name: "Arbeitsprojekt", todos: [] },
        { name: "Pers\u00f6nliche Besorgungen", todos: [] }
    ];

    // Funktion zum Erzeugen des HTML für eine einzelne Aufgabe. Hier findet die Erzeugung und Integration von DOM-Teilbäumen statt.

    function createTodoHTML(todo) {
        return `
            <div class="todo-item">
                <input type="checkbox" ${todo.done ? 'checked' : ''}>
                <p style="${todo.done ? 'text-decoration: line-through' : ''}">${todo.task}</p>
                <button class="delete-button"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }

        // Funktion zum Erzeugen des HTML für einen einzelnen Ordner. Auch hier findet die Erzeugung und Integration von DOM-Teilbäumen statt.

    function createFolderHTML(folder) {
        return `
            <div class="folder col-sm-6">
                <h2>${folder.name}</h2>
                <div class="todo-form">
                    <input type="text" placeholder="Neue Aufgabe hinzufügen">
                    <button class="add-button"><i class="fas fa-plus"></i></button>
                    <button class="delete-all-button"><i class="fas fa-trash"></i></button>
                </div>
                <div class="todo-list">
                    ${folder.todos.map(createTodoHTML).join("")}
                </div>
            </div>
        `;
    }

    // Funktion zum Rendern der Ordner auf der Seite
    function render() {
        const folderListHTML = folders.map(createFolderHTML).join("");
        $("#folder-list").html(folderListHTML);
    }

    // Hier finden wir die Arbeit mit Events: die Event-Listener für die Buttons und Eingabefelder

    function addEventListeners() {
        // Event-Listener für den "Hinzufügen"-Button
        $(".add-button").click(function() {
            const task = $(this).prev().val();
            const todo = { task, done: false };
            const folderIndex = $(this).closest('.folder').index();
            folders[folderIndex].todos.push(todo);
            localStorage.setItem('folders', JSON.stringify(folders));
            render();
            addEventListeners();
        });

        // Event-Listener für den "Alle löschen"-Button
        $(".delete-all-button").click(function() {
            const folderIndex = $(this).closest('.folder').index();
            folders[folderIndex].todos = [];
            localStorage.setItem('folders', JSON.stringify(folders));
            render();
            addEventListeners();
        });

        // Event-Listener für die Checkbox einer Aufgabe
        $(".todo-item input[type='checkbox']").change(function() {
            const index = $(this).closest(".todo-item").index();
            const folderIndex = $(this).closest('.folder').index();
            folders[folderIndex].todos[index].done = this.checked;
            localStorage.setItem('folders', JSON.stringify(folders));
            render();
            addEventListeners();
        });

        // Event-Listener für den "Löschen"-Button einer Aufgabe
        $(".delete-button").click(function() {
            const index = $(this).closest(".todo-item").index();
            const folderIndex = $(this).closest('.folder').index();
            folders[folderIndex].todos.splice(index, 1);
            localStorage.setItem('folders', JSON.stringify(folders));
            render();
            addEventListeners();
        });
    }

    // Rendern der Seite und Hinzufügen von Event-Listenern, wenn das Dokument bereit ist
    render();
    addEventListeners();

    // Hier nutzen wir AJAX, um das Wetter abzurufen. Auch wenn es simuliert ist, zeigt es den typischen Umgang mit AJAX in JavaScript.

    function getWeather() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve({
                    current: {
                        weather_descriptions: ["Teilweise bewölkt"],
                        temperature: 20
                    }
                });
            }, 1000);
        });
    }

    // Ruft die Wetterdaten ab und fügt sie dem HTML der Seite hinzu
    getWeather().then(function(response) {
        const weatherDescription = response.current.weather_descriptions[0];
        const temperature = response.current.temperature;
        $('#weather').html(`Das aktuelle Wetter in Augsburg ist: ${weatherDescription}. Die aktuelle Temperatur ist: ${temperature}°C.`);
    });
});