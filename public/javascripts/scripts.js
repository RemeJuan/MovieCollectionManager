var modalDialog = document.getElementById('modal-dialog'),
	notification = document.getElementById('notification'),
	groupDetails = document.getElementById('group-details'),
	searchList = document.getElementById('searchList');

Array.prototype.contains = function ( aValidation ) {
   for (i in this) {
       if (this[i] === aValidation) return true;
   }
   return false;
}

function ajaxSearch(query) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if(xmlhttp.status == 200){
           	var response = JSON.parse(xmlhttp.responseText);
			console.log(response);
           }
           else if(xmlhttp.status == 400) {
              alert('There was an error 400')
           }
           else {
               alert('something else other than 200 was returned')
           }
        }
    }

    xmlhttp.open("GET", query, true);
    xmlhttp.send();
}


function toggleMenu () {
	var target = document.getElementById('menu'),
		classes = target.classList;
		
	if ( !classes.contains('open') ) {
		target.classList.add('open');
	} else {
		target.classList.remove('open');
	}

}

function deleteItem () {
	var target = document.getElementById('modal-dialog');
	target.classList.add('md-active');
}

function closeNotification() {
	var target = document.getElementById('notification');
	target.classList.remove('toast-active');
}

function closeModal() {
	var target = document.getElementById('modal-dialog');
	target.classList.remove('md-active');
}

function toggleCollectionPane (e) {
	var isChecked = e.checked ? 'remove' : 'add';

	groupDetails.classList[isChecked]('hidden');
}

function groupSearch (e) {
	var keyLength = e.value.length,
		searchPath = '/search-results/group-search/';

	if (keyLength >= 3) {
		ajaxSearch(searchPath + e.value);
	}
}

document.addEventListener("DOMContentLoaded", function(event) { 
	setTimeout(function() {
		closeNotification();
	}, 3000)
});
