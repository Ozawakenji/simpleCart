        document.addEventListener("DOMContentLoaded", function () {
			const sizeOptions = document.querySelectorAll("input[name='size']");
            const addToCartBtn = document.getElementById("add-to-cart-btn");
            const cartToggleBtn = document.getElementById("cart-toggle-btn");
            const cartCounter = document.getElementById("cart-counter");
            const cartItemsList = document.getElementById("cart-items");
            const errorMessage = document.getElementById("error-message");
			 const productPriceElement = document.getElementById("product-price");

            const cartItems = []; // Store added items in the cart

            // Function to fetch products from the API using Fetch API
            function fetchProducts() {
                fetch("https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product")
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("API Response Data:", data);
                        handleProducts(data);
                    })
                    .catch(error => {
                        console.error("Error fetching products:", error.message);
                        // Handle error here, such as showing a message to the user
                    });
            }

            // Function to handle the fetched products
            function handleProducts(data) {
                const product = data;
				productPriceElement.textContent = product.price.toFixed(2); // Display the product price
                // Function to add product to cart
                function addToCart() {
                    let selectedSize;
                    sizeOptions.forEach(option => {
                        if (option.checked) {
                            selectedSize = option.value;
                        }
                    });

                    if (!selectedSize) {
                        errorMessage.textContent = "Please select a size.";
                    } else {
                        errorMessage.textContent = "";

                        // Check if the product is already in the cart for the selected size
                        const existingItem = cartItems.find(item => item.size === selectedSize);

                        if (existingItem) {
                            // Increase the quantity if the product is already in the cart
                            existingItem.quantity++;
                        } else {
                            const productData = {
                                name: product.title,
                                size: selectedSize,
                                price: product.price,
                                image: product.imageURL,
                                quantity: 1
                            };
                            cartItems.push(productData);
                        }

                        updateMiniCart();
                    }
                }

                // Function to update the mini cart
                function updateMiniCart() {
                    cartItemsList.innerHTML = ""; // Clear existing cart items
                    cartItems.forEach(product => {
                        const cartItem = document.createElement("div");
                        cartItem.className = "cart-item";
                        cartItem.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <p>${product.name} - Size: ${product.size} </p><p> Quantity: ${product.quantity}x - Price: $${(product.price * product.quantity).toFixed(2)}</p>
                        `;
                        cartItemsList.appendChild(cartItem);
                    });
					// Update the cart counter with the total number of products
                const totalProducts = cartItems.reduce((total, product) => total + product.quantity, 0);
                cartCounter.textContent = `(${totalProducts})`;
                }

                // Event listener for Add to Cart button
                addToCartBtn.addEventListener("click", addToCart);

                // Event listener for Mini Cart toggle
                cartToggleBtn.addEventListener("click", function (event) {
                    event.preventDefault(); // Prevent the anchor's default behavior
                    cartItemsList.classList.toggle("show");
                });
            }

            // Fetch products from the API
            fetchProducts();
        });