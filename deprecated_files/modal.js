{/* <div id="myModal" class="modal">

    <!-- Modal content, pop-up on a custom action. Doesn't actually DO anything when the buttons are pressed -->
    <div class="modal-content">
      <span class="close">&times;</span>
      <!-- Header of the modal, change to what feels appropriate -->
      <h3>Create a JIRA</h3>
      <p>Summary <input type='text' id='summary-field' style="width: 400px;"></p>
      <p>Description</p>
      <textarea style="height: 100px; width: 450px;"></textarea>
      <p><button onclick='document.getElementById("myModal").style.display="none";'>Cancel</button> <button onclick='document.getElementById("myModal").style.display="none";'>Create</button></p>
    </div>
  
</div> */}


/*
* Modal window operations
*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
//btn.onclick = function() {
//modal.style.display = "block";
//}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
