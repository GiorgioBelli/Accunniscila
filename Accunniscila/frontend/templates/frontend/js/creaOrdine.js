var total_ingredients = [];

var menu_list = [];

var currentBlockRenderer = null;

// inizialization
Ingredient.retrieveIngredients({
        onsuccess : (message)=>{
            total_ingredients = message.body;
            PizzasListRender.addPizzaToList($(".root"), list, new Pizza(js_id=list.length));
        }
    });

Menu.retrieveAvailableMenus({
    onsuccess : (message)=>{
        menu_list = message.body;
        
        $("#menu-modal .modal-header .menu_name_select").append(
            menu_list.map((menu,index)=> $(`<option data-listindex="${index}" value="${menu.name}">${menu.name}</option>`))
        );

        $("#menu-modal .modal-body").children().remove();
        $("#menu-modal .modal-body").append(PizzasListRender.createModalMenuList(menu_list[0]));
    }
})



function main() {

    list = [];

    $(".root").prepend(PizzasListRender.PizzasListRenderer(list));
    $(".btn.add-pizza").click((e) => {
        PizzasListRender.addPizzaToList($(".root"), list, new Pizza(js_id=list.length));
    });

    $(".btn.send-order").click((e) => {
        sendOrder(list);
    });

    $("select.menu_name_select").change((e)=>{
        let sel_opt = $(e.target).children("option:selected");

        $("#menu-modal .modal-body").children().remove();
        $("#menu-modal .modal-body").append(PizzasListRender.createModalMenuList(menu_list[sel_opt.attr("data-listindex")]));
    });

    
}

/**
 * Render che si occupano della gestione dell'interfaccia grafica
 */

class IngredientRenderer {

    static SeasoningRender(ingredient, onClick = (ingredient, target) => { }) {


        var html_ingredient = $(`
        <div draggable="true" class="picker ingredient" data-id="${ingredient.id}">
            <img  src="${ingredient.image}" alt="">
            <label for="name">${ingredient.name}</label>
        </div>
        `);

        html_ingredient.click((e) => {
            var target = $(e.target);
            onClick(ingredient, target);
        });

        return html_ingredient;
    }

    static createIngredientSliceSelector(slices, ingredient, onSliceSelected = (ingredient, slice) => { }) {

        $(".ingredient_slice_selector").remove();

        var html_selector = $(`
            <div class="btn-group ingredient_slice_selector" role="group" aria-label="slices"></div>
        `);


        for (let i = 1; i <= slices; i++) {
            var btn = $(`<button type="button" class="btn btn-primary" value="${i}">${i}</button>`);
            btn.click((e) => onSliceSelected(ingredient, i));
            html_selector.append(btn);
        }


        return html_selector;
    }

    static createPizzaPreviewIngredient(ingredient, slice, slices) {
        var preview_ingredient = $(`<div name="${ingredient.name}" data-slice="${slices}_${slice}" class="ingredient_preview"></div>`);
        preview_ingredient.css("z-index", ingredient.severity);
        if (slice == null) slice = 1;
        preview_ingredient.css("background-image", `url(http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/${ingredient.name}/${ingredient.name}_${slices}_${slice}.png)`)

        return preview_ingredient;


    }

    static ChoosenRender(ingredient, slice, slices, onRemove = (ingredient, slice, slices) => { }) {
        var html_ingredient = $(`
        <div class="choosed ingredient" name="${ingredient.name}" data-slice="${slices}_${slice}" data-id="${ingredient.id}">
            <div class="image">
                <img src="${ingredient.image}" alt="">
                <span class="btn remove-ingredient glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
            </div>
            <label for="name">${ingredient.name}</label>
        </div>
        `);

        var remove_ingredient_handler = ((e) => {
            onRemove(ingredient, slice, slices);
            html_ingredient.remove();
        });
        html_ingredient.find(".btn.remove-ingredient").click(remove_ingredient_handler);

        return html_ingredient;
    }
}

class PizzaRenderer {
    static createModalMenuCard(pizza, blockRenderer, onClick = (pizza, currentBlockRenderer) => { }) {
        var card = $(`<div class="myCard container">
            <div class="row">
                <img class="myCard-img col-sm" src="${pizza.image_path}">
                <div class="myCard-desc col-sm">
                    <h2>${pizza.name}</h2>
                    <p>${pizza.description}</p>
                </div>
            </div>
            <div class="row">
                <h2 class="myCard-price col-sm text-left">€ ${pizza.price}</h2>
            </div>
        </div>`);

        card.click((e) => {
            onClick(pizza, currentBlockRenderer);
            $('#menu-modal').modal("hide");

        });

        return card;

    }
}

class PizzaBlockRenderer {
    constructor(pizza,pizzas_list) {
        this.pizza = pizza;
        this.pizzas_list = pizzas_list;


        this.header = this.htmlPizzaHeader();
        this.body = this.htmlPizzaBody();



        this.block = $(`<div class="pizza_block"></div>`)
            .append(this.header)
            .append(this.body);

    }

    htmlPizzaHeader() {
        var pizza_header = $(
            `<div class="header">
                <div class="slices_selector">
                    <label for="slices">Gusti</label>
                    <div class="btn-group" role="group" aria-label="slices">
                        <button type="button" class="btn btn-primary active" value="1">1</button>
                        <button type="button" class="btn btn-primary" value="2">2</button>
                        <button type="button" class="btn btn-primary" value="3">3</button>
                    </div>
                </div>

                <div class="button-panel">
                    <button type="button" class="btn btn-default reset-pizza-block" aria-label="Trash">
                        <span class="glyphicon glyphicon-repeat" aria-hidden="false"></span>
                    </button>
                    <button type="button" class="btn btn-default remove-pizza-block" aria-label="Trash">
                        <span class="glyphicon glyphicon-trash" aria-hidden="false"></span>
                    </button>
                </div>
            </div>`
        );

        var update_slices_handler = ((e) => { 
            let target = $(e.target);
            target.siblings().removeClass("active");
            target.addClass("active");
            this.pizza.slices = parseInt(target.val());
            this.resetPizza();
        }).bind(this);
        pizza_header.find(".btn-group > button.btn").click(update_slices_handler)

        var block_remover_handler = (() => {

            let index = -1;
            this.pizzas_list.forEach((pizza,ind)=>{
                if(pizza.js_id == this.pizza.js_id) index=ind;
            })

            if(index>-1) this.pizzas_list.splice(index, 1);

            this.block.animate({
                height: "toggle",
                opacity: "toggle"
            },
                {
                    duration: 500,
                    complete: function () {
                        this.block.remove();
                    }.bind(this)
                })
        }).bind(this);
        pizza_header.find(".btn.remove-pizza-block").click(block_remover_handler);

        var reset_handler = (() => { this.resetPizza() }).bind(this);
        pizza_header.find(".btn.reset-pizza-block").click(reset_handler);

        return pizza_header;

    }

    htmlPizzaBody() {

        this.choosen_ingredients = this.htmlChoosenIngredients();
        this.pizza_preview = this.htmlPizzaPreview();

        var pizza_body = $(`<div class="body"></div>`)
            .append(this.pizza_preview)
            .append(this.htmlPizzaName())
            .append(this.choosen_ingredients)
            .append(this.htmlIngredientsPicker());

        return pizza_body;
    }

    htmlPizzaPreview() {
        return $(`<div class="pizza_preview"></div>`);
    }

    htmlPizzaName() {
        var pizza_name = $(`<input type="text" placeholder="Nome Pizza" class="pizza_name"></input>`);

        var pizza_name_handler = ((e) => { this.pizza.name = $(e.target).val(); }).bind(this);
        pizza_name.keyup(pizza_name_handler);

        return pizza_name;

    }

    htmlChoosenIngredients() {

        var choosen_ingredients = $(`<div class="container pizza_ingredients "></div>`);

        return choosen_ingredients;
    }

    addChoosenIngredient(ingredient, slice, slices) {
        if (this.pizza_preview.find(`div[name="${ingredient.name}"][data-slice="${slices}_${slice}"]`).length) {
            //already picked
            return;
        }
        this.pizza.addIngredient([ingredient, slice]);

        var onIngredientRemove = ((ingredient, slice, slices) => {
            this.removeChoosenIngredient(ingredient, slice, slices);
        }).bind(this);

        this.pizza_preview.append(IngredientRenderer.createPizzaPreviewIngredient(ingredient, slice, slices))
        this.choosen_ingredients.append(IngredientRenderer.ChoosenRender(ingredient, slice, slices, onIngredientRemove));

    }

    removeChoosenIngredient(ingredient, slice, slices) {
        let index = -1;
        this.pizza.chosenIngredients.forEach((element, i) => {
            if ((element[0] == ingredient) && (element[1] == slice)) index = i;
        });
        this.pizza.chosenIngredients.splice(index, 1);

        //remove from pizza preview
        this.pizza_preview.find(`div[name="${ingredient.name}"][data-slice="${slices}_${slice}"]`).remove();


    }

    resetPizza() {
        this.pizza.chosenIngredients = [];
        this.pizza_preview.children().remove();
        this.choosen_ingredients.children().remove();
    }

    htmlIngredientsPicker() {

        var container = $(`<div class="container"><div class="ingredients_picker_container row"></div></div>`);

        var html_ingredient_picker = $(`<div id="ingredients_picker" class="ingredients_picker col-sm-10"></div>`);

        var onIngredientPicked = ((ingredient, target) => {

            if (this.pizza.slices > 1) {
                var ingredient_slice_selector = IngredientRenderer.createIngredientSliceSelector(
                    this.pizza.slices,
                    ingredient,
                    ((ingredient, slice) => {
                        this.addChoosenIngredient(ingredient, slice, this.pizza.slices);
                    }).bind(this)
                )

                ingredient_slice_selector.click()

                target.before(ingredient_slice_selector)
            } else {
                this.addChoosenIngredient(ingredient, 1, this.pizza.slices);

            }


        }).bind(this);

        html_ingredient_picker.append(
            total_ingredients.map(
                (ingredient) => IngredientRenderer.SeasoningRender(ingredient, (ingredient, target) => onIngredientPicked(ingredient, target))
            )
        );

        var html_btn_from_menu = $(`<button type="button"  data-toggle="modal" data-target="#menu-modal" class="btn btn-warning text-nowrap add-from-menu col-sm-1">apri menu</button>`);

        html_btn_from_menu.click((() => { window.currentBlockRenderer = this }).bind(this))

        container.find(".row").append(html_ingredient_picker);
        container.find(".row").append(html_btn_from_menu);

        return container;
    }

    render() {
        return this.block;
    }
}

class PizzasListRender {

    static PizzasListRenderer(pizzas_list = []) {
        return pizzas_list.map((pizza) => new PizzaBlockRenderer(pizza,pizzas_list).render());
    }

    static addPizzaToList(listItem, pizzas_list, pizza) {
        pizzas_list.push(pizza);
        listItem.find("div.btn-panel").before(new PizzaBlockRenderer(pizza,pizzas_list).render());
    }

    static createModalMenuList(menu = new Menu()) {
        var onItemClick = (pizza, blockRenderer) => {
            blockRenderer.resetPizza();
            pizza.chosenIngredients.forEach(pizza_ingredient => {
                blockRenderer.addChoosenIngredient(pizza_ingredient.ingredient, pizza_ingredient.slice.number, pizza.slices);
            });
        };

        let pizzas_list = menu.pizzas;

        return pizzas_list.map((pizza) => PizzaRenderer.createModalMenuCard(pizza, currentBlockRenderer, onItemClick));
    }
}

/**
 * funzioni di interfaccia con le API backend
 */

 function sendOrder(pizzas){
    if( pizzas.length == 0 ) {
        return 0;
    }

    var data = { "user" : "1", 
                 "withdrawal"  : "Piazza Abbugodaus",
                 "pizza" : []
            };
    for (let i = 0; i < pizzas.length; i++) {
        const pizza = pizzas[i];
        
        var temp = { "name" : pizza.name,
                     "totalSlice" : pizza.slices
                };
        
        for (let j = 0; j < pizza.ch.length; j++) {
            const ingredient = pizza.ingredients[j];
            
        }
        
        
        console.log(pizza);
    }
    console.log(data);
 }
 


$(document).ready(main);