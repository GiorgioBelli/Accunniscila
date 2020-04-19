function main(){
    mushroom = new Ingredient(
        1,
        "mushroom",
        3,
        3,
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    potato = new Ingredient(
        2,
        "potato",
        2,
        2,
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    tomato = new Ingredient(
        3,
        "tomato",
        5,
        1,
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    olives = new Ingredient(
        4,
        "olives",
        10,
        3,
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );

    pizza1 = new Pizza("nome1",1,"http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/pizza.png",[mushroom,potato,tomato]);
    pizza2 = new Pizza("nome2",1,"http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/pizza.png",[olives,potato,tomato]);
    pizza3 = new Pizza("nome3",1,"http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/pizza.png",[olives,potato,tomato]);
    pizza4 = new Pizza("nome4",1,"http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/pizza.png",[olives,potato,tomato]);

    menuz = new Menu(name = "menu1", pizzas = [pizza1, pizza2, pizza3, pizza4]); 

    $(".base").append(MenuRenderer.render(menuz))
}

class MenuRenderer{
    static createMenuCard(pizza){
        var card = $(`<div class="myCard"></div>`);
        var cardImg = $(`<img class="myCard-img" src="${pizza.image_path}"></img>`);
        var cardDesc = $(`<div class="myCard-desc"></div>`);
            var name = $(`<h2>${pizza.name}</h2>`);
            var description = $(`<p>${pizza.description}<p>`);
            var cardPrice = $(`<h2 class="myCard-price text-left">€ ${pizza.price}</h2>`);
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