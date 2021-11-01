var total_ingredients = [];

var menu_list = [];
var list = [];

var currentBlockRenderer = null;

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

    Ingredient.retrieveIngredients({
        onsuccess : (message)=>{
            total_ingredients = message.body;
            PizzasListRender.addPizzaToList($(".root"), list, new Pizza(js_id=list.length));
        }
    });

    $("#datetime").datetimepicker({
        format: 'd-m-Y H:i', step: 15
    });

    $("#datetime-icon").click(function(){
        $("#datetime").focus();
    });

    $(".root").prepend(PizzasListRender.PizzasListRenderer(list));
    $(".btn.add-pizza").click((e) => {
        PizzasListRender.addPizzaToList($(".root"), list, new Pizza(js_id=list.length));
    });

    $(".btn.send-order").click((e) => {
        if( $("#address").val().replace(/\s/g, '') == "" || $("#datetime").val() == "" )
            AlertRenderer.render(400, "Assicurati di Inserire un Indirizzo e una data di consegna corretti !", "");
        else 
            sendOrder(list);
    });

    $(".btn.order").click((e) => {
        PizzasListRender.fillModalBody(list);
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
        <div class="picker ingredient" data-id="${ingredient.id}">
            <img  src="${ingredient.image}" alt="">
            <label for="name">${ingredient.nameToShow}</label>
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
        preview_ingredient.css("background-image", `url("/static/condimenti/${ingredient.name}/${ingredient.name}_${slices}_${slice}.png")`)

        return preview_ingredient;


    }

    static ChoosenRender(ingredient, slice, slices, onRemove = (ingredient, slice, slices) => { }) {
        var html_ingredient = $(`
        <div class="choosed ingredient" name="${ingredient.name}" data-slice="${slices}_${slice}" data-id="${ingredient.id}">
            <div class="image">
                <img src="${ingredient.image}" alt="">
                <span class="btn remove-ingredient glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
                <span class="slice-badge-ingredient" data-slice="${slice}">${slice}</span>
            </div>
            <label for="name">${ingredient.nameToShow}</label>
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

        var card = $(`<div class="myCard menu container">
            <div class="row">
                <img class="myCard-img menu col-sm" src="${pizza.image_path}">
                <div class="myCard-desc menu col-sm">
                    <h2>${pizza.name}</h2>
                    <p>${Pizza.getDescription(pizza)}</p>
                </div>
            </div>
            <div class="row">
                <h2 class="myCard-price menu col-sm text-left">€ ${Pizza.calcPrice(pizza)}</h2>
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
        return $(`<div class="pizza_preview"><div class="priceLabel">0.00€</div></div>`);
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

        let last_element = this.choosen_ingredients.find(`.choosed.ingredient [data-slice=${slice}]`).last().closest(".choosed.ingredient")[0];
        if(last_element == null) this.choosen_ingredients.append(IngredientRenderer.ChoosenRender(ingredient, slice, slices, onIngredientRemove))
        else (IngredientRenderer.ChoosenRender(ingredient, slice, slices, onIngredientRemove)).insertAfter(last_element);

        this.updatePizzaPrice(this.pizza.price);
    }

    updatePizzaPrice(price){
        this.pizza_preview.find(`div.priceLabel`).text(price + "€");
    }

    removeChoosenIngredient(ingredient, slice, slices) {
        let index = -1;
        this.pizza.chosenIngredients.forEach((element, i) => {
            if ((element[0] == ingredient) && (element[1] == slice)) index = i;
        });
        this.pizza.chosenIngredients.splice(index, 1);

        //remove from pizza preview
        this.pizza_preview.find(`div[name="${ingredient.name}"][data-slice="${slices}_${slice}"]`).remove();

        this.updatePizzaPrice(this.pizza.price);
    }

    resetPizza() {
        this.pizza.chosenIngredients = [];
        this.updatePizzaPrice(this.pizza.price);
        this.pizza_preview.children(".ingredient_preview").remove();
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
            blockRenderer.block.find(`.slices_selector>.btn-group>.btn:nth-child(${pizza.slices})`).click();
            pizza.chosenIngredients.forEach(pizza_ingredient => {
                blockRenderer.addChoosenIngredient(pizza_ingredient.ingredient, pizza_ingredient.slice.number, pizza.slices);
            });
        };

        let pizzas_list = menu.pizzas;

        return pizzas_list.map((pizza) => PizzaRenderer.createModalMenuCard(pizza, currentBlockRenderer, onItemClick));
    }

    static fillModalBody(list){    
        $(".modal-body.confirm").empty();
        var body = $("<div class='container'></div>");
        var title = $("<div class='row'></div>");
        title.append("Sicuro di voler procedere con il seguente ordine ?<br><br>");
        body.append(title);

        var totalPrice = 0;

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            var pizza = $("<div></div>");
            var pizza_header = $("<div class='row'></div>");
            var pizza_body = $("<div class='row'></div>");

            var name = $("<div class='col'></div>").append($("<h3></h3>").append(element.name));
            var price = $("<div class='col text-right'></div>").append($("<h3></h3>").append("€" + element.price));

            totalPrice += parseFloat(element.price);

            var ing = $("<div class='col'></div>").append($("<h6></h6>").append(element.description.replace(new RegExp('<br>', 'g'), '')));

            pizza_header.append(name);
            pizza_header.append(price);
            pizza_body.append(ing);
            pizza.append(pizza_header);
            pizza.append(pizza_body);
            body.append(pizza);
            body.append($("<hr>"));
        }
        var body_footer = $("<div class='row'></div>");
        var ind = $("<div class='col'></div>").append($("<h3></h3>").append($("#address").val()));
        var wit = $("<div class='col'></div>").append($("<h3></h3>").append($("#datetime").val()));
        var tot = $("<div class='col-auto'></div>").append($("<h3></h3>").append("€" + totalPrice.toFixed(2)));
        body_footer.append(ind);
        body_footer.append(wit);
        body_footer.append(tot);
        body.append(body_footer);

        $(".modal-body.confirm").append(body); 
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
                 "withdrawal"  : $("#datetime").val(),
                 "address"  : $("#address").val(),
                 "pizza" : []
            };
    for (let i = 0; i < pizzas.length; i++) {
        const pizza = pizzas[i];
        
        var temp = { "name" : pizza.name,
                     "totalSlices" : pizza.slices,
                     "ingredients" : []
                };
        
        for (let j = 0; j < pizza.chosenIngredients.length; j++) {
            const ingredient = pizza.chosenIngredients[j];
            temp["ingredients"].push( [ingredient[0].name, ingredient[1]] );
        }
        
        data["pizza"].push( temp );
    }
    
    APIrequest(
        "/order/api/createOrder",
        {
            data: data,
            statusCode: {
                200: (data) => window.location.replace("/myOrders/"+data["body"][0]),
                400: (data) => AlertRenderer.render(400, data["result_msg"], "order"),
            }

        }
    );
 }

$(document).ready(main);