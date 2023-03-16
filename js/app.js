const inputTable = document.querySelector("#mesa");
const hours = document.querySelector("#hora");
const saveClient = document.querySelector("#guardar-cliente");
const modalBody = document.querySelector(".modal-body");
const container = document.querySelector(".contenido");

const modal = document.querySelector("#formulario");
const myModal = new bootstrap.Modal(modal, {
    backdrop: "static",
});

const listCategory = {
    1: "Comida",
    2: "Bebidas",
    3: "Postres",
};

let app;

initEvents();

class UI {
    showAlertHTML(mensaje) {
        const isAlert = document.querySelector(".alert");
        if (isAlert) {
            return;
        }
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger", "text-center");
        alert.textContent = mensaje;
        modalBody.appendChild(alert);

        setInterval(() => {
            alert.remove();
        }, 3000);
    }
    generateJsonService() {
        const url = "http://localhost:4000/platillos";
        fetch(url)
            .then((result) => result.json())
            .then((data) => this.generateJsonHTML(data));
    }
    generateJsonHTML(data) {
        data.forEach((element) => {
            const row = document.createElement("div");
            row.classList.add("row", "py-3", "border-top");

            const { id, nombre, precio, categoria } = element;

            const name = document.createElement("div");
            name.classList.add("col-md-4");
            name.textContent = nombre;

            const price = document.createElement("div");
            price.classList.add("col-md-3", "text-center");
            price.innerHTML = `<strong>$${precio}</strong>`;

            const category = document.createElement("div");
            category.classList.add("col-md-3");
            category.textContent = listCategory[categoria];

            const amountContainer = document.createElement("div");
            amountContainer.classList.add("col-md-2");
            const amount = document.createElement("input");
            amount.classList.add("form-control");
            amount.type = "number";
            amount.min = 0;
            amount.value = 0;
            amount.id = `producto-${id}`;
            amount.onchange = () => {
                const quantity = parseInt(amount.value);
                sendPlateObject({ ...element, quantity });
            };

            amountContainer.appendChild(amount);

            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(category);
            row.appendChild(amountContainer);

            container.appendChild(row);
        });
    }
    showContainer() {
        document
            .querySelectorAll(".d-none")
            .forEach((e) => e.classList.remove("d-none"));

        myModal.hide();
    }
    showPlateHTML(plates) {
        const row = document.querySelector(".contenido.row");

        const divResumen = document.createElement("div");
        divResumen.classList.add("col-md-6");
        const addResumen = document.createElement("div");
        addResumen.classList.add("card", "shadow", "px-3");

        const subTitle = document.createElement("h3");
        subTitle.classList.add("text-center", "my-4");
        subTitle.textContent = "Platillos Consumidos";

        const table = document.createElement("p");
        table.classList.add("my-2");
        table.innerHTML = `
            <strong>Mesa:</strong> <span>${app.table}</span> 
        `;

        const hour = document.createElement("p");
        hour.classList.add("my-2");
        hour.innerHTML = `
            <strong>Hora:</strong> <span>${app.hour}</span> 
        `;

        const ul = document.createElement("ul");
        ul.classList.add("list-group", "my-3");

        plates.forEach((plate) => {
            const { id, nombre, precio, quantity } = plate;
            const li = document.createElement("li");
            li.classList.add("list-group-item");

            const title = document.createElement("h4");
            title.classList.add("my-3", "fw-bold");
            title.textContent = nombre;

            const amount = document.createElement("p");
            amount.innerHTML = `
                <strong >Cantidad:</strong> <span>${quantity}</span> 
            `;

            const price = document.createElement("p");
            price.innerHTML = `
                <strong>Precio:</strong> <span>$ ${precio}</span> 
            `;

            const subTotal = document.createElement("p");
            const calculateSubTotal = precio * quantity;
            subTotal.innerHTML = `
                <strong>Subtotal:</strong> <span>$ ${calculateSubTotal}</span> 
            `;

            const button = document.createElement("button");
            button.classList.add("btn", "btn-danger");
            button.textContent = "Eliminar del pedido";
            button.onclick = () => {
                deletePlate(id);
            };

            li.appendChild(title);
            li.appendChild(amount);
            li.appendChild(price);
            li.appendChild(subTotal);
            li.appendChild(button);

            ul.appendChild(li);
        });

        addResumen.appendChild(subTitle);
        addResumen.appendChild(table);
        addResumen.appendChild(hour);
        addResumen.appendChild(ul);

        divResumen.appendChild(addResumen);

        const divBill = document.createElement("div");
        divBill.classList.add("col-md-6");
        const addBill = document.createElement("div");
        addBill.classList.add("card", "shadow", "formulario"); // formularoo -> poder ubicar al elmento para agregar el total
        const heading = document.createElement("h3");
        heading.classList.add("text-center", "my-4");
        heading.textContent = "Propina";

        const radio10Div = document.createElement("div");
        radio10Div.classList.add("form-check", "mx-3", "py-2");

        const radio10 = document.createElement("input");
        radio10.classList.add("form-check-input");
        radio10.type = "radio";
        radio10.name = "propina";
        radio10.value = "10";
        radio10.onclick = () => {
            calculateBill(parseInt(radio10.value));
        };

        const radio10Label = document.createElement("label");
        radio10Label.textContent = "10%";
        radio10Label.classList.add("form-check-label");

        radio10Div.appendChild(radio10);
        radio10Div.appendChild(radio10Label);

        const radio25Div = document.createElement("div");
        radio25Div.classList.add("form-check", "mx-3", "py-2");

        const radio25 = document.createElement("input");
        radio25.classList.add("form-check-input");
        radio25.type = "radio";
        radio25.name = "propina";
        radio25.value = "25";
        radio25.onclick = () => {
            calculateBill(parseInt(radio25.value));
        };

        const radio25Label = document.createElement("label");
        radio25Label.textContent = "25%";
        radio25Label.classList.add("form-check-label");

        radio25Div.appendChild(radio25);
        radio25Div.appendChild(radio25Label);

        const radio50Div = document.createElement("div");
        radio50Div.classList.add("form-check", "mx-3", "py-2");

        const radio50 = document.createElement("input");
        radio50.classList.add("form-check-input");
        radio50.type = "radio";
        radio50.name = "propina";
        radio50.value = "50";
        radio50.onclick = () => {
            calculateBill(parseInt(radio50.value));
        };

        const radio50Label = document.createElement("label");
        radio50Label.textContent = "50%";
        radio50Label.classList.add("form-check-label");

        radio50Div.appendChild(radio50);
        radio50Div.appendChild(radio50Label);

        addBill.appendChild(heading);
        addBill.appendChild(radio10Div);
        addBill.appendChild(radio25Div);
        addBill.appendChild(radio50Div);
        divBill.appendChild(addBill);

        row.appendChild(divResumen);
        row.appendChild(divBill);
    }

    cleanInputPlate(id) {
        document.querySelector(`#producto-${id}`).value = 0;
    }

    showTotalPay(result, percent) {
        if (document.querySelector(".delete-total")) {
            const form = document.querySelector(".formulario");
            form.removeChild(document.querySelector(".delete-total"));
        }

        const row = document.querySelector(".formulario");

        const divTotal = document.createElement("div");
        divTotal.classList.add("mx-3", "py-3", "delete-total");

        const paragraphSub = document.createElement("p");
        paragraphSub.classList.add("fs-4");
        paragraphSub.innerHTML = `
            <strong>Subtotal Consumo:</strong> <span>$${result}</span> 
        `;

        const paragraphBill = document.createElement("p");
        paragraphBill.classList.add("fs-4");
        const bill = (result * percent) / 100;
        paragraphBill.innerHTML = `
            <strong >Propina:</strong> <span>$${bill}</span> 
        `;

        const paragraphTotal = document.createElement("p");
        paragraphTotal.classList.add("fs-4");
        const total = bill + result;
        paragraphTotal.innerHTML = `
            <strong >Total a pagar:</strong> <span>$${total}</span> 
        `;

        divTotal.appendChild(paragraphSub);
        divTotal.appendChild(paragraphBill);
        divTotal.appendChild(paragraphTotal);
        row.appendChild(divTotal);
    }
}

const ui = new UI();

class App {
    constructor(table, hour) {
        this.table = table;
        this.hour = hour;
        this.services = [];
    }
    addService(service) {
        this.services = [...this.services, service];
    }
    deleteService(id) {
        this.services = this.services.filter((service) => {
            return service.id !== id;
        });
        return this.services;
    }
}

function initEvents() {
    document.addEventListener("DOMContentLoaded", () => {
        saveClient.addEventListener("click", initApplication);
    });
}

function initApplication() {
    getDataApp();
}
function getDataApp() {
    const input = inputTable.value;
    const hour = hours.value;
    const isEmpty = [input, hour].some((element) => element === "");
    if (isEmpty) {
        ui.showAlertHTML("Llenar todos los campos solicitados !!!");
        return;
    }
    ui.showContainer();
    app = new App(input, hour);
    ui.generateJsonService();
}

function sendPlateObject(plate) {
    const row = document.querySelector(".contenido.row");
    if (row.classList.contains("d-none")) {
        row.classList.remove("d-none");
    }

    let { services } = app;

    if (plate.quantity > 0) {
        const index = services.findIndex((element) => element.id === plate.id);
        if (index !== -1) {
            services[index].quantity = plate.quantity;
        } else {
            app.addService(plate);
        }
    } else {
        app.services = services.filter((service) => {
            return service.id !== plate.id;
        });
    }

    /* OTRA FORMA DE ITERARLO
    
    if (plate.quantity > 0) {
        if (services.some((element) => element.id === plate.id)) {
            const updatedService = services.map((service) => {
                if (service.id === plate.id) {
                    service.quantity = plate.quantity;
                }
                return service;
            });
            app.services = updatedService;
        } else {
            app.addService(plate);
        }
    } else {
        app.services = services.filter((service) => {
            return service.id !== plate.id;
        });
    }*/
    cleanListHTML();
    ui.showPlateHTML(app.services);
}

function cleanListHTML() {
    const row = document.querySelector(".contenido.row");
    while (row.firstChild) {
        row.removeChild(row.firstChild);
    }
}

function deletePlate(id) {
    cleanListHTML();
    const updateServices = app.deleteService(id);
    ui.showPlateHTML(updateServices);
    ui.cleanInputPlate(id);
    console.log("=========================================");
    console.log("=========================================");
    if (updateServices.length === 0) {
        const row = document.querySelector(".contenido.row");
        row.classList.add("d-none");
    }
    console.log("=========================================");
    console.log("=========================================");
}

function calculateBill(percent) {
    let result = app.services.reduce(
        (total, service) => total + service.precio * service.quantity,
        0
    );
    ui.showTotalPay(result, percent);
}

function* terminar() {}
