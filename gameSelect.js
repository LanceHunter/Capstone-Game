$(document).ready(function() {
	$( '.arms' ).draggable();

	$('.arms').click(function() {
    $(this).css('background-color', 'red');
	});
});
