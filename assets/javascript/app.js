$(document).ready(function(){
   // Stores questions, answers, correct answer
    var trivia = [
        {question: "To which number shalt thou count before throwing the Holy Hand Grenade of Antioch?",
        answers: ["10!", "5! No, 3!", "Infinity!"],
        correct: 1
        },
        {question: "What is the flight speed of an unladen swallow?",
        answers: ["24mph", "23mph", "African or European?"],
        correct: 2
        },
        {question: "To prove that someone is a witch, they must weigh as much as:",
        answers: ["A stone", "A duck", "Wood"],
        correct: 1
        },
        {question: "The Knights Who Say Ni demand...",
        answers: ["A shrubbery!", "The Holy Grail!", "Huge Tracts of Land!"],
        correct: 0
        },
        {question: "Your mother was a hamster, and your father smelled of:",
        answers: ["Newts!", "Coconuts!", "Elderberries!"],
        correct: 2
        },
        {question: "What are the French doing in England?",
        answers: ["Holiday shopping.", "Mind your own business!", "Seeking the Holy Grail"],
        correct: 1
        },
        {question: "The Earth is shaped like:",
        answers: ["A Banana", "A Rabbit", "It's only a model!"],
        correct: 0
        },
        {question: "What was the name of the Enchanter?",
        answers: ["Roger", "Tim", "Robin"],
        correct: 1
        }
    ];

    $("body").append($("<button id='stopSound'>Stop Sound</button>"))

    var themeSong = new Audio("assets/sounds/themesong.mp3"),
        knightsSong = new Audio("assets/sounds/knightssong.wav")
        sirRobinSong = new Audio("assets/sounds/bravesir.wav")

    var images = [
        // images for wrong answers
        ["assets/images/wrong/bunny.gif",
        "assets/images/wrong/french.gif",
        "assets/images/wrong/monks.gif",
        "assets/images/wrong/ni.gif" ],
        // images for right answers
        ["assets/images/right/camelot.gif",
        "assets/images/right/easy.gif",
        "assets/images/right/trumpets.gif"],
        // images for score
        ["assets/images/end/blackKnight.gif",
        "assets/images/end/sad.gif",
        "assets/images/end/arthur.gif",
        "assets/images/end/god.gif",
        ]
    ]

    $("#gameArea").append("<button class='reset'>Start Quiz!</button>")
    $("#gameArea").append($("<img class='grail' src='assets/images/grail.jpg'>"))
    // used to display images after right/wrong answers
    function imageCycler(num) {
        var firstImage = images[num].shift()
        images[num].push(firstImage)
        return firstImage
    }

    // Used to randomize question order
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a
    };

    // Stops all sounds
    function stopSounds(){
        themeSong.pause()
        knightsSong.pause()
        sirRobinSong.pause()
        themeSong.currenttime = 0
        knightsSong.currenttime = 0
        sirRobinSong.currenttime = 0
    }

    // Shuffles questions, resets: current question, correct answer total, initial countdown timer
    function initialSetup() {
        stopSounds()
        themeSong.play()
        shuffle(trivia)
        currentQuestion = 0,
        correctAnswers = 0,
        countDownFrom = 10
        // Runs timer function every second
        counter = setInterval(timer, 1000)
    }
    
    // Displays question
    function displayQuestion(){
        // Clears previous content and sets up timer display
            $("#gameArea").html($("<div class='timer'>10</div>"))
            // Restarts the countdown from 10
            countDownFrom = 10
            // Builds up the question form
            var questionForm = $("<form>")
            questionForm.append($("<p class='question'>").text(trivia[currentQuestion].question))
            // Each answer in trivia object gets an input field
            $.each(trivia[currentQuestion].answers, function(index, value) {
                var answer = $("<button>").attr({"class":"answer", "value": value}).text(value)
                questionForm.append(answer).append($("<br>"))
            })
            // Adds completed questionForm to #gameArea
            $("#gameArea").append(questionForm)
    }

    // Function to check how many questions have been asked and display next one or game over summary
    function nextScreen() {
        if (currentQuestion >= trivia.length) {
            clearInterval(counter)
            displaygameOver()
        } else {
            displayQuestion()
        }
    }

    function displayCorrect() {
        $("#gameArea").html("")
        countDownFrom = 3
        $("#gameArea").html($("<div class='timer'>3</div>"))
        $("#gameArea").append($("<img src='" + imageCycler(1) + "'>"))
        $("#gameArea").append($("<p class='correct'>").text("HUZZAH!"))
    }

    function displayIncorrect() {
        $("#gameArea").html("")
        countDownFrom = 3
        $("#gameArea").html($("<div class='timer'>3</div>"))
        $("#gameArea").append($("<img src='" + imageCycler(0) + "'>"))
        $("#gameArea").append($("<p class='correct'>").text("The correct answer was: " + trivia[currentQuestion].answers[trivia[currentQuestion].correct]))
    }

    // Game over summary screen plus reset button
    function displaygameOver(){
        $("#gameArea").html("")
        // Ranking images
        if (correctAnswers <= 2){
            stopSounds()
            sirRobinSong.play()
            $("#gameArea").append($("<img>").attr("src", images[2][0]))
        } else if (correctAnswers <= 4){
            stopSounds()
            sirRobinSong.play()
            $("#gameArea").append($("<img>").attr("src", images[2][1]))
        } else if (correctAnswers <= 7){
            stopSounds()
            knightsSong.play()
            $("#gameArea").append($("<img>").attr("src", images[2][2]))
        } else {
            stopSounds()
            knightsSong.play()
            $("#gameArea").append($("<img>").attr("src", images[2][3]))
        }
        $("#gameArea").append($("<p>Correct Answers: " + correctAnswers + "/8</p>"))
        $("#gameArea").append("<button class='reset'>Restart Quiz!</button>")
        $("#gameArea").append($("<img class='grail' src='assets/images/grail.jpg'>"))
    }
    
    function timer() {
        countDownFrom--
        // If countdown reaches 0, skips the question and moves to next screen
        if (countDownFrom <= 0){
            currentQuestion++
            nextScreen()
        }
        // Displays current time left in timer class div
        $(".timer").text(countDownFrom)
    }

    // Answer Button Behavior
    $(document).on("click", ".answer", function(event){
        event.preventDefault()
        // Finds the value of the selected text box
        // var submittedAnswer = $("input:radio[name=answer]:checked").val()
        var submittedAnswer = $(this).val()
        if (submittedAnswer === trivia[currentQuestion].answers[trivia[currentQuestion].correct]) {
            correctAnswers++
            displayCorrect()
        } else {
            displayIncorrect()
        }
    })

    // Reset/start Button Behavior
    $(document).on("click", ".reset", function(event){
        event.preventDefault()
        initialSetup()
        nextScreen()
    })

    // Button to stop all sounds
    $(document).on("click", "#stopSound", function(event){
        stopSounds()
    })
})