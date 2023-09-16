class Gacha {
    constructor() {
        this.op = {
            '6star': [],
            '5star': [],
            '4star': [],
            '3star': [],
            '2star': [],
            '1star': []
        };
        this.own = {
            '6star': [],
            '5star': [],
            '4star': [],
            '3star': [],
            '2star': [],
            '1star': []
        };
        this.result = document.querySelector(".result")
        this.dataFetched = false;
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
                if (
                    charData.rarity >= 1 &&
                    charData.rarity <= 6 &&
                    charData.description !== null &&
                    charData.subProfessionId !== "notchar1" &&
                    charData.subProfessionId !== "notchar2" &&
                    charData.isNotObtainable === false
                ) {
                    this.op[charData.rarity + 1 + 'star'].push({ "name": charData.name, "img": key });
                }
            }
        }
    }

    async gacha(pull) {
        await this.fetchData();

        // Menghapus semua elemen div dengan kelas "res" yang sudah ada
        const existingRes = document.querySelectorAll(".res");
        existingRes.forEach(element => element.remove());

        for (let i = 0; i < pull; i++) {
            const div = document.createElement("div");
            div.className = "res mx-1";
            const rate = Math.random() * 100;
            let rarity = 0;

            if (rate < 2) {
                rarity = 6;
            } else if (rate > 2 && rate < 16) {
                rarity = 5;
            } else if (rate > 16 && rate < 51) {
                rarity = 4;
            } else if (rate > 51) {
                rarity = 3;
            }

            const randomStar = this.op[rarity + "star"][Math.floor(Math.random() * this.op[rarity + "star"].length)];
            const get = { "name": randomStar["name"], "img": randomStar["img"] };
            this.own[rarity + "star"].push(get);

            const img = document.createElement("img");
            img.src = "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/portraits/" + randomStar["img"] + "_1.png";
            img.width = 90;
            img.height = 160;

            const paragraph = document.createElement("p");
            paragraph.textContent = "★" + rarity + "\t" + get["name"] + "\n";

            div.appendChild(img);
            div.appendChild(paragraph);
            this.result.appendChild(div);
        }
    }

    inventory() {
        const existP = document.body.querySelector('p');
        if (existP) {
            existP.remove();
        }

        const invenP = document.createElement("p");
        invenP.textContent = JSON.stringify(this.own);
        document.body.appendChild(invenP);
    }
}

const gacha = new Gacha();
