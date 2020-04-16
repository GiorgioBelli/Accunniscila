
var total_ingredients;

function main(){

    i1 = new Ingredient(
        1,
        "mushroom",
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    i2 = new Ingredient(
        2,
        "peperoni2",
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    i3 = new Ingredient(
        3,
        "peperoni3",
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );
    i4 = new Ingredient(
        3,
        "peperoni3",
        "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
        );

    total_ingredients = [i1,i2,i3,i4,i2,i3,i4];

    pizza = new Pizza();
    pizza.addIngredient(i1);
    pizza.addIngredient(i2);
    pizza.addIngredient(i3);
    pizza.addIngredient(i4);

    pizza2 = new Pizza();
    pizza2.addIngredient(i1);
    pizza2.addIngredient(i2);
    pizza2.addIngredient(i3);
    pizza2.addIngredient(i4);

    list = [pizza,pizza2];

    $(".root").append(PizzasListRender.PizzasListRenderer(list));
}

class Pizza{

    static maxIngredients = 12;

    constructor(name = "default_name",ingredients = [],slices=1){
        this.ingredients = ingredients;
        this.name = name;
        this.slices = slices;
    }

    addIngredient(ingredient){
        // if(this.ingredients.length >= Pizza.maxIngredients) throw "Massimo numero di condimenti raggiunti";
        this.ingredients.push(ingredient);
    }

    get price(){

    }

    calcPrice(){

    }
}

class Ingredient{
    constructor(id,name = "default_name", image_path = ""){
        this.id = id;
        this.name = name;
        this.image_path = image_path;
    }

}

class IngredientRenderer{

    static SeasoningRender(ingredient,onClick = (ingredient,target)=>{}){


        var html_ingredient = $(`
        <div draggable="true" class="picker ingredient" data-id="${ingredient.id}">
            <img  src="${ingredient.image_path}" alt="">
            <label for="name">${ingredient.name}</label>
        </div>
        `);

        html_ingredient.click((e) => {
            var target = $(e.target);
            onClick(ingredient,target);
        });

        return html_ingredient;
    }

    static createIngredientSliceSelector(slices,ingredient, onSliceSelected = (ingredient,slice) => {}){

        $(".ingredient_slice_selector").remove();

        var html_selector=  $(`
            <div class="btn-group ingredient_slice_selector" role="group" aria-label="slices"></div>
        `);


        for (let i = 1; i <= slices; i++) {
            var btn = $(`<button type="button" class="btn btn-primary" value="${i}">${i}</button>`);
            btn.click((e) => onSliceSelected(ingredient,i));
            html_selector.append(btn);
        }


        return html_selector;
    }

    static createPizzaPreviewIngredient(ingredient,slice,slices){
        var preview_ingredient = $(`<div name="${ingredient.name}" data-slice="${slices}_${slice}" class="ingredient_preview"></div>`);
        if(slice == null) slice=1;
        preview_ingredient.css("background-image",`url(http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/${ingredient.name}/${ingredient.name}_${slices}_${slice}.png)`)
        
        return preview_ingredient;
    
    
    }

    static ChoosenRender(ingredient,slice,slices,onRemove = (ingredient)=>{}){
        var html_ingredient = $(`
        <div class="choosed ingredient" name="${ingredient.name}" data-slice="${slices}_${slice}" data-id="${ingredient.id}">
            <div class="image">
                <img src="${ingredient.image_path}" alt="">
                <span class="btn remove-ingredient glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
            </div>
            <label for="name">${ingredient.name}</label>
        </div>
        `);

        var remove_ingredient_handler = ((e) => {
            onRemove(ingredient,slice,slices);
            html_ingredient.remove();
        }); 
        html_ingredient.find(".btn.remove-ingredient").click(remove_ingredient_handler);

        return html_ingredient;
    }
}

class PizzaBlockRenderer{
    constructor(pizza){
        this.pizza = pizza;


        this.header = this.htmlPizzaHeader();
        this.body = this.htmlPizzaBody();



        this.block = $(`<div class="pizza_block"></div>`)
            .append(this.header)
            .append(this.body);

    }

    htmlPizzaHeader(){
        var pizza_header = $(
            `<div class="header">
                <div class="slices_selector">
                    <label for="slices">Gusti</label>
                    <div class="btn-group" role="group" aria-label="slices">
                        <button type="button" class="btn btn-primary" value="1">1</button>
                        <button type="button" class="btn btn-primary" value="2">2</button>
                        <button type="button" class="btn btn-primary" value="3">3</button>
                    </div>
                </div>

                <button type="button" class="btn btn-default remove-pizza-block" aria-label="Trash">
                    <span class="glyphicon glyphicon-trash" aria-hidden="false"></span>
                </button>
            </div>`
        );

        var update_slices_handler = ((e) => {this.pizza.slices = $(e.target).val()}).bind(this);
        pizza_header.find(".btn-group > button.btn").click(update_slices_handler)

        var block_remover_handler = (() => {
            this.block.animate({
                height: "toggle",
                opacity: "toggle"
            },
            {
                duration: 500,
                complete: function() {
                    this.block.remove();
                  }.bind(this)
            })
        }).bind(this);
        pizza_header.find(".btn.remove-pizza-block").click(block_remover_handler);

        return pizza_header;

    }
    
    htmlPizzaBody(){

        this.choosen_ingredients = this.htmlChoosenIngredients();
        this.pizza_preview = this.htmlPizzaPreview();

        var pizza_body = $(`<div class="body"></div>`)
            .append(this.pizza_preview)
            .append(this.htmlPizzaName())
            .append(this.choosen_ingredients)
            .append(this.htmlIngredientsPicker());

        return pizza_body;
    }

    htmlPizzaPreview(){
        return $(`<div class="pizza_preview"></div>`);
    }

    htmlPizzaName(){
        var pizza_name = $(`<input type="text" placeholder="Nome Pizza" class="pizza_name"></input>`);
        
        var pizza_name_handler = ((e) => {this.pizza_name = $(e.target).val();}).bind(this);
        pizza_name.keyup(pizza_name_handler);

        return pizza_name;
    
    }

    htmlChoosenIngredients(){
        
        var choosen_ingredients = $(`<div class="container pizza_ingredients "></div>`);    

        return choosen_ingredients;
    }

    addChoosenIngredient(ingredient,slice,slices){

        var onIngredientRemove = ((ingredient,slice,slices) => {
            delete this.pizza.ingredients[ingredient.id];
            this.removeChoosenIngredient(ingredient,slice,slices);
        }).bind(this);

        this.pizza_preview.append(IngredientRenderer.createPizzaPreviewIngredient(ingredient,slice,this.pizza.slices))
        this.choosen_ingredients.append(IngredientRenderer.ChoosenRender(ingredient,slice,slices,onIngredientRemove));

    }

    removeChoosenIngredient(ingredient,slice,slices){

        this.pizza_preview.find(`div[name="${ingredient.name}"][data-slice="${slices}_${slice}"]`).remove();

    }


    htmlIngredientsPicker(){
        
        var html_ingredient_picker = $(`<div id="ingredients_picker" class="ingredients_picker"></div>`); 
        
        var onIngredientPicked = ((ingredient,target)=>{
            
            if(this.pizza.slices>1){
                var ingredient_slice_selector = IngredientRenderer.createIngredientSliceSelector(
                    this.pizza.slices,
                    ingredient,
                    ((ingredient,slice) => {
                        this.pizza.addIngredient(ingredient);
                        this.addChoosenIngredient(ingredient,slice,this.pizza.slices);
                    }).bind(this)
                )
                
                ingredient_slice_selector.click()
                
                target.before(ingredient_slice_selector)
            }else{
                this.pizza.addIngredient(ingredient);
                this.addChoosenIngredient(ingredient,1,this.pizza.slices); 

            }
                

        }).bind(this);

        html_ingredient_picker.append(
            total_ingredients.map(
                (ingredient) => IngredientRenderer.SeasoningRender(ingredient,(ingredient,target) => onIngredientPicked(ingredient,target))
            )
        );

        // html_ingredient_picker.slick({
        //     dots: false,
        //     prevArrow: false,
        //     nextArrow: false
        // });

        return html_ingredient_picker;
    }

    render(){
        return this.block;
    }
}

class PizzasListRender{

    static PizzasListRenderer(pizzas_list = []){
        return pizzas_list.map((pizza)=> new PizzaBlockRenderer(pizza).render());
    }
}


$(document).ready(main);