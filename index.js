class Gacha {
    constructor() {
        this.op = {
            'TIER_6': [],
            'TIER_5': [],
            'TIER_4': [],
            'TIER_3': [],
            'TIER_2': [],
            'TIER_1': []
        };
        this.own = {
            'TIER_6': [],
            'TIER_5': [],
            'TIER_4': [],
            'TIER_3': [],
            'TIER_2': [],
            'TIER_1': []
        };
        this.result = document.querySelector(".result")
        this.dataFetched = false;
    }

    async fetchData() {
        if (!this.dataFetched) {
            try {
                const response = await fetch('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json');
                const data = await response.json();
                //console.log(data)
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
                //console.log(charData)
                if (
                    charData.rarity == "TIER_1" ||
                    charData.rarity == "TIER_2" ||
                    charData.rarity == "TIER_3" ||
                    charData.rarity == "TIER_4" ||
                    charData.rarity == "TIER_5" ||
                    charData.rarity == "TIER_6" &&
                    charData.description !== null &&
                    charData.subProfessionId !== "notchar1" &&
                    charData.subProfessionId !== "notchar2" &&
                    charData.isNotObtainable === false &&
                    charData.maxPotentialLevel === 0
                ) {
                    this.op[charData.rarity].push({ "name": charData.name, "img": key });
                }
            }
        }
        console.log(this.op)
    }

    async gacha(pull) {
        await this.fetchData();

        const existingRes = document.querySelectorAll(".res");
        existingRes.forEach(element => element.remove());

        for (let i = 0; i < pull; i++) {
            const div = document.createElement("div");
            div.className = "res mx-1";
            const rate = Math.random() * 100;
            let rarity = 0;

            if (rate < 2) {
                rarity = "TIER_6";
            } else if (rate > 2 && rate < 16) {
                rarity = "TIER_5";
            } else if (rate > 16 && rate < 51) {
                rarity = "TIER_4";
            } else if (rate > 51) {
                rarity = "TIER_3";
            }

            const randomStar = this.op[rarity][Math.floor(Math.random() * this.op[rarity].length)];
            const get = { "name": randomStar["name"], "img": randomStar["img"] };
            this.own[rarity].push(get);

            const img = document.createElement("img");
            img.src = "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/portraits/" + randomStar["img"] + "_1.png";
            img.width = 90;
            img.height = 160;

            const paragraph = document.createElement("p");
            paragraph.textContent = "★" + rarity.charAt(rarity.length - 1) + "\t" + get["name"] + "\n";

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
