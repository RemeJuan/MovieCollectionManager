Array.prototype.contains = function ( aValidation ) {
   for (i in this) {
       if (this[i] === aValidation) return true;
   }
   return false;
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

document.addEventListener("DOMContentLoaded", function(event) { 
	setTimeout(function() {
		closeNotification();
	}, 3000)
});
