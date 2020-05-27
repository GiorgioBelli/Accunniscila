
function main(){


    Menu.retrieveAvailableMenus({
        onsuccess : (message)=>{
            menu_list = message.body;
    
            $("#menu-modal .modal-header .menu_name_select").append(
                menu_list.map((menu,index)=> $(".base").append(MenuRenderer.render(menu)))
            );
        }
    })



}

class MenuRenderer{
    static createMenuCard(pizza){
        var card = $(`<div class="myCard"></div>`);
        var cardImg = $(`<img class="myCard-img" src="${pizza.image_path}"></img>`);
        var cardDesc = $(`<div class="myCard-desc"></div>`);
            var name = $(`<h2>${pizza.name}</h2>`);
            var description = $(`<p>${Pizza.getDescription(pizza)}<p>`);
            var cardPrice = $(`<h2 class="myCard-price text-left">€ ${Pizza.calcPrice(pizza)}</h2>`);
            cardDesc.append(name);
            cardDesc.append(description);
            cardDesc.append(cardPrice);

        card.append(cardImg);
        card.append(cardDesc);

        return card;
    }

    static menuRowsRender(pizzas, position){
        var row = $(`<div class="row justify-content-center align-items-center"></div>`);
        for(var c=0; c < 2; c++){
            var column = $(`<div class="col-sm"></div>`)
            if( pizzas[position] != undefined )
                column.append(this.createMenuCard(pizzas[position]));
            row.append(column);
            position++;
        }
        return row;
    }

    static render(menu){
        var body = $(`<div class="menu container"></div>`);

        let header = $(`
            <div class="row menu-header">
                <div class="col-sm-12 text-left">
                    <h1>${menu.name}</h1>
                    <hr>
                </div>
            </div>
        `);

        body.append(header)

        var nrow = Math.round(menu.pizzas.length);
        var position = 0;
        for (var r = 0; r < nrow; r++) {
            var row = this.menuRowsRender(menu.pizzas, position);
            body.append(row);
            position += 2;
        }

        return body;
    }
}


$(document).ready(main);