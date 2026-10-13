"use strict";
// Product Inventory Manager
// TypeScript AWT Assignment
// Basic types and variables.
let products = [
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
let nextId = 4;
// Get HTML elements.
const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");
const productCategoryInput = document.getElementById("productCategory");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
// Function: Format currency.
function formatCurrency(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}
// Function: Calculate inventory statistics.
function updateDashboard() {
    const totalProducts = products.length;
    const availableProducts = products.filter((product) => product.quantity > 0).length;
    const outOfStock = products.filter((product) => product.quantity === 0).length;
    const inventoryValue = products.reduce((total, product) => total + product.price * product.quantity, 0);
    document.getElementById("totalProducts").textContent =
        String(totalProducts);
    document.getElementById("availableProducts").textContent =
        String(availableProducts);
    document.getElementById("outOfStock").textContent =
        String(outOfStock);
    document.getElementById("inventoryValue").textContent =
        formatCurrency(inventoryValue);
}
// Function: Display products in the table.
function displayProducts(searchTerm = "") {
    productTable.innerHTML = "";
    // Block scope: searchTerm is used within this function.
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    filteredProducts.forEach((product) => {
        const row = document.createElement("tr");
        const status = product.quantity > 0 ? "In Stock" : "Out of Stock";
        const statusClass = product.quantity > 0 ? "in-stock" : "out-of-stock";
        // Build table cells safely using textContent.
        const values = [
            String(product.id),
            product.name,
            product.category,
            formatCurrency(product.price),
            String(product.quantity)
        ];
        values.forEach((value) => {
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
        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        productTable.appendChild(row);
    });
    emptyMessage.hidden = filteredProducts.length > 0;
}
// Function: Add a product.
function addProduct(name, price, quantity, category) {
    const newProduct = {
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
function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    displayProducts(searchInput.value);
    updateDashboard();
}
// Event: Handle the product form submission.
productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = productNameInput.value.trim();
    const price = Number(productPriceInput.value);
    const quantity = Number(productQuantityInput.value);
    const category = productCategoryInput.value.trim();
    if (name === "" ||
        category === "" ||
        !Number.isFinite(price) ||
        !Number.isFinite(quantity) ||
        price <= 0 ||
        quantity < 0 ||
        !Number.isInteger(quantity)) {
        alert("Enter a valid product name, category, price, and quantity.");
        return;
    }
    addProduct(name, price, quantity, category);
    productForm.reset();
});
// Event: Search products.
searchInput.addEventListener("input", () => {
    displayProducts(searchInput.value);
});
// Initial display.
displayProducts();
updateDashboard();
