class Pizza{
    constructor(js_id=0,name = "default_name", slices = 1, image_path = "",  chosenIngredients = []){
        this.js_id = js_id;
        this.name = name;
        this.slices = slices;
        this.image_path = image_path;
        this.chosenIngredients = chosenIngredients; // lista di tuple(array di 2): (ingrediente, slice)
    }

    addIngredient(chosenIngredient){ // tupla (ingrediente, slice)
        this.chosenIngredients.push(chosenIngredient);
    }

    get price(){
        return this.calcPrice();
    }

    get description(){
        var description = "";
        $.each( this.chosenIngredients, function( key, value ) {
            description += value[0].nameToShow + ", ";
        });
        return description.slice(0, -2);
    }

    calcPrice(){
        var sum = 0;
        var slices = parseInt(this.slices);
        $.each( this.chosenIngredients, function( key, value ) {
            sum += value[0].price / slices;
        });
        return sum.toFixed(2);
    }

    static getDescription(pizza){
        let ing_names = pizza.chosenIngredients.map((p_ingredient)=> p_ingredient.ingredient.nameToShow);
        return ing_names.join(", ");
    }

    static calcPrice(pizza){
        return pizza.chosenIngredients.reduce((sum, p_ingredient) => sum+parseFloat(p_ingredient.ingredient.price),0.0);
    }
}

class Order{
    static formattedWithdrawal(withdrawal){
        let date = new Date(Date.parse(withdrawal));

        let minutes = date.getUTCMinutes();
        if( minutes == '0' ) minutes = "00";

        let time = date.getUTCHours()+":"+minutes;
        let day = date.getUTCDate()+"/"+(date.getUTCMonth()+1)+"/"+date.getUTCFullYear();

        return day+" "+time;
    }
}

class Ingredient{
    constructor(id, name = "default_name", price = 0, severity=0, image_path = "", nameToShow = "default_nameToShow"){
        this.id = id;
        this.name = name;
        this.nameToShow = nameToShow;
        this.price = price;
        this.severity = severity;
        this.image_path = image_path;
    }

    static retrieveIngredients({ onsuccess=()=>{} , onfailure=()=>{}, statusCode={}} = {}){
        APIrequest(
            "/menu/api/retrieveIngredients",
            {
                onsuccess : onsuccess,
                onfailure : onfailure,
                statusCode : statusCode,
            }
        )
    }
}

class Menu{
    constructor(name = "default_name", pizzas = []){
        this.name = name;
        this.pizzas = pizzas;
    }

    addPizza(pizza){
        this.pizzas.push(pizza);
    }

    static retrieveMenu(name,{ onsuccess=()=>{} , onfailure=()=>{}, statusCode={}} = {}){
        APIrequest(
            "/menu/api/retrieveMenu",
            {
                data : {name : name},
                onsuccess : onsuccess,
                onfailure : onfailure,
                statusCode : statusCode,
            }
        )
    }

    static retrieveAvailableMenus({ onsuccess=()=>{} , onfailure=()=>{}, statusCode={}} = {}){
        APIrequest(
            "/menu/api/retrieveAvailableMenus",
            {
                onsuccess : onsuccess,
                onfailure : onfailure,
                statusCode : statusCode,
            }
        )
    }
}

//modella una parte di pizza divisa in piu gusti (es. 3 gusti lo slice 3 è la parte destra, il 2 la centrale ....)
class Slice{
    constructor(id){
        this.id = id;
    }
}