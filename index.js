class Gacha {
    constructor() {
        this.op = this.initializeTiers();
        this.own = this.initializeTiers();
        this.get = [];
        this.result = document.querySelector(".result");
        this.dataFetched = false;
        this.currentIndex = 0;
    }

    initializeTiers() {
        return {
            'TIER_6': [],
            'TIER_5': [],
            'TIER_4': [],
            'TIER_3': [],
            'TIER_2': [],
            'TIER_1': []
        };
    }

    async fetchData() {
        if (!this.dataFetched) {
            try {
                const response = await fetch('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json');
                const data = await response.json();
                this.processData(data);
                this.dataFetched = true;
            } catch (error) {
                console.error(error);
            }
        }
    }

    processData(data) {
        for (const key in data) {
            if (key.startsWith("char")) {
                const charData = data[key];
                if (charData.itemObtainApproach === "Recruitment & Headhunting") {
                    this.op[charData.rarity].push({ name: charData.name, img: key });
                }
            }
        }
        console.log(this.op);
    }

    async gacha(pull) {
        this.result.innerHTML = ""
        this.get.length = 0;
        await this.fetchData();

        const existingRes = document.querySelectorAll(".res");
        existingRes.forEach(element => element.remove());

        for (let i = 0; i < pull; i++) {
            const div = document.createElement("div");
            div.className = "res mx-1";
            
            const rate = Math.random() * 100;
            const rarity = this.determineRarity(rate);

            const randomStar = this.op[rarity][Math.floor(Math.random() * this.op[rarity].length)];
            console.log(randomStar);
            const get = { name: randomStar.name, img: randomStar.img, rarity: rarity[rarity.length - 1] };
            this.own[rarity].push(get);
            this.get.push(get);

            const img = document.createElement("img");
            img.src = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${randomStar.img}_1.png`;
            img.width = 90;
            img.height = 160;
            img.style.objectFit = "cover";
            img.style.objectPosition = "top";

            switch (rarity[rarity.length - 1]) {
                case '6':
                    div.style.backgroundColor = "#fed54a";
                    break;
                case '5':
                    div.style.backgroundColor = "#ffedcc";
                    break;
                case '4':
                    div.style.backgroundColor = "#c0a8f7";
                    break;
                default:
                    div.style.backgroundColor = "#fff";
            }
            div.style.borderRadius = "5px"
            div.style.boxShadow = "black"
            div.style.padding = "2%"
            div.className = "card mt-4 mx-auto"

            const paragraph = document.createElement("p");
            paragraph.textContent = `★${rarity.charAt(rarity.length - 1)}\t${get.name}\n`;

            div.appendChild(img);
            div.appendChild(paragraph);
            this.result.appendChild(div);

            console.log(this.get);
        }
        this.showGacha(this.get);
    }

    determineRarity(rate) {
        if (rate < 2) return "TIER_6";
        if (rate <= 16) return "TIER_5";
        if (rate < 51) return "TIER_4";
        return "TIER_3";
    }

    inventory() {
        const existP = document.body.querySelector('p');
        if (existP) existP.remove();

        const invenP = document.createElement("p");
        invenP.textContent = JSON.stringify(this.own);
        document.body.appendChild(invenP);
    }

    showGacha(list) {
        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = "";

        if (list.length > 0) {
            this.currentIndex = 0;

            const operatorName = document.createElement("p");
            const operatorImg = document.createElement("img");
            const operatorRarity = document.createElement("p");

            this.updateModalContent(list, operatorName, operatorRarity, operatorImg);
            modalBody.appendChild(operatorName);
            modalBody.appendChild(operatorRarity);
            modalBody.appendChild(operatorImg);

            const showNextOperator = () => {
                this.currentIndex++;
                if (this.currentIndex < list.length) {
                    this.updateModalContent(list, operatorName, operatorRarity, operatorImg);
                    console.log(this.currentIndex);
                } else {
                    const modal = bootstrap.Modal.getInstance(document.querySelector("#recruitment"));
                    modal.hide();
                    modalBody.removeEventListener("click", showNextOperator);
                }
            };
            modalBody.addEventListener("click", showNextOperator);
        }
    }

    updateModalContent(list, operatorName, operatorRarity, operatorImg) {
        const rarity = list[this.currentIndex].rarity;
        const charRarity = this.getRarityStars(rarity);
        operatorName.textContent = list[this.currentIndex].name;
        operatorRarity.textContent = charRarity;
        operatorImg.src = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${list[this.currentIndex].img}_1.png`;
        operatorImg.style.display = "block";
        operatorImg.style.margin = "0 auto";
        operatorImg.style.height = "60%";
        operatorImg.style.width = "100%";
        operatorImg.style.objectFit = "cover";
        operatorImg.style.objectPosition = "top";

        const modalContent = document.querySelector(".modal-content");
        switch (rarity) {
            case '6':
                operatorImg.style.backgroundColor = "#fed54a";
                modalContent.style.backgroundColor = "#fed54a";
                break;
            case '5':
                operatorImg.style.backgroundColor = "#ffedcc";
                modalContent.style.backgroundColor = "#ffedcc";
                break;
            case '4':
                operatorImg.style.backgroundColor = "#c0a8f7";
                modalContent.style.backgroundColor = "#c0a8f7";
                break;
            default:
                operatorImg.style.backgroundColor = "#fff";
                modalContent.style.backgroundColor = "#fff";
        }
    }

    getRarityStars(rarity) {
        return "★".repeat(Number(rarity));
    }
}

const gacha = new Gacha();
