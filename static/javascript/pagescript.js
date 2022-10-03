let data = '';
let cardData = '';
let sortingKeys = {
    name:'name',
    rating:'rating',
    distance:'distance'
};

function fillBusinessDetails(detail) {
    return `<div>
                <p>${detail.name}</p>
                <hr>
            </div>
            <div>
                <div class="panel">
                    <h2>Status</h2>
                    <p>${detail.is_open_now ? "Open Now" : "Closed"}</p>
                    <h2>Address</h2>
                    <p>${detail.location.display_address.join(' ')}</p>
                    <h2>Transactions Supported</h2>
                    <p>${detail.transactions.join(' ')}</p>
                    <h2>More info</h2>
                    <a href="${detail.url}">Yelp</a>
                </div>
                <div class="panel">
                    <h2>Category</h2>
                    <p>
                        ${detail.categories.map(each => each["title"]).join(' | ')}
                    </p>
                    <h2>Phone Number</h2>
                    <p>${detail.display_phone}</p>
                    <h2>Price</h2>
                    <p>${detail.price}</p>
                </div>
            </div>
            <div id="detail_images">
                <img src="${detail.photos[0]}"/>
                <div>Photo 1</div>     
            </div>
            <div id="detail_images">
                <img src="${detail.photos[1]}"/>
                <div>Photo 2</div>     
            </div>
            <div id="detail_images">
                <img src="${detail.photos[2]}"/>
                <div>Photo 3</div>     
            </div>`;
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
            let result = JSON.parse(request.responseText);
            data = result["businesses"];
            document.getElementById("grid").innerHTML = generateTable(data);
        }
        console.log('Business search request status: ' + request.status);
      }
    };
    request.send();
}

async function fetchData(locationUrl, searchUrl, keyword, distance, category) {
    let lat = 1, lng = 2;

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

    
    // console.log(json);
    console.log(lat + ' ' + lng);

    getJsonResult(`${searchUrl}?term=${keyword}&radius=${distance}&categories=${category}&latitude=${lat}&longitude=${lng}`);

    // payload = {'term': 'Pizza', 'latitude': 34.0223519, 'longitude': -118.285117, 'categories': 'Food', 'radius': 16100};

    // return json;
}

function getSearchResults(baseUrl) {
    const keyword = encodeURIComponent(document.getElementById("keyword").value);
    const distance = encodeURIComponent(document.getElementById("distance").value);
    const category = encodeURIComponent(document.getElementById("category").value);
    const location = encodeURIComponent(document.getElementById("location").value);
    const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCjjsZZeqjH4xjyNhzu6RYND8kif389U7w`;
    
    fetchData(locationUrl, baseUrl, keyword, Math.ceil(distance*1609.34), category);


    // console.log(coordinates);

    //console.log('Yayy');
    
    //event.preventDefault();
}