document.addEventListener("DOMContentLoaded", function () {
  const loginScreen = document.getElementById("login-screen");
  const expenseScreen = document.getElementById("expense-screen");
  const loginForm = document.getElementById("login-form");
  const mealsForm = document.getElementById("meals-form");
  const otherExpensesForm = document.getElementById("other-expenses-form");
  const mealsExpensesList = document.getElementById("meals-expenses-list");
  const otherExpensesList = document.getElementById("other-expenses-list");
  const mealsTotalAmount = document.getElementById("meals-total-amount");
  const otherTotalAmount = document.getElementById("other-total-amount");
  const localStorageKeyMeals = "meals_expenses";
  const localStorageKeyOthers = "other_expenses";

  const defaultUsername = "admin";
  const defaultPassword = "admin";

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === defaultUsername && password === defaultPassword) {
      loginScreen.classList.add("hidden");
      expenseScreen.classList.remove("hidden");
      loadExpenses(localStorageKeyMeals, mealsExpensesList, mealsTotalAmount);
      loadExpenses(localStorageKeyOthers, otherExpensesList, otherTotalAmount);
    } else {
      alert("Invalid login credentials");
    }
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tc) => tc.classList.remove("active"));
      this.classList.add("active");
      document.getElementById(this.dataset.tab).classList.add("active");
    });
  });

  function loadExpenses(storageKey, expensesListElement, totalAmountElement) {
    const expenses = JSON.parse(localStorage.getItem(storageKey)) || [];
    expensesListElement.innerHTML = "";
    let totalAmount = 0;
    expenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.className = "expense-item";
      expenseItem.textContent = `${expense.date} - ${expense.item} - ${
        expense.spender
      } - ${expense.amount} - ${expense.members.join(", ")}`;
      expensesListElement.appendChild(expenseItem);
      totalAmount += parseFloat(expense.amount);
    });
    totalAmountElement.textContent = `Total: ${totalAmount}`;
  }

  function filterExpenses(
    storageKey,
    expensesListElement,
    totalAmountElement,
    startDate,
    endDate
  ) {
    const expenses = JSON.parse(localStorage.getItem(storageKey)) || [];
    expensesListElement.innerHTML = "";
    let totalAmount = 0;
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (
        (startDate && expenseDate < startDate) ||
        (endDate && expenseDate > endDate)
      ) {
        return;
      }
      const expenseItem = document.createElement("div");
      expenseItem.className = "expense-item";
      expenseItem.textContent = `${expense.date} - ${expense.item} - ${
        expense.spender
      } - ${expense.amount} - ${expense.members.join(", ")}`;
      expensesListElement.appendChild(expenseItem);
      totalAmount += parseFloat(expense.amount);
    });
    totalAmountElement.textContent = `Total: ${totalAmount}`;
  }

  mealsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const item = document.getElementById("meal-expense-item").value;
    const spender = document.getElementById("meal-spender").value;
    const amount = document.getElementById("meal-amount").value;
    const date = document.getElementById("meal-date").value;
    const members = Array.from(
      document.querySelectorAll("#meals-tab .checkbox-group input:checked")
    ).map((cb) => cb.value);

    const expense = { item, spender, amount, date, members };
    const expenses =
      JSON.parse(localStorage.getItem(localStorageKeyMeals)) || [];
    expenses.push(expense);
    localStorage.setItem(localStorageKeyMeals, JSON.stringify(expenses));

    loadExpenses(localStorageKeyMeals, mealsExpensesList, mealsTotalAmount);
    mealsForm.reset();
  });

  otherExpensesForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const item = document.getElementById("other-expense-item").value;
    const spender = document.getElementById("other-spender").value;
    const amount = document.getElementById("other-amount").value;
    const date = document.getElementById("other-date").value;
    const members = Array.from(
      document.querySelectorAll(
        "#other-expenses-tab .checkbox-group input:checked"
      )
    ).map((cb) => cb.value);

    const expense = { item, spender, amount, date, members };
    const expenses =
      JSON.parse(localStorage.getItem(localStorageKeyOthers)) || [];
    expenses.push(expense);
    localStorage.setItem(localStorageKeyOthers, JSON.stringify(expenses));

    loadExpenses(localStorageKeyOthers, otherExpensesList, otherTotalAmount);
    otherExpensesForm.reset();
  });

  document
    .getElementById("meals-filter-btn")
    .addEventListener("click", function () {
      const startDate = new Date(
        document.getElementById("meals-start-date").value
      );
      const endDate = new Date(document.getElementById("meals-end-date").value);
      filterExpenses(
        localStorageKeyMeals,
        mealsExpensesList,
        mealsTotalAmount,
        startDate,
        endDate
      );
    });

  document
    .getElementById("other-filter-btn")
    .addEventListener("click", function () {
      const startDate = new Date(
        document.getElementById("other-start-date").value
      );
      const endDate = new Date(document.getElementById("other-end-date").value);
      filterExpenses(
        localStorageKeyOthers,
        otherExpensesList,
        otherTotalAmount,
        startDate,
        endDate
      );
    });
  window.onload = function () {
    var today = new Date();
    var year = today.getFullYear();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);
    var hours = ("0" + today.getHours()).slice(-2);
    var minutes = ("0" + today.getMinutes()).slice(-2);

    var formattedDate =
      year + "-" + month + "-" + day + "T" + hours + ":" + minutes;

    document.getElementById("meal-date").value = formattedDate;
  };
});
