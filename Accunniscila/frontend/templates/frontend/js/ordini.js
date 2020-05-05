function main(){

    var orders = [];

    APIrequest(
        'http://217.61.121.77:8000/order/api/orders',
        {
            onsuccess : (data) => {
                orders = data.body;
                OrderListRenderer.CreateMyOrdersCardList($(".orders_list"),orders);
            },
        }
    )


}

class OrderRenderer{

    static MyOrdersCard(order){

        let p_count = order.pizzas.length.toString()+" "+((order.pizzas.length==1) ? "pizza" : "pizze");
        let withdrawal = Order.formattedWithdrawal(order.withdrawal);

        return `
            <div class="myCard order container">
                <h3 class="myCard-client">${order.client.user.firstname+" "+order.client.user.lastname}</h3>
                <div class="myCard-body">
                    <div class="row single">
                        <div class="myCard-info icon-label phone">
                            <i class="material-icons">phone_android</i>
                            <label for="text">${order.client.phone}</label>
                        </div>
                    </div>
                    <div class="row multi">
                        <div class="myCard-info icon-label pizzas-count">
                            <i class="material-icons">local_pizza</i>
                            <label for="text">${p_count}</label>
                        </div>
                        <div class="myCard-info icon-label withdrawal">
                            <i class="material-icons">event</i>
                            <label for="text">${withdrawal}</label>
                        </div>
                    </div>
                    <div class="row single last">
                        <a href="./${order.id}" role="button" class="btn btn-primary order-details">Dettagli Ordine</a>
                    </div>
                </div>
            </div>
        `;
    }
}

class OrderListRenderer{
    static CreateMyOrdersCardList(list_item,orders_list){

        let rows = [];

        let row = $(`<div class="row"></div>`);
        for (let i = 0; i < orders_list.length; i++) {

            
            let card = OrderRenderer.MyOrdersCard(orders_list[i]); 

            row.append(`<div class="col-sm">${card}</div>`);
            if((i+1)%2==0 || ((i+1)%2!=0 && i==orders_list.length-1)){
                rows.push(row);
                row = $(`<div class="row"></div>`);
            }
        }

        list_item.append(rows);
    }
}

$(document).ready(main);