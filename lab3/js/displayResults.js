// displayResults.js

import { troyDayCriteria } from './troyDayCriteria.js';
import { fetchQuote } from './fetchData.js';

export function displayResults(results, isTroyDay, troyDayPercentage) {
  const resultsDiv = document.getElementById("threshold-results");
  resultsDiv.innerHTML = "";

  Object.keys(results).forEach((key) => {
    const result = results[key];
    const resultElement = `
      <div class="criteria-row">
        <p class="criteria">${troyDayCriteria[key].message}</p>
        <p class="result">${result.value}</p>
        <span class="passes-badge"> ${result.passes ? '✅' : '❌'}</span>
      </div>
    `;
    resultsDiv.insertAdjacentHTML("beforeend", resultElement);
  });

  const resultContainer = document.getElementById("result-container");
  const troyDayResult = isTroyDay
    ? `It's a Troy Day! (${troyDayPercentage.toFixed(2)}%), have a Dostoyevsky quote:`
    : `It's not a Troy Day! (${troyDayPercentage.toFixed(2)}%), have an inspirational quote:`;
  resultContainer.innerHTML = `<h3>${troyDayResult}</h3>`;

  // Fetch and display the quote
  displayQuote(isTroyDay);
}

export async function displayQuote(isTroyDay) {
  try {
    const quoteData = await fetchQuote(isTroyDay);
    const quoteContainer = document.getElementById("quote-container");
    const quote = quoteData[0];
    quoteContainer.innerHTML = `<p>"${quote.q}"</p><p>— ${quote.a}</p>`;
  } catch (error) {
    console.error("Error fetching quote:", error);
    const quoteContainer = document.getElementById("quote-container");
    quoteContainer.innerHTML = "<p>Unable to fetch quote at this time.</p>";
  }
}
