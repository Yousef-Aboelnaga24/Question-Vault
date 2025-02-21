let btnCreate = document.getElementById("create");
let box = document.getElementById("box");

btnCreate.addEventListener("click", (event) => {
    event.preventDefault();

    let question = document.getElementById("front").value.trim();
    let answer = document.getElementById("back").value.trim();
    let imageInput = document.getElementById("imageInput");
    let file = imageInput.files[0];

    if (!question || !answer) {
        alert("Please fill out all fields!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function () {
        let imageBase64 = file ? reader.result : "";

        let cardHTML = `
            <div class="card pt-2" onclick="flipCard(this)">
                <div class="btns">
                    <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                    <button onclick='update(this)' class="btn btn-sm"><i class="fa fa-marker fs-6 text-black"></i></button>
                </div>
                <div class="front">
                    ${imageBase64 ? `<img src="${imageBase64}" class="card-img">` : ""}
                    <p>${answer}</p>
                </div>
                <div class="back"><p>${question}</p></div>
            </div>`;

        box.innerHTML += cardHTML;

        let cards = JSON.parse(localStorage.getItem("cards")) || [];
        cards.push({ question, answer, image: imageBase64 });
        localStorage.setItem("cards", JSON.stringify(cards));

        document.getElementById("front").value = "";
        document.getElementById("back").value = "";
        imageInput.value = "";
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload();
    }
});
