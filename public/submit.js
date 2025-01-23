//JShintESversion: 6
document.addEventListener("DOMContentLoaded", () => {
  const inFile = document.getElementById("fileID");
  const btnUpload = document.getElementById("btn-upload");
  const name = document.getElementById("name");
  const phNum = document.getElementById("phone_number");
  const address = document.getElementById("address");
  const form = document.getElementById("user-info-form");
  const progressButtons = document.querySelectorAll(".position-relative .btn");

  //Blue -> Green
  function setAllButtonsToGreen() {
      progressButtons.forEach((button) => {
          button.classList.remove("btn-primary"); 
          button.classList.add("btn-success"); 
      });
  }

  //PDF Upload
  btnUpload.addEventListener("click", () => {
      inFile.click();
  });

  inFile.addEventListener("change", () => {
      if (!inFile.files[0]) {
          console.error("You missed it? Nothing is selected..");
          return;
      }

      const formData = new FormData();
      formData.append("pdfFile", inFile.files[0]);

      fetch("/extract-text", {
          method: "POST",
          body: formData,
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Something went wrong.. working on it!");
          }
          return response.json();
      })
      .then((extractedData) => {
          console.log("Extracted Data:", extractedData);

          //autofill form
          name.value = extractedData.name || '';
          phNum.value = extractedData.phone_number || '';
          address.value = extractedData.address || '';
      })
      .catch((error) => {
          console.error("Error:", error);
      });
  });

  form.addEventListener("submit", (e) => {
      e.preventDefault();

      console.log("Submission complete!");
      console.log({
          name: name.value,
          phone_number: phNum.value,
          address: address.value,
      });

      alert('The Form has been submitted. Thank You!✨');
      setAllButtonsToGreen();

      //reset
      setTimeout(() => {
          form.reset();
          progressButtons.forEach((button) => {
              button.classList.remove("btn-success"); 
              button.classList.add("btn-primary"); 
          });
      }, 2000); //2000ms = 2 s
  });
});


/* JQuery
const $dropArea = $(".drop_box");
const $button = $dropArea.find("button");
const $input = $dropArea.find("input");

$button.on("click", () => $input.click());

$input.on("change", function (e) {
  const fileName = e.target.files[0].name;
  const filedata = `
    <form action="" method="post">
      <div class="form">
        <h4>${fileName}</h4>
        <input type="email" placeholder="Enter email upload file">
        <button class="btn">Upload</button>
      </div>
    </form>`;
  $dropArea.html(filedata);
});*/
