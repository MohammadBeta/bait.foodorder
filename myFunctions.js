const continueBtn = document.getElementById('continueBtn');
const orderSection = document.getElementById('orderSection');
const orderForm = document.getElementById('orderForm');
const detailButtons = document.querySelectorAll('tbody button');
const bill = document.getElementById('bill');
const closeBillBtn = document.getElementById('closeBill');

if (bill) {
    bill.classList.add('hidden');
}

$('#closeBill').on('click', function () {
    bill.classList.add('hidden');
});

$('#bill').on('click', function (e) {
    if (e.target === bill) {
        bill.classList.add('hidden');
    }
});

$('#continueBtn').on('click', function () {
    const anySelected = [...document.querySelectorAll('.meal-checkbox')].some(cb => cb.checked);
    if (!anySelected) {
        alert('يجب اختيار وجبة واحدة على الأقل قبل المتابعة.');
        return;
    }
    orderSection.classList.toggle('hidden');
    if (!orderSection.classList.contains('hidden')) {
        orderSection.scrollIntoView({ behavior: 'smooth' });
    }
});

$('tbody').on('click', 'button', function () {
    const row = $(this).closest('tr')[0];
    const detailsRow = row.nextElementSibling;
    if (detailsRow && detailsRow.classList.contains('details-row')) {
        const isHidden = detailsRow.classList.toggle('hidden');
        this.innerText = isHidden ? 'إظهار' : 'إخفاء';
    }
});

function getSelectedMeals() {
    const rows = document.querySelectorAll('tbody tr');
    const selectedMeals = [];

    rows.forEach((row) => {
        const checkbox = row.querySelector('.meal-checkbox');
        if (checkbox && checkbox.checked) {
            const mealName = row.cells[1].innerText.trim();
            const priceText = row.cells[2].innerText.trim();
            const price = Number(priceText.replace(/[^0-9]/g, ''));
            selectedMeals.push({ mealName, price });
        }
    });

    return selectedMeals;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach((el) => {
        el.innerText = '';
    });
}

$('#orderForm').on('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('nationalId').value.trim();
    const date = document.getElementById('birthdate').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    let valid = true;

    const nameRegex = /^[\u0600-\u06FF\s]+$/;
    if (name && !nameRegex.test(name)) {
        document.getElementById('nameError').innerText = 'الاسم يجب أن يكون بالعربية فقط';
        valid = false;
    }

    let validCities = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];
    if (!/^\d{11}$/.test(id)) {
        document.getElementById('idError').innerText = 'الرقم الوطني يجب أن يكون 11 رقم';
        valid = false;
    } else if (!validCities.includes(id.substring(0, 2))) {
        document.getElementById('idError').innerText = 'رمز المحافظة غير صحيح';
        valid = false;
    }

    if (date && !/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        document.getElementById('dateError').innerText = 'الصيغة يجب أن تكون dd-mm-yyyy';
        valid = false;
    }

    if (phone && !/^09[3-9]\d{7}$/.test(phone)) {
        document.getElementById('phoneError').innerText = 'رقم الموبايل غير صحيح';
        valid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').innerText = 'الإيميل غير صحيح';
        valid = false;
    }

    const selectedMeals = getSelectedMeals();
    if (selectedMeals.length === 0) {
        alert('يجب اختيار وجبة أو أكثر قبل الإرسال.');
        valid = false;
    }

    if (!valid) {
        return;
    }

    const subtotal = selectedMeals.reduce((sum, meal) => sum + meal.price, 0);
    const vat = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + vat) * 100) / 100;

    document.getElementById('billName').innerText = name;
    document.getElementById('billId').innerText = id;
    document.getElementById('billDate').innerText = new Date().toLocaleDateString('ar-EG');

    const mealsHtml = selectedMeals.map(meal =>
        `<tr><td>${meal.mealName}</td><td>${meal.price} ل.س</td></tr>`
    ).join('');
    document.getElementById('billDetails').innerHTML = mealsHtml;
    document.getElementById('billSubtotal').innerText = subtotal;
    document.getElementById('billVat').innerText = vat;
    document.getElementById('billTotal').innerText = total;

    bill.classList.remove('hidden');
    orderForm.reset();
});