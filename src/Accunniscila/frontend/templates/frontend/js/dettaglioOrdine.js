function main(){

    getDetails();

}


function getDetails(){
    id = $("#root").data("order_id");
    console.log(id);

    APIrequest(
        "/order/api/orders/" + id,
        {
            onsuccess: (data) => PageRenderer.render(data)
        }
    );
}

function updateStatus(newStatus){
    id = $("#root").data("order_id");

    APIrequest(
        "/order/api/orders/" + id + "/update",
        {
            data : {"status": newStatus},
            onsuccess: (data) => OrderInfoRenderer.render("", "", "", "", newStatus, true)
        },
    );
}

class PageRenderer{
    static render(data){
        
        let address = data["body"]["address"];
        let client = data["body"]["client"]["user"]["firstname"] + " " + data["body"]["client"]["user"]["lastname"]; 
        let phone_number = data["body"]["client"]["phone"];
        let withdrawal = data["body"]["withdrawal"];
        let status = data["body"]["status"];
        let pizzas = data["body"]["pizzas"];
        
        OrderInfoRenderer.render(address, client, phone_number, withdrawal, status, false);

        for(let c=0; c<pizzas.length; c++){
            var ingredients = [];
            for(let i=0; i<pizzas[c]["chosenIngredients"].length; i++){

                var temp = pizzas[c]["chosenIngredients"][i]["ingredient"];
                var slice = pizzas[c]["chosenIngredients"][i]["slice"]["number"];

                ingredients.push( [new Ingredient(i, temp["name"], temp["price"], temp["severity"], temp["image"], temp["nameToShow"]), slice] );
            }

            var pizza = new Pizza(c, pizzas[c]["name"], pizzas[c]["slices"], pizzas[c]["image_path"], ingredients);
            PizzaRenderer.render(pizza);
        }
    }
}

class OrderInfoRenderer{
    static render(address, client, phone_number, withdrawal, status, onlyState){
        
        if( !onlyState ){
            $("#address").text(address);
            $("#client").text(client);

            $('#phone_number').text(`(${phone_number})`);
            $('#phone_number').attr("href",`tel:${phone_number}`);
            
            
            $("#datetime").text(Order.formattedWithdrawal(withdrawal));
        }

        var nextStatus = "W";
        switch (status) {
            case "P":
                $("#status").text("Pending");
                break;
            case "W":
                $("#status").text("Working");
                nextStatus = "C";
                break;
            case "C":
                $("#status").text("Completed");
                nextStatus = "NoNextStatus";
                break;
            default:
                break;
        }

        switch (nextStatus) {
            case "W":
            case "C":
                $("#nextStatus").on("click", function(){
                    updateStatus(nextStatus);
                });
                break;
            case "NoNextStatus":
                $("#nextStatus").addClass("disabled");
                break;
            default:
                break;
        }
    }
}

class PizzaRenderer{
    static render(pizza){
        var row = $(`<div class="row justify-content-center align-items-center"></div>`);
        var card = $(`<div class="row myCard pizza"></div>`);

        var col1 = $(`<div class="col-sm-5 text-left"></div>`);
        var col2 = $(`<div class="col-sm-7"></div>`);

        var pizza_name = $(`<h3 class="pizza_name"></h3>`).append(pizza.name);
        var pizza_preview = $(`<div class="pizza_preview"></div>`);

        for(let c=0; c<pizza.chosenIngredients.length; c++){
            pizza_preview.append( IngredientRenderer.render(pizza.chosenIngredients[c][0], pizza.chosenIngredients[c][1], pizza.slices) );
            console.log(pizza)
        }

        var pizza_description = $(`<div class="pizza_description text-left"></div>`).append(pizza.description);
        var pizza_price = $(`<div class="pizza_price text-right"></div>`).append($("<h3></h3>").append("€ " + pizza.price));

        col1.append(pizza_name);
        col1.append(pizza_preview);

        col2.append(pizza_description);
        col2.append(pizza_price);

        card.append(col1);
        card.append(col2);
        row.append(card);
        $("body>div.container").append(row);
    }
}

class IngredientRenderer{
    static render(ingredient, slice, slices){
        var ingredient_preview = $(`<div name="${ingredient.name}" data-slice="${slices}_${slice}" class="ingredient_preview"></div>`);
        ingredient_preview.css("z-index", ingredient.severity);
        if (slice == null) slice = 1;
        ingredient_preview.css("background-image", `url("/static/condimenti/${ingredient.name}/${ingredient.name}_${slices}_${slice}.png")`)

        return ingredient_preview;
    }
}


$(document).ready(main);