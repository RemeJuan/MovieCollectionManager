var modalDialog = document.getElementById('modal-dialog'),
	notification = document.getElementById('notification');

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
	modalDialog.classList.add('md-active');
}

function closeNotification() {
	notification.classList.remove('toast-active');
}

function closeModal() {
	modalDialog.classList.remove('md-active');
}

document.addEventListener("DOMContentLoaded", function(event) { 
	setTimeout(function() {
		closeNotification();
	}, 3000)
});