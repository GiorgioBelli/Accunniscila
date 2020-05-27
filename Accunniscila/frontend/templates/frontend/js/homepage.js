

Pizza.retrieveFavouritePizzas({
    number: 5,
    statusCode: {
        200 : (data) => {
            $(".carousel-inner").append(data.body.map((pizza,index) => CarouselRenderer.createCarouselItem(pizza,active=(index==0))));
            $(".carousel-indicators").append(data.body.map((pizza, index) => CarouselRenderer.createCarouselIndicator(index, active=(index==0))));
        },
        400 : (reponse) => console.log("unable to retrieve favourite pizzas")
    }
})

function main(){
    handleContent();    
}

function handleContent(){
    $(".content-item:odd").each(function( index ) {
        $( this ).children(".content-img").addClass( "order-sm-1" );
    });
    return 0;
}

class CarouselRenderer  {
    static createCarouselIndicator(index, active=false){
        let indicator = $(`<li data-target='#carouselExampleIndicators' data-slide-to='${index}'></li>`);
        if(active){ indicator.addClass("active"); }
        return indicator;
    }
    static createCarouselItem(pizza,active=false){
        let item =  $(`
                <div class="carousel-item">
                    <img class="d-block w-50" src="${pizza.image_path}" alt="${pizza.name}">
                </div>
               `);
        if(active){ item.addClass("active"); }

        return item;
    }
}

$(document).ready(main);