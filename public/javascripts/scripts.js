function toggleMenu () {
	$('#menu').slideToggle(350);
}

function deleteItem () {
	$('#modal-dialog').addClass('md-active');
}

function closeNotification() {
	$('.md-toast').removeClass('toast-active');
}

$('#modal-cancel').on('click', function () {
	$('#modal-dialog').removeClass('md-active');
});

$(document).ready(function() {
	setTimeout(function() {
		$('.md-toast').removeClass('toast-active');
	}, 3000)
});