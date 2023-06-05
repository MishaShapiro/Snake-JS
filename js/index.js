class Snake {
	constructor() {
		this._direction = "U" // Задаём начальное направление
		this._head = document.querySelector("div[data-x='10'][data-y='10']") // Ставим голову змейки в центре поля
		this._head.setAttribute("class", "snakeHead")
		this._head.dataset.len = 2
		this._head.dataset.direction = "U"
		this.x = 10
		this.y = 10
		this.snakeLength = 2

		this._body = document.querySelector("div[data-x='10'][data-y='11']") // Задаём за змейкой её часть тела
		this._body.setAttribute("class", "snake")
		this._body.dataset.len = 1

		this.wrongDirection = "D" // Отслеживаем направление, в которое не может сходить игрок, так как с той стороны сама звейка
		this.lastDirection = "U" // Запоминаем прошлое направление, чтоб, в случае изменения направления на неправильное, поменять его на прошлое
	}	// Изначально планировал использовать для такой задачи async await, но не совсем понял, как это сделать

	changeDirection(event) { // Метод, который отслеживает нажатие кнопки и переключает змейку
		if (event === "ArrowUp" && this.wrongDirection !== "D"){
			this._direction = "U"
		} else if (event === "ArrowRight" && this.wrongDirection !== "L") {
			this._direction = "R"
		} else if (event === "ArrowLeft" && this.wrongDirection !== "R") {
			this._direction = "L"
		} else if (event === "ArrowDown" && this.wrongDirection !== "U") {
			this._direction = "D"
		}
	}

	move() { // Метод движения змейки по полю
		if (this._direction == "U") { // Проверяем направление змейки
			this.y = this.y - 1 // Изменяем положение головы змейки
			if (this.y == -1) { // проверяем, не вышла ли змейка за края
				this.y = 19
			}
			this._head = document.querySelector(`div[data-x='${this.x}'][data-y='${this.y}']`) // Ищем следующую ячейку и ставим на неё голову
		} else if (this._direction == "D") { // Далее аналогичные десйтвия
			this.y = (this.y + 1)%20
			this._head = document.querySelector(`div[data-x='${this.x}'][data-y='${this.y}']`)
		} else if (this._direction == "R") {
			this.x = (this.x + 1)%20
			this._head = document.querySelector(`div[data-x='${this.x}'][data-y='${this.y}']`)
		} else if (this._direction == "L") {
			this.x = this.x - 1
			if (this.x == -1) {
				this.x = 19
			}
			this._head = document.querySelector(`div[data-x='${this.x}'][data-y='${this.y}']`)	
		}

		const frame = document.querySelector(".mainFrame")
		const score = document.querySelector(".currentScore")
		const recordScore = document.querySelector(".Record")
		const messange = document.querySelector(".messange")


		if (this._head.getAttribute("class") === "snake") { // Если змейка пошла на своё туловище, то заканчивается игра
			console.log("LOSE THE GAME!") // Изменение ID главного элемента на окончание игры
			frame.setAttribute('id', "end")
			this._head.firstElementChild.style["background-color"] = "darkred" // Изменение элемента тела, в которое врезалась голова

			if (+score.textContent > +localStorage.getItem("record")) {
				localStorage.setItem("record", score.textContent)
				recordScore.textContent = score.textContent
			}

			messange.textContent = `Your score: ${score.textContent} Click to start again`
			messange.style.display = "flex"

			return null

		} else if (this._head.getAttribute("class") === "apple") {
			console.log("FIND!")
			this._head.firstElementChild.setAttribute("style", "") // Изменяем клетку, в которой было яблоко, так как её стили могут начвать конфликтовать с головой
			 // Изменение ID главного элемента на окончание игры
			frame.setAttribute('id', "apple")

			const snakeHead = document.querySelector(".snakeHead") // Находим прошлую голову змейки
			snakeHead.setAttribute("class", "snake") // Превращаем её в body

			this.snakeLength++
			 // Обновление счётчика
			score.textContent = +score.textContent + 1

		} else {
			// Двигаем всю змейку

			const snakeBody = document.querySelectorAll(".snake") // Находим все элементы змейки
			snakeBody.forEach((value) => {
				value.dataset.len = +value.getAttribute("data-len") - 1 // Проходимся по ним и уменьшаем длину на 1
				if (value.getAttribute("data-len") === "0") { // Когда элемент становится 0, он бирается (Хвост)
					value.setAttribute("class", "")
					value.firstElementChild.setAttribute("style", "") // Удаляем все стили для дочернего элемента, чтоб они позже не конфликтовали с основными
				}
			})

			const snakeHead = document.querySelector(".snakeHead") // Находим прошлую голову змейки
			snakeHead.dataset.len = +snakeHead.getAttribute("data-len") - 1
			snakeHead.setAttribute("class", "snake") // Превращаем её в body
		}

		this._head.setAttribute("class", "snakeHead") // Располагаем новую голову змейки
		this._head.dataset.len = this.snakeLength

		// Обновление неправильного и прошлого направления
		if (this._direction === this.wrongDirection) {
			this._direction = this.lastDirection
		} else {
			this.wrongDirection = this._direction
			this.lastDirection = this._direction
		}
	}

	uploadHead() {
		const snakeBody = document.querySelectorAll(".snake > div") // Находим все элементы змейки
		snakeBody.forEach((value) => {
			value.style["border-radius"] = "8px" // Проходимся по ним и убираем стиль головы
		})

		const headDecoration = document.querySelector(".snakeHead")
		headDecoration.dataset.direction = this._direction // Изменяем data атрибут, чтоб голова змейки отображалась правильно
	}
}

class Apple {
	constructor() {
		function randomPosition() {
			let x = Math.floor(Math.random() * 20)
			let y = Math.floor(Math.random() * 20)
			const appleRect = document.querySelector(`div[data-x='${x}'][data-y='${y}']`)
			if (appleRect.getAttribute("class") === 'snake' || appleRect.getAttribute("class") === 'snakeHead') {
				return randomPosition()
			} else {
				return appleRect
			}
		}
		this._applePosition = randomPosition()
		this._applePosition.setAttribute('class', 'apple')
		this._applePosition.firstElementChild.style["border-radius"] = "50%"
	}
}

class Frame {

	constructor() {
		const record = document.querySelector(".Record")
		if (localStorage.getItem("record") == undefined) {
			record.textContent = "0"
		} else {
			record.textContent = localStorage.getItem("record")
		}
	}

	drawFrame() { // Отрисовка клеток на поле



		const frame = document.querySelector(".mainFrame")
		
		function createRect (i, j) { // Создание div(клеток), которые располагаются на поле
			let newElem = document.createElement("div")
			newElem.innerHTML = `<div><div></div></div>` // Внутрь добавляем ещё 2 div, чтоб было возможно отрисовывать задний фон, а так же декоративную часть
			newElem.style.width = "40px"
			newElem.style.height = "40px"
			if ((i + j) % 2 === 0) {
				newElem.setAttribute("data-color", "evenRect")
			} else {
				newElem.setAttribute("data-color", "oddRect")
			}
			newElem.dataset.x = j
			newElem.dataset.y = i
			newElem.dataset.len = 0 // Задаём всем div длину тела змейки 0
			return newElem
		}

		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 20; j++) {
				let newElem = createRect(i, j)
				frame.append(newElem) // Добавляем все div в общий поток
			}
		}

		const snake = new Snake(); // Создаём экземпляр класса Snake
		let apple = new Apple();

		document.addEventListener('keydown', function(e) { // Добавляем оброботчик событий
			snake.changeDirection(e.key) 
		})

		function startGame() {
			if (frame.getAttribute("id") === "wait") {
				document.querySelector(".messange").style.display = "none"
				const inter = setInterval(function (){ // Начинаем интервал (Тут будет происходить вся игра)
					snake.move() // Двигаем змейку
					snake.uploadHead()
						// Проверка на окончание игры
					if (frame.getAttribute("id") === "end") { // Проверяем, не закончилась ли игра
						document.removeEventListener('click', startGame) // Удаление оброботчика событий
						clearInterval(inter)
					} else if (frame.getAttribute("id") === "apple") {
						apple = new Apple();
						frame.setAttribute("id", "")
					}
				}, 500)	
				frame.setAttribute("id", "")
			}
		}

		document.addEventListener('click', startGame) // Запуск игры при клике
	}
}

let frm = new Frame();
frm.drawFrame();

document.addEventListener('click', function() { // Если игрок нажал ещё раз после окончания игры, то запускается новая
	let mainFrame = document.querySelector(".mainFrame")
	if (mainFrame.getAttribute("id") === "end") {
		console.log("AGAIN")
		mainFrame.innerHTML = ""
		mainFrame.setAttribute("id", "wait")
		document.querySelector(".currentScore").textContent = "0"
		document.querySelector(".messange").textContent = "Click to start"
		frm = new Frame();
		frm.drawFrame();
	}
})
