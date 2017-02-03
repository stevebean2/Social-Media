
var index = 0;
var json_array;
var liked_array = [];

//Opening and extracting from json file
//parsing json data
function openJSON() {
	var url_input = "temp.json";
	var objex = new XMLHttpRequest();
	objex.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			json_array = JSON.parse(objex.responseText);
			console.log(json_array);
			displayData();
		}
	};
	objex.open("GET", url_input, true);
	objex.send();
}

function displayData() {
	//Delete previous display to make room for new one
	var delete_display = document.getElementById('mDisplay');
	if(delete_display != null)
	{
		delete_display.parentNode.removeChild(delete_display);
	}

	//Determine what elements are needed in UI
	var mainDisplay = document.createElement('div');
	var main_div = document.getElementById("main_div");
	var posted_by = document.createElement('p');
	var sm_source = document.createElement('p');
	var post_content = document.createElement('p');
	var num_likes = document.createElement('p');
	var num_comms = document.createElement('p');
	var comment = document.createElement('input');
	var comment_button = document.createElement('button');
	var like = document.createElement('button');
	var bottom_div = document.createElement('div');
	
	//Define classes/id's
	mainDisplay.className = "SMdisplay";
	mainDisplay.id = "mDisplay";
	posted_by.className = "innerDisplay";
	sm_source.className = "innerDisplay";
	post_content.className = "innerDisplay";
	num_likes.className = "bottomDisplay";
	num_comms.className = "bottomDisplay";
	comment.className = "bottomDisplay";
	comment.id = "inputText";
	comment_button.className = "bottomDisplay";
	like.className = "bottomDisplay";	
	bottom_div.id = "bottomDiv";

	//Determine SM Source and fill elements with content
	var sm_platform = /(facebook|twitter|tumblr|instagram)/.exec(json_array[index].actor_url);
	posted_by.innerHTML = "Posted By: " + json_array[index].actor_username;
	sm_source.innerHTML = "Social Media Source: " + sm_platform[1];
	post_content.innerHTML = "Message: " + json_array[index].activity_message;
	num_likes.innerHTML = json_array[index].activity_likes + " likes";
	num_comms.innerHTML = json_array[index].activity_comments + " comments";
	comment.placeholder = "Comment";
	comment_button.innerHTML = "Comment";
	if(liked_array[index] != 'y'){
		like.innerHTML = "Like";
	}
	else {
		like.innerHTML = "Unlike";
	}
	

	//Define buttons
	comment_button.setAttribute("onclick","postComment()");
	like.setAttribute("onclick","likePost()");

	//Append all newly created elements to the UI
	main_div.appendChild(mainDisplay);
	mainDisplay.appendChild(posted_by);
	mainDisplay.appendChild(sm_source);
	mainDisplay.appendChild(post_content);

	//If a picture is included
	if(determinePostType()){ 
		var post_content2 = document.createElement('img'); 
		post_content2.className = "innerDisplay";
		post_content2.id = "shrinkContent";
		post_content2.src = json_array[index].activity_attachment;
		mainDisplay.appendChild(post_content2);
	}

	//Append all bottom elements 
	mainDisplay.appendChild(bottom_div)
	bottom_div.appendChild(num_likes);
	bottom_div.appendChild(like);
	bottom_div.appendChild(comment);
	bottom_div.appendChild(comment_button);
	bottom_div.appendChild(num_comms);
}

//determine if a picture is included or not
function determinePostType() {
	if(json_array[index].activity_attachment != null)
	{
		return 1;
	}
	return 0;
}

//Go to next or previous post (controlled by buttons)
function newPost(type) {
	if(type == 'n' && index < json_array.length-1) {
		index++;
		displayData();
	}
	else if(type == 'p' && index > 0) {
		index--;
		displayData();
	}
}

//adds a like to the post in the json_array
function likePost() {
	if(liked_array[index] != 'y') {
		json_array[index].activity_likes++;
		liked_array[index] = 'y';
	}
	else{
		json_array[index].activity_likes--;
		liked_array[index] = 'n'
	}
	displayData();
}

//adds to the number of comments a post has in the json_array
function postComment() {
	comment_field = document.getElementById('inputText');
	if(comment_field.value != "") {
		json_array[index].activity_comments++;
		displayData();
	}
}

//download a copy of the most up-to-date JSON String
function downloadJSON() {
	json_string = stringJSON();
	uri_content = "data:application/octet-stream," + encodeURIComponent(json_string);
	download_window = window.open(uri_content, "new_json_file");
}

//turn json_array into JSON notation
function stringJSON() {
	return JSON.stringify(json_array);
}