// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the DOM elements we'll be working with
    const pricePerLiterInput = document.getElementById('pricePerLiter');
    const litersInput = document.getElementById('liters');
    const calculateBtn = document.getElementById('calculateBtn');
    const totalCostElement = document.getElementById('totalCost');
    
    // Add event listener to the calculate button
    calculateBtn.addEventListener('click', calculatePetrolCost);
    
    // Function to calculate the total petrol cost
    function calculatePetrolCost() {
        // Get values from input fields and convert to numbers
        const pricePerLiter = parseFloat(pricePerLiterInput.value);
        const liters = parseFloat(litersInput.value);
        
        // Validate inputs to ensure they are positive numbers
        if (isNaN(pricePerLiter) || isNaN(liters) || pricePerLiter < 0 || liters < 0) {
            totalCostElement.textContent = 'Please enter valid numbers';
            return;
        }
        
        // Calculate the total cost
        const totalCost = pricePerLiter * liters;
        
        // Format the total cost to 2 decimal places and display it
        totalCostElement.textContent = `Total Cost: £${totalCost.toFixed(2)}`;
    }
    
    // Initial calculation when page loads
    calculatePetrolCost();
});