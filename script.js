// Fetch the JSON data
fetch('diagnosisList.json')
  .then(response => response.json())
  .then(diagnosisList => {
    // Code dependent on diagnosisList goes here

    const keys = Object.keys(diagnosisList);
    const entries = Object.entries(diagnosisList);
    const values = Object.values(diagnosisList);

    var list = "<ul id='complaintlist' class='collection with-header list'>";

    for (var key in diagnosisList) {
      let substring = "*";
      let substring2 = "?";
      if (diagnosisList.hasOwnProperty(key)) {
        list += "<li>";
        list += "<h3 class='PresentingComplaint collection-header'>";
        list += diagnosisList[key].title;
        list += "</h3>";
        for (var i in diagnosisList[key].differential) {
          let string = diagnosisList[key].differential[i];

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
    document.getElementById("list").innerHTML = list;

    // Initialize any further processing or libraries that depend on diagnosisList
    var options = {
      valueNames: ["PresentingComplaint", "diagnosis"]
    };

    var userList = new List("PresentingComplaints", {
      valueNames: ["PresentingComplaint"],
      page: 1,
      pagination: true
    });

  })
  .catch(error => {
    console.error('Error loading diagnosis data:', error);
  });
