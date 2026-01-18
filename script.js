/**
 * PUBLIC ACCESS CHECK
 * Checks if the admin has set the status to "closed"
 */
if (localStorage.getItem('bakery_status') === 'closed') {
    document.addEventListener("DOMContentLoaded", () => {
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#f0f5ff; font-family:'Fredoka',sans-serif; text-align:center;">
                <h1 style="color:#698ae8; font-size:3rem;">🌸 Shop is Closed</h1>
                <p style="color:#555; font-size:1.2rem;">We are currently not accepting orders. Please check back later!</p>
            </div>`;
    });
} 
/**
 * LUSH PINK OVEN - MASTER SCRIPT
 * Features: Accordion Menus, Quantity Grouping, UI Resets
 */

// --- 1. CONFIGURATION ---
// IMPORTANT: Paste your Discord Webhook URL between the quotes below
const WEBHOOK_URL = "https://discord.com/api/webhooks/1456590623103520910/rfvv4Usw4Y8B_8bCgUxpB2zR9pyYXJYJvtjTDNj1tccHpOOvKKuw2w6-bhe_AofOGpIr";

let cart = [];

/**
 * TOGGLE CATEGORIES (Accordion Logic)
 * Opens the clicked category and closes others for a clean look
 */
window.toggleCategory = function(id) {
    const content = document.getElementById(id);
    const isVisible = content.style.display === "block";
    
    // Close all other open categories first
    document.querySelectorAll('.major-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Toggle the clicked one
    content.style.display = isVisible ? "none" : "block";
};

/**
 * ADD ITEM TO CART
 */
window.addItem = function(name, price) {
    const item = {
        id: Date.now() + Math.random(),
        name: name,
        price: price
    };
    cart.push(item);
    updateUI();
};

/**
 * REMOVE ITEM FROM CART
 */
window.removeItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateUI();
};

/**
 * UPDATE VISUAL CART & TOTAL
 */
function updateUI() {
    const list = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    list.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#bbb; font-style:italic; margin-top:20px;">Your cart is empty...</p>';
    } else {
        cart.forEach(i => {
            const div = document.createElement('div');
            div.className = "cart-bubble";
            div.innerHTML = `
                <span>${i.name}</span>
                <button class="remove-btn" onclick="removeItem(${i.id})" style="color:var(--hot-pink); border:none; background:none; cursor:pointer; font-weight:bold; font-size:1.1rem;">✖</button>
            `;
            list.appendChild(div);
            total += i.price;
        });
    }
    totalDisplay.innerText = total;
}

/**
 * SUBMIT ORDER TO DISCORD
 * Includes Quantity Logic (e.g., Salmon Dinner x2)
 */
window.submit = async function() {
    const user = document.getElementById('username').value.trim();
    const note = document.getElementById('request').value.trim();
    const submitBtn = document.getElementById('submit-btn');
    const successArea = document.getElementById('order-again-area');

    // Validation
    if (!user) {
        alert("🎀 Please enter your Username!");
        return;
    }
    if (cart.length === 0) {
        alert("🛒 Add some treats to your order first!");
        return;
    }

    // GROUPING QUANTITIES
    const counts = {};
    cart.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + 1;
    });

    const itemString = Object.entries(counts)
        .map(([name, qty]) => `• ${name} x${qty}`)
        .join("\n");

    const payload = {
        embeds: [{
            title: "🌸 NEW LUSH OVEN ORDER",
            color: 16747681,
            fields: [
                { name: "Customer", value: `**${user}**`, inline: true },
                { name: "Total Bill", value: `**$${document.getElementById('total-price').innerText}**`, inline: true },
                { name: "Items Ordered", value: itemString },
                { name: "Special Requests", value: note || "*None*" }
            ],
            footer: { text: "Bloxburg Digital Kitchen" },
            timestamp: new Date()
        }]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Switch UI to Success State
            submitBtn.style.display = 'none';
            successArea.style.display = 'block';
        } else {
            throw new Error();
        }
    } catch (e) {
        alert("❌ Error sending order. Check your Webhook URL!");
    }
};

/**
 * RESET FORM FOR NEW ORDER
 */
window.resetForm = function() {
    cart = [];
    updateUI();
    document.getElementById('username').value = "";
    document.getElementById('request').value = "";
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('order-again-area').style.display = 'none';
    
    // Smooth scroll back to top of menu
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
