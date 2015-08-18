function toggleMenu () {
	$('#menu').slideToggle(350);
}

function deleteItem (e) {
	$('#modal-dialog').addClass('md-active');
}

$('#modal-cancel').on('click', function () {
	$('#modal-dialog').removeClass('md-active');
});