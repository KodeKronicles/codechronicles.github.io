var items = []
var narratives = []
var currentSelection = []
var currentNarrative =""
var currentValue=""
var currentSort = ""


document.addEventListener("DOMContentLoaded", async function(event) {
	console.log(" DO NOT PEEP o((>ω< ))o")
	fetch('https://raw.githubusercontent.com/KodeKronicles/codechronicles.github.io/main/data.json')
	.then(response => response.json())
	.then(data => {	
		items = data.items
		var startWith = data.meta.startWith
		var item = items[startWith]

		narratives = data.meta.narratives
		currentNarrative = data.meta.startNarrative
		currentValue = data.meta.startValue
		prepareNarratives()
	})
});



function prepareNarratives() {
	currentSelection = items.filter( i => 
		i.info["Type of device"]?.includes(currentNarrative) 
	)
	currentSelection.sort( (i,j) =>  
		i['@sort'] < j['@sort'] ? -1 : 1 
	)
	if (currentSelection.length==0) 
		currentSelection = items	

	var index  = currentSelection.findIndex( i => i['@sort'] == currentSort )
	if (index == -1) index = 0
	showInfo(index)
}

function showInfo(index) {
	var item = currentSelection[index]
	currentSort = item['@sort']
	inner("fullHeader",item.info.Name);
	var imgdiv = byId("img1-div");
	var imgpath = "url("+item.image1+")";
	imgdiv.style.backgroundImage = imgpath;
	//imgdiv.style.display = "block";
	imgdiv.style.height = "100%";
	imgdiv.style.width = "100%";
	imgdiv.style.backgroundRepeat = "no-repeat";
	imgdiv.style.backgroundSize = "100% auto";
	var copyrightBox = byId("copyrightBox");
	copyrightBox.innerText = item.copyright;
	//byId("img1").src = item.image1
	//byId("img1").alt = item.shortName
	createInfoTable(item)
	swapHeadersWithImages();
	inner("shortInfo","<p style='border-bottom-width: 4px; border-bottom-style: solid; border-bottom-color: #222828; padding-top: 1.5rem; padding-bottom: 0.5rem;'>"+item.shortInfo + "</p><p style='margin-top: 2rem; margin-bottom: 1rem; text-align: center;'>" + '<a type="button" class="btn btn-outline-danger btn-sm" onclick="more()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #222828;">Tell me more...</a></p>'); 
	inner("mediumInfo","<p style='border-bottom-width: 4px; border-bottom-style: solid; border-bottom-color: #222828; padding-top: 1.5rem; padding-bottom: 0.5rem;'>"+item.mediumInfo + "</p><p style='margin-top: 2rem; margin-bottom: 1rem; text-align: center;'>" + '<a type="button" class="btn btn-outline-danger btn-sm" onclick="less()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #222828;">Tell me less</a> or <a type="button" class="btn btn-outline-danger btn-sm" onclick="muchMore()" style="--bs-btn-padding-x: .5rem; --bs-btn-color: #222828;">Tell me even more...</a></p>'); 
	byId("longInfo").dataset['uri'] = item.longInfo
	currentValue = item.shortName
	prepareNavigationButtons(index)
}

function more() {
	hide("shortInfo") ;
	show("mediumInfo") ;
	hide("longInfo") ;
}
function less() {
	hide("mediumInfo") ;
	show("shortInfo") ;
	hide("longInfo") ;
}
function muchMore() {
	var uri = byId("longInfo").dataset['uri'];
	fetch(uri)
	.then(response => response.text())
	.then(data => {	
		inner("longInfoContent",data) ;
		hide("mainCard") ;
		show("longInfo") ;
		window.scrollTo(0,0)
	})
}
function hideLongInfo() {
	hide("mediumInfo") ;
	show("shortInfo") ;
	hide("longInfo") ;
	show("mainCard") ;
}

function createInfoTable(item) {
	inner("infoTable","",true) ;
	for (i in item.info) {
		if (item.info[i] !== null) {
			if(i == "Invention date"){
				var items = item.info[i].split(", ")
				var val = []
				for (j in items) {
					val.push('<a class="button" role="button" href="#" onclick="changeNarrative(\''+"Timeline"+'\',\''+items[j]+'\')">'+items[j]+'</a>')
				}
				inner("infoTable","<tr><th>"+i+"</th><td>"+val.join(", ")+"</td></tr>", false)
			}
			else if (narratives.includes(item.info[i])) {
				var items = item.info[i].split(", ")
				var val = []
				for (j in items) {
					val.push('<a class="button" role="button" href="#" onclick="changeNarrative(\''+item.info[i]+'\',\''+items[j]+'\')">'+items[j]+'</a>')
				}
			inner("infoTable","<tr><th>"+i+"</th><td>"+val.join(", ")+"</td></tr>", false)
			} else {
				inner("infoTable","<tr><th>"+i+"</th><td>"+item.info[i]+"</td></tr>", false)
			}
		}
	}
}
function prepareNavigationButtons(index) {
	if (index > 0) {
		byId("buttonPrevious").disabled = false
		byId("buttonPrevious").onclick = () => showInfo(index-1)
		byId("buttonPrevious").innerHTML = currentSelection[index-1].shortName		
	} else {
		byId("buttonPrevious").disabled = true
		byId("buttonPrevious").onclick = null
		byId("buttonPrevious").innerHTML = "--"
	}
	if (index < currentSelection.length-1) {
		byId("buttonNext").disabled = false
		byId("buttonNext").onclick = () => showInfo(index+1)
		byId("buttonNext").innerHTML = currentSelection[index+1].shortName
	} else {
		byId("buttonNext").disabled = true
		byId("buttonNext").onclick = null
		byId("buttonNext").innerHTML = "--"
	}
	inner('narrative', currentNarrative+": "+currentValue)
}

function changeNarrative(narrative,value) {
		currentNarrative = narrative
		currentValue = value
		inner('narrative', currentNarrative+": "+currentValue)
		prepareNarratives()
}

function byId(id) {
	return document.getElementById(id)
}

function show(id) {
	document.getElementById(id).classList.remove('d-none')
}

function hide(id) {
	document.getElementById(id).classList.add('d-none')
}

function inner(id,content, emptyFirst=true) {
	if(emptyFirst) document.getElementById(id).innerHTML = "" ; 
	document.getElementById(id).innerHTML += content ; 
}

function swapHeadersWithImages() {
	// Create an array of image URLs
	const images = [
		'img/icons/tag.png', // Replace with the actual URL for "Name"
		'img/icons/calendar.png', // Replace with the actual URL for "Invention date"
		'img/icons/location-pin.png', // Replace with the actual URL for "Invention place"
		'img/icons/settings.png' // Replace with the actual URL for "Type of device"
	];

	// Get all the elements in the table
	const headers = document.querySelectorAll('#infoTable th');

	// Loop through each header and replace text with image
	headers.forEach((header, index) => {
		if (images[index]) {
			const img = document.createElement('img');
			img.src = images[index];
			img.alt = header.innerText; // Set alt text for accessibility
			header.innerHTML = ''; // Clear the existing text
			header.appendChild(img); // Append the image
		}
	});
}
