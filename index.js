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
        this.output = document.querySelector("p");
        this.paragraph = document.createElement("p");
        this.dataFetched = false;
    }

    async fetchData() {
        if (!this.dataFetched) {
            return fetch('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json')
            .then(response => response.json())
            .then(data => {
                this.processData(data);
                this.dataFetched = true;
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    processData(data) {
        for (var i in data) {
            if (data[i].rarity == 5 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['6star'].push(data[i].name)
            }
            else if (data[i].rarity == 4 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['5star'].push(data[i].name)
            }
            else if (data[i].rarity == 3 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['4star'].push(data[i].name)
            }
            else if (data[i].rarity == 2 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['3star'].push(data[i].name)
            }
            else if (data[i].rarity == 1 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['2star'].push(data[i].name)
            }
            else if (data[i].rarity == 0 && data[i].description != null && data[i].subProfessionId != "notchar1" && data[i].subProfessionId != "notchar2" && data[i].isNotObtainable == false) {
                this.op['1star'].push(data[i].name)
            }
        }
    }

    async gacha(pull) {
        await this.fetchData();

        if (this.output) {
            this.output.remove();
        }

        this.paragraph.textContent = ''

        for (let i = 0; i < pull; i++) {
            var rate = Math.random() * 100;
            if (rate < 2) {
                var get = this.op["6star"][Math.floor(Math.random() * this.op["6star"].length)];
                this.own["6star"].push(get);
                this.paragraph.textContent += `★★★★★★\t ${get}\n`;
            }
            else if (rate > 1 && rate < 16) {
                var get = this.op["5star"][Math.floor(Math.random() * this.op["5star"].length)];
                this.own["5star"].push(get);
                this.paragraph.textContent += `★★★★★\t${get}\n`;
            }
            else if (rate > 15 && rate < 51) {
                var get = this.op["4star"][Math.floor(Math.random() * this.op["4star"].length)];
                this.own["4star"].push(get);
                this.paragraph.textContent += `★★★★\t${get}\n`;
            }
            else if (rate > 50 && rate < 100) {
                var get = this.op["3star"][Math.floor(Math.random() * this.op["3star"].length)];
                this.own["3star"].push(get);
                this.paragraph.textContent += `★★★\t${get}\n`;
            }
            document.body.appendChild(this.paragraph)
        }
    }

    inventory() {
        const existP = document.body.querySelector('p');
        if (existP) {
            existP.remove()
        }

        const invenP = document.createElement("p");
        invenP.textContent = JSON.stringify(this.own)
        document.body.appendChild(invenP)
    }
}

const gacha = new Gacha();
