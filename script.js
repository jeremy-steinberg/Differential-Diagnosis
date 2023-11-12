// Fetch the JSON data and process it
function fetchDiagnosisData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching diagnosis data:', error);
      displayErrorMessage();
    });
}

function processDiagnosisData(diagnosisList) {
  let list = "<ul id='complaintlist' class='collection with-header list'>";

  for (var key in diagnosisList) {
    if (diagnosisList.hasOwnProperty(key)) {
      list += "<li>";
      list += "<h3 class='PresentingComplaint collection-header'>";
      list += diagnosisList[key].title;
      list += "</h3>";

      for (var i in diagnosisList[key].differential) {
        let string = diagnosisList[key].differential[i];
        let substring = "*";
        let substring2 = "?";

        if (string.includes(substring) && string.includes(substring2)) {
          list += "<p class='diagnosis collection-item double-miss'>";
          string = string.replace('?*', '').replace('*?', '');
        } else if (string.includes(substring)) {
          list += "<p class='diagnosis collection-item common-missed'>";
          string = string.replace('*', '');
        } else if (string.includes(substring2)) {
          list += "<p class='diagnosis collection-item dont-miss'>";
          string = string.replace('?', '');
        } else {
          list += "<p class='diagnosis collection-item general'>";
        }

        list += string;
        list += "</p>";
      }
      list += "</li>";
    }
  }

  list += "</ul>";
  return list;
}

function renderDiagnosisList(listHtml) {
  document.getElementById("list").innerHTML = listHtml;
  initializeList();
}

function initializeList() {
  // Initialize List.js with pagination
  var userList = new List('PresentingComplaints', {
    valueNames: ['PresentingComplaint', 'diagnosis'],
    page: 1, // Adjust the number of items per page as needed
    pagination: true
  });
}

function displayErrorMessage() {
  const errorMessage = `
    <div class="error-message">
      An error occurred while loading the data. Please try again later.
      <button onclick="retryFetch()">Retry</button>
    </div>
  `;
  document.getElementById("error-container").innerHTML = errorMessage;
}

function retryFetch() {
  fetchDiagnosisData('diagnosisList.json')
    .then(diagnosisList => {
      const listHtml = processDiagnosisData(diagnosisList);
      renderDiagnosisList(listHtml);
	document.getElementById("error-container").innerHTML = "";
    });
}

// Initial fetch call
fetchDiagnosisData('diagnosisList.json')
  .then(diagnosisList => {
    const listHtml = processDiagnosisData(diagnosisList);
    renderDiagnosisList(listHtml);
  });
