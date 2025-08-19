// When DOM is Loaded thenonly we will execute the JS File
document.addEventListener("DOMContentLoaded",
    function () {

        // -----------DOM ELEMENTS--------------
        // user-Container -> input,searchButton
        const searchButton = document.getElementById("search-btn");
        const usernameInput = document.getElementById("user-input");
        // stats-Container ->progress-items(easy,med,hard) [span]
        const statsContainer = document.querySelector(".stats-container");
        const easyProgressCircle = document.querySelector(".easy-progress");
        const mediumProgressCircle = document.querySelector(".medium-progress");
        const hardProgressCircle = document.querySelector(".hard-progress");
        // Lables of Circle
        const easyLabel = document.getElementById("easy-label");
        const mediumLabel = document.getElementById("medium-label");
        const hardLabel = document.getElementById("hard-label");
        // Cards
        const cardStatsContainer = document.querySelector(".stats-cards");



        // --------------ACTUAL LOGIC-----------------

        // -------- Function1: Validate LeetCode username --------
        function validatedUsername(username) {
            // Base Case: Empty String? => Yes -> Alert(False)
            if (username.trim() === "") {
                alert("Username should not be empty");
                return false;
            }
            // Regex Expression for Validate UserId(Source: ChatGPT)
            const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{0,13}[a-zA-Z0-9])?$/;
            const isMatching = regex.test(username);
            // If Invalid -> Alert
            if (!isMatching)
                alert("Username sis Invalid");

            return isMatching;
        }

        // -------- Function2: FETCH USER DATA (It will be Async cause API call) --------
        async function fetchUserDetails(username) {
            // URL(Source: leetcode stats api)
            const targetUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;

            try {
                // Show loading state
                searchButton.textContent = "Searching..."
                searchButton.disabled = true;


                // Fetch the response from the url
                const response = await fetch(targetUrl);
                // If Response is not OK -> Throw Error
                if (!response.ok) {
                    throw new Error("Unable to fetch the User details");
                }

                // If Response is OK status -> fetch the Data from it(JSON)
                const JSONdata = await response.json();
                // console.log(JSONdata);

                // Display the User Data in UI
                displayUserData(JSONdata);

            }
            catch (error) {
                statsContainer.innerHTML = `<p>${error.message}</p>`
            }
            // (Revert) When we are Fetching the Button-> Searching hidden/disable 
            finally {
                searchButton.textContent = "Search"
                searchButton.disabled = false;
            }

        }

        // -------- Function 4: UPDATE PROGRESS CIRCLE -------- 
        function updateProgress(solved, total, label, circle) {
            // Calculate percentage/Degree
            const progressDegree = (solved / total) * 100;
            // Update progress-degree in style of Circle
            circle.style.setProperty("--progress-degree", `${progressDegree}%`);
            // Easy ,  Medium, Hard Colors
            if(label===easyLabel)
                circle.style.setProperty("--progress-color", 'green');
            else if(label===mediumLabel)
                circle.style.setProperty("--progress-color", 'orange');
            else 
                circle.style.setProperty("--progress-color", 'red');
            // Update Label to show how many questions are solved
            label.textContent = `${solved}/${total}`
        }


        // --------  Function3: DISPLAY DATA IN UI (Helper -> JSON Formatter & Validator)-------- 
        function displayUserData(JSONdata) {
            // Total Questions
            const totalEasyQuestions = JSONdata.totalEasy;
            const totalMediumQuestions = JSONdata.totalMedium;
            const totalHardQuestions = JSONdata.totalHard;

            // Solved Questions
            const totalEasySolved = JSONdata.easySolved;
            const totalMediumSolved = JSONdata.mediumSolved;
            const totalHardSolved = JSONdata.hardSolved;


            // Update the Progress Circles
            updateProgress(totalEasySolved, totalEasyQuestions, easyLabel, easyProgressCircle); //Easy
            updateProgress(totalMediumSolved, totalMediumQuestions, mediumLabel, mediumProgressCircle); //Medium
            updateProgress(totalHardSolved, totalHardQuestions, hardLabel, hardProgressCircle); //Hard

            // Card Data Generate(Dynamically)
            const cardsData = [
                { label: "Total Questions Solved: ", value: JSONdata.totalSolved },
                { label: "Acceptence Rate(%): ", value: JSONdata.acceptanceRate },
                { label: "Ranking: ", value: JSONdata.ranking },
                { label: "Contribution Points: ", value: JSONdata.contributionPoints },
            ];

            // Generate Element to show Card Data (Dynamically)
            cardStatsContainer.innerHTML = cardsData.map(
                data => {
                    return `
                    <div class='card'>
                    <h4>${data.label} </h4>
                    <p> ${data.value}</p>
                    </div>
                    `
                }
            ).join("")

        }

        // ************** Starts Here **************
        // 1.User will put username & search -> eventListener on search button
        searchButton.addEventListener('click', function () {
            // 1.Fetch the Username
            const username = usernameInput.value;
            // console.log(username);
            // 2.Fetch User Data(if Valid username only)
            if (validatedUsername(username)) {
                fetchUserDetails(username)
            }

        });
    }
);
