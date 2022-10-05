let data = '';
let cardData = '';
let sortingKeys = {
    name:'name',
    rating:'rating',
    distance:'distance'
};

function fillBusinessDetails(detail) {
    let text = `<div>
                    <h2 id="business_title">${detail.name}</h2>
                    <hr id="hr_detail">
                </div>
                <div class="panel">
                    <div class="detail_section">`;

    if(detail.hours && detail.hours.length >= 1 && detail.hours[0].is_open_now != null) {
        text += `<div class="detail_info">
                    <div class="heading">Status</div>
                    <button id="shop_status" style="background-color:${detail.hours[0].is_open_now ? "green" : "red"}">${detail.hours[0].is_open_now ? "Open Now" : "Closed"}</button>
                </div>`;
    }
    if(detail.location) {
        let daddress = detail.location.display_address.join(' ').length >= 1 ? detail.location.display_address.join(' ') : detail.location.address1;
        if(daddress) {
            text += `<div class="detail_info">
                    <div class="heading">Address</div>
                    <div>${detail.location.display_address.join(' ')}</div>
                </div>`;
        }
    }
    if(detail.transactions && detail.transactions.length >= 1) {
        text += `<div class="detail_info">
                    <div class="heading">Transactions Supported</div>
                    <div>${detail.transactions.join(' ')}</div>
                </div>`;
    }
    if(detail.url) {
        text += `<div class="detail_info">
                    <div class="heading">More info</div>
                    <a href="${detail.url}">Yelp</a>
                </div>`;
    }

    text += `</div>
            <div class="detail_section">`;

    if(detail.categories) {
        text += `<div class="detail_info">
                    <div class="heading">Category</div>
                    <div>${detail.categories.map(each => each["title"]).join(' | ')}</div>
                </div>`;
    }
    if(detail.display_phone) {
        text += `<div class="detail_info">
                    <div class="heading">Phone Number</div>
                    <div>${detail.display_phone}</div>
                </div>`;
    }
    if(detail.price) {
        text += `<div>
                    <div class="heading">Price</div>
                    <div>${detail.price}</div>
                </div>`;
    }

    text += `</div>
        </div>`;

    for(let i = 0; i < Math.min(detail.photos.length, 3); i++)
    {
        text += `<div id="detail_images">
                    <img src="${detail.photos[i]}"/>
                    <div>Photo ${i + 1}</div>     
                </div>`;
    }

    return text;
}

function getBusinessDetail(index) {
    let id = data[parseInt(index) - 1]["id"];
    const request = new XMLHttpRequest();
    request.open("GET", `/getBusinessDetail?id=${id}`);
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
            let result = JSON.parse(request.responseText);
            document.getElementById("detail").innerHTML = fillBusinessDetails(result);
        }
        console.log('Business detail request status: ' + request.status);
      }
    };
    request.send();
}

function sortData(sortingKey) {
    let isAscending = true;
    for(let i = 1; i < data.length; i++) {
        if(data[i][sortingKey] < data[i - 1][sortingKey]) {
            isAscending = false;
            break;
        }
    }
    let greaterVal = isAscending ? -1 : 1;
    let smallerVal = isAscending ? 1 : -1;

    data.sort(function(a, b) {
        let compareValue = 0;
        if(a[sortingKey] > b[sortingKey])
            compareValue = greaterVal;
        else if(a[sortingKey] < b[sortingKey])
            compareValue = smallerVal;
        return compareValue;
    });
    document.getElementById("grid").innerHTML = generateTable(data);
}

function resetToDefault() {
    document.getElementById("keyword").value = "";
    document.getElementById("distance").value = 10;
    document.getElementById("category").value = "Default";
    document.getElementById("location").value = "";
    document.getElementById("location").disabled = false;
    document.getElementById("location").style.backgroundColor = "white";
    document.getElementById("auto-locate").checked = false;
    document.getElementById("grid").innerHTML = "";
    document.getElementById("detail").innerHTML = "";
}

function disableLocationBox() {
    if(document.getElementById("location").disabled) {
        document.getElementById("location").disabled = false;
        document.getElementById("location").style.backgroundColor = "white";
    } else {
        document.getElementById("location").value = "";
        document.getElementById("location").disabled = true;
        document.getElementById("location").style.backgroundColor = "#d6d6d6";
    }
}

function createRow(index, image, name, rating, distance) {
    return `<tr>
                <td>${index}</td>
                <td id="image_cell"><img src="${image}" height="100" width="100"></td>
                <td id="name_cell"><p id="${index}" onclick="getBusinessDetail(this.id)">${name}</p></td>
                <td id="rating_cell">${rating}</td>
                <td id="distance_cell">${(parseFloat(distance)/1609.34).toFixed(2)}</td>
            </tr>`;
}

function generateTable(businesses) {
    let text = `<table>
                    <thead>
                        <tr>
                            <th id="number">No.</th>
                            <th>Image</th>
                            <th onclick="sortData('${sortingKeys["name"]}')">Business Name</th>
                            <th onclick="sortData('${sortingKeys["rating"]}')">Rating</th>
                            <th onclick="sortData('${sortingKeys["distance"]}')">Distance (miles)</th>
                        </tr>
                    </thead>`;

    text += `<tbody>`;
    for(let i = 0; i < businesses.length; i++) {
        let business = businesses[i];
        text += createRow(i+1,
            business["image_url"],
            business["name"],
            business["rating"],
            business["distance"]
            );
    }
    text += `</tbody></table>`;

    return text;
}

function getJsonResult(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
            try 
            {
                let result = JSON.parse(request.responseText);
                data = result["businesses"];
                if(data.length > 0) {
                    document.getElementById("grid").innerHTML = generateTable(data);
                } else {
                    document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
                }
            } 
            catch(err)
            {
                document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
            }            
        }
        else {
            document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
        }
        console.log('Business search request status: ' + request.status);
      }
    };
    request.send();
}

async function fetchData(locationUrl, searchUrl, keyword, distance, category) {
    let lat = 1, lng = 2;

    

    try 
    {
        if(document.getElementById("auto-locate").checked) {
            const response = await fetch(`https://ipinfo.io/?token=33d28f55a75e60`);
            const json = await response.json();
            [lat, lng] = json.loc.split(",");
        } else {
            const response = await fetch(locationUrl);
            const json = await response.json();
            lat = json.results[0].geometry.location.lat;
            lng = json.results[0].geometry.location.lng;
        }
    } 
    catch(err)
    {
        document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
    }

    
    // console.log(json);
    console.log(lat + ' ' + lng);

    getJsonResult(`${searchUrl}?term=${keyword}&radius=${distance}&categories=${category}&latitude=${lat}&longitude=${lng}`);

    // payload = {'term': 'Pizza', 'latitude': 34.0223519, 'longitude': -118.285117, 'categories': 'Food', 'radius': 16100};

    // return json;
}

// function getSearchResults(baseUrl) {
//     const keyword = encodeURIComponent(document.getElementById("keyword").value);
//     const distance = encodeURIComponent(document.getElementById("distance").value);
//     const category = encodeURIComponent(document.getElementById("category").value);
//     const location = encodeURIComponent(document.getElementById("location").value);
//     const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCjjsZZeqjH4xjyNhzu6RYND8kif389U7w`;
    
//     try {
//         fetchData(locationUrl, baseUrl, keyword, Math.ceil(distance*1609.34), category);
//     }
//     catch(err) {
//         document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
//     }

//     // console.log(coordinates);

//     //console.log('Yayy');
    
//     //event.preventDefault();
// }

//New changes to mandate form
var searchFunction = function(event) {
    const keyword = encodeURIComponent(document.getElementById("keyword").value);
    const distance = encodeURIComponent(document.getElementById("distance").value);
    const category = encodeURIComponent(document.getElementById("category").value);
    const location = encodeURIComponent(document.getElementById("location").value);
    const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCjjsZZeqjH4xjyNhzu6RYND8kif389U7w`;
    
    try 
    {
        fetchData(locationUrl, '/getNearbyBusinesses', keyword, Math.ceil(distance*1609.34), category);
    } 
    catch(err)
    {
        document.getElementById("grid").innerHTML = `<div id="norecord">No record has been found</div>`;
    }
    event.preventDefault();
}

// attach event listener
document.getElementById("form").addEventListener("submit", searchFunction, true);