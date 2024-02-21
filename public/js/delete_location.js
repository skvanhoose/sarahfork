function deleteLocation(locationID) {
    let link = '/delete-location-ajax/';
    let data = {
      idLocation: locationID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(locationID);
      }
    });
  }
  
  function deleteRow(locationID){
      let table = document.getElementById("locations-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == locationID) {
              table.deleteRow(i);
              break;
         }
      }
  }