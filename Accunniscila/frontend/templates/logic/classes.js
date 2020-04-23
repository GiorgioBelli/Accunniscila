class Pizza{
    constructor(name = "default_name", slices = 1, image_path = "",  chosenIngredients = []){
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
            description += value.name + ", ";
            //description += value[0].name + ", ";
        });
        return description.slice(0, -2);
    }

    calcPrice(){
        var sum = 0;
        $.each( this.chosenIngredients, function( key, value ) {
            sum += value.price;
            //sum += key + ": " + value[0].price;
        });
        return sum;
    }
}

class Ingredient{
    constructor(id, name = "default_name", price = 0, severity=0, image_path = ""){
        this.id = id;
        this.name = name;
        this.price = price;
        this.severity = severity;
        this.image_path = image_path;
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
}

//modella una parte di pizza divisa in piu gusti (es. 3 gusti lo slice 3 è la parte destra, il 2 la centrale ....)
class Slice{
    constructor(id){
        this.id = id;
    }
}