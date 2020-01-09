// scripts
const currentDate = document.querySelector("#current_date");

const date = new Date();
currentDate.innerHTML = date.toDateString();

class MultiSelectDropdown extends HTMLElement {
  constructor() {
    super();
    // element created
    debugger;
    this.createMultiSelectHTMLElements();
  }

  createMultiSelectHTMLElements = () => {
    debugger;
    try {
      let masterElement = document.createElement("div");
      masterElement.className = "content";
      let firstChildElement = document.createElement("div");
      firstChildElement.className = "dropdown";
      let secondchildElement = document.createElement("div");
      secondchildElement.className = "multiselect_fields dropbtn";
      let thirdChildElement = document.createElement("div");
      thirdChildElement.className = "dropdown-content";
      thirdChildElement.id = "multi-select";
      thirdChildElement.onclick = event => {
        this.add_selected_item(this, event);
      };
      let childforSecondChild = document.createElement("input");
      childforSecondChild.type = "text";
      childforSecondChild.placeholder = "Search..";
      childforSecondChild.id = "myInput";
      childforSecondChild.onkeyup = "filterConent()";
      secondchildElement.appendChild(childforSecondChild);
      firstChildElement.appendChild(secondchildElement);
      firstChildElement.appendChild(thirdChildElement);
      masterElement.appendChild(firstChildElement);
      let myElement = document.getElementsByTagName("multi-select-dropdown");
      myElement[0].appendChild(masterElement);
      this.insertData();
    } catch (error) {
      console.error(error);
    }
  };
  add_selected_item = (elem, e) => {
    e.stopPropagation();
    try {
      debugger;
      if (e.target.classList.contains("list-selected")) {
        e.target.classList.remove("selected-items");
        e.target.classList.remove("list-selected");
        let items = document.querySelectorAll(".selected_content");
        let arr = [...items];
        let removeElement = arr.find(item => {
          if (item.textContent.includes(e.target.innerText)) {
            return item;
          }
        });
        this.remove_selected_item(removeElement, e);
      } else if (parseInt(e.target.id) >= 0 && parseInt(e.target.id) < 250) {
        debugger;
        e.target.classList.add("list-selected");
        e.target.classList.add("selected-items");
        let option_text = e.target.innerHTML;
        let option_value = e.target.getAttribute("value");
        let selected_items = elem.parentElement.parentElement.querySelector(
          ".multiselect_fields"
        );

        /*
        creating the child elements for the option selected by user 
        and 
        append to the parent element (selected_items).
      */
        let parentElement = document.createElement("div");
        parentElement.setAttribute("class", "multiselect_field");
        let childElement = document.createElement("div");
        childElement.setAttribute("value", option_value);
        childElement.setAttribute("class", "selected_content");

        childElement.innerText = option_text;
        let secondchildElement = document.createElement("span");
        secondchildElement.setAttribute("class", "del_icon");

        secondchildElement.innerHTML = "&#10006"; //"\u00D7";
        // secondchildElement.addEventListener("click", function() {
        //   return remove_selected_item(this, event);
        // });
        secondchildElement.onclick = event => {
          this.remove_selected_item(event.target, event);
        };
        childElement.appendChild(secondchildElement);
        parentElement.appendChild(childElement);

        selected_items.insertBefore(
          parentElement,
          selected_items.lastElementChild
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* 
    fetch and insert the fetched data to dropdown.
    async function (ES8 features) to work with promises
  */
  insertData = async (url = "https://restcountries.eu/rest/v2/all") => {
    debugger;
    try {
      // call fetchdata function and get the json data
      let response = await this.fetchData(url);
      if (response) {
        const createDropDownElement = (item, index) => {
          let listElement = document.createElement("li");

          listElement.appendChild(document.createTextNode(item.name));
          listElement.setAttribute("value", item.region);
          listElement.setAttribute("id", index);
          // listElement.addEventListener("click", function(event) {
          //   this.add_selected_item(this, event);
          // });
          // listElement.onclick = event => {
          //   console.log(event);
          //   this.add_selected_item(this, event);
          //   debugger;
          // };
          // listElement.addEventListener(
          //   "click",
          //   this.add_selected_item.bind(this, event)
          // );
          multiSelect.appendChild(listElement);
        };

        let apiResult = response;
        const multiSelect = document.querySelector("#multi-select");

        // Iterate through each element in the response and call the createDropDownElement.
        apiResult.forEach(createDropDownElement);

        /*
          function which create a list element, add the attributes and event eventlisteners to it.
          List element is appended as child to #mulit-select(parent element)
        */
      } else {
        alert("Error in retrieving the data!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // fetch operation
  fetchData = url => {
    const requestUrl = url;

    return new Promise((resolve, reject) => {
      // fetch function used to make the network request with requestURL
      fetch(requestUrl)
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            let error = new Error(response.statusText || response.status);
            error.response = response;
            reject(error);
          }
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // add the selected items

  // remove the items
  remove_selected_item = (elem, e) => {
    e.stopPropagation();
    try {
      debugger;
      if (elem.classList.contains("del_icon")) {
        /*
          remove the items from multiselect field via remove icon
          remove the styles from dropdown list
        */
        elem.parentElement.parentElement.remove();
        let items = document.querySelectorAll(".list-selected");
        let arr = [...items];
        let removeStyle = arr.find(item => {
          if (elem.parentElement.textContent.includes(item.innerText)) {
            return item;
          }
        });
        removeStyle.classList.remove("list-selected");
        removeStyle.classList.remove("selected-items");
      } else {
        elem.parentElement.remove(); // remove the selected item via dropdown list
      }
    } catch (e) {
      console.error(e);
    }
  };

  // filter the dropdown content
  filterContent = () => {
    let inputElement, filterValue, htmlCollector;
    inputElement = document.getElementById("myInput");
    filterValue = inputElement.value.toUpperCase();
    let element = document.getElementById("multi-select");
    htmlCollector = element.getElementsByTagName("li");

    let arr = [...htmlCollector]; //using the spread operator

    /*
      filter method used to filter the data based on the input in search box and display the filtered results.
    */
    arr.filter(elem => {
      let value = elem.textContent || elem.innerText;
      if (value.toUpperCase().indexOf(filterValue) > -1) {
        elem.style.display = "";
      } else {
        elem.style.display = "none";
      }
    });
  };

  // get all selected Items
  getAllSelectedItems = () => {
    let selector = document.querySelectorAll(".selected_content");
    let arr = [...selector]; // spread operator to get the values stored in form of array
    if (arr.length) {
      let selectedItems = arr.map(item => item.innerText.split("\n")[0]);
      alert(selectedItems);
    } else {
      alert("Please select the items!");
    }
    return arr;
  };
  // there can be other element methods and properties
}

customElements.define("multi-select-dropdown", MultiSelectDropdown);

getAllSelectedItems = () => {
  let selector = document.querySelectorAll(".selected_content");
  let arr = [...selector]; // spread operator to get the values stored in form of array
  if (arr.length) {
    let selectedItems = arr.map(item => item.innerText.split("\n")[0]);
    alert(selectedItems);
  } else {
    alert("Please select the items!");
  }
  return arr;
};
