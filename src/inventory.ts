// Product Inventory Manager
// TypeScript AWT Assignment

// Interface: Defines the structure of a product.

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
}

// Basic types and variables.

let products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 55000,
        quantity: 5,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Headphones",
        price: 2000,
        quantity: 10,
        category: "Accessories"
    },
    {
        id: 3,
        name: "Keyboard",
        price: 1500,
        quantity: 0,
        category: "Electronics"
    }
];

let nextId: number = 4;

// Get HTML elements.

const productForm = document.getElementById(
    "productForm"
) as HTMLFormElement;

const productNameInput = document.getElementById(
    "productName"
) as HTMLInputElement;

const productPriceInput = document.getElementById(
    "productPrice"
) as HTMLInputElement;

const productQuantityInput = document.getElementById(
    "productQuantity"
) as HTMLInputElement;

const productCategoryInput = document.getElementById(
    "productCategory"
) as HTMLInputElement;

const productTable = document.getElementById(
    "productTable"
) as HTMLTableSectionElement;

const searchInput = document.getElementById(
    "searchInput"
) as HTMLInputElement;

const emptyMessage = document.getElementById(
    "emptyMessage"
) as HTMLParagraphElement;

// Function: Format currency.

function formatCurrency(amount: number): string {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}

// Function: Calculate inventory statistics.

function updateDashboard(): void {
    const totalProducts: number = products.length;

    const availableProducts: number = products.filter(
        (product: Product): boolean => product.quantity > 0
    ).length;

    const outOfStock: number = products.filter(
        (product: Product): boolean => product.quantity === 0
    ).length;

    const inventoryValue: number = products.reduce(
        (total: number, product: Product): number =>
            total + product.price * product.quantity,
        0
    );

    document.getElementById("totalProducts")!.textContent =
        String(totalProducts);

    document.getElementById("availableProducts")!.textContent =
        String(availableProducts);

    document.getElementById("outOfStock")!.textContent =
        String(outOfStock);

    document.getElementById("inventoryValue")!.textContent =
        formatCurrency(inventoryValue);
}

// Function: Display products in the table.

function displayProducts(searchTerm: string = ""): void {
    productTable.innerHTML = "";

    // Block scope: searchTerm is used within this function.
    const filteredProducts: Product[] = products.filter(
        (product: Product): boolean =>
            product.name.toLowerCase().includes(
                searchTerm.trim().toLowerCase()
            )
    );

    filteredProducts.forEach((product: Product): void => {
        const row = document.createElement("tr");

        const status: string =
            product.quantity > 0 ? "In Stock" : "Out of Stock";

        const statusClass: string =
            product.quantity > 0 ? "in-stock" : "out-of-stock";

        // Build table cells safely using textContent.

        const values: string[] = [
            String(product.id),
            product.name,
            product.category,
            formatCurrency(product.price),
            String(product.quantity)
        ];

        values.forEach((value: string): void => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = `status ${statusClass}`;
        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", (): void => {
            deleteProduct(product.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        productTable.appendChild(row);
    });

    emptyMessage.hidden = filteredProducts.length > 0;
}

// Function: Add a product.

function addProduct(
    name: string,
    price: number,
    quantity: number,
    category: string
): void {
    const newProduct: Product = {
        id: nextId,
        name: name,
        price: price,
        quantity: quantity,
        category: category
    };

    products.push(newProduct);
    nextId++;

    displayProducts(searchInput.value);
    updateDashboard();
}

// Function: Delete a product.

function deleteProduct(id: number): void {
    products = products.filter(
        (product: Product): boolean => product.id !== id
    );

    displayProducts(searchInput.value);
    updateDashboard();
}

// Event: Handle the product form submission.

productForm.addEventListener("submit", (event: SubmitEvent): void => {
    event.preventDefault();

    const name: string = productNameInput.value.trim();
    const price: number = Number(productPriceInput.value);
    const quantity: number = Number(productQuantityInput.value);
    const category: string = productCategoryInput.value.trim();

    if (
        name === "" ||
        category === "" ||
        !Number.isFinite(price) ||
        !Number.isFinite(quantity) ||
        price <= 0 ||
        quantity < 0 ||
        !Number.isInteger(quantity)
    ) {
        alert(
            "Enter a valid product name, category, price, and quantity."
        );
        return;
    }

    addProduct(name, price, quantity, category);

    productForm.reset();
});

// Event: Search products.

searchInput.addEventListener("input", (): void => {
    displayProducts(searchInput.value);
});

// Initial display.

displayProducts();
updateDashboard();