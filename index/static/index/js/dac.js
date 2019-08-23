var key = true;
function viewComment(operator) {
	$(document).ready(function(){
		if(key==false){
			$('#'+operator+'reply').css('display', 'none');
			$('#'+operator).text('View comments');
			key = true;
		}else{
			$('#'+operator+'reply').css('display', 'block');
			$('#'+operator).text('Hide comments');
			key = false;
		}
	})
}

var key2 = true;
function editPost(operator){
	$(document).ready(function(){
		if(key2==false){
			$('#'+operator+'edit').css({
				display: 'none'
			});
			$('#'+operator+'text').css('display', 'block');
			$('#'+operator+'executor').text('Edit Post')
			key2 = true;
		}else{
			$('#'+operator+'edit').css('display', 'block');
			$('#'+operator+'edit').removeClass('reply');

			$('#'+operator+'text').css('display', 'none');
			$('#'+operator+'executor').text('Cancel')
			key2 = false;
		}
	})
}


$(document).ready(function(){
	$('#createEvent').on('click', function(event){
		event.preventDefault()
		$('#contactForm128').toggleClass('hide')
		$(this).toggleClass('hide')
	})

	$('#todo .newEventForm').on('click', function(){
		$('#todo #contactForm128').toggleClass('hide')
		$('#todo #createEvent').toggleClass('hide')
	})

	$('#todo').delegate('.editAccForm', 'click', function(){
		$(this).closest('form').toggleClass('hide');
	})

	$('#todo').delegate('.mylistContainer .pen', 'click', function(){
		var id = $(this).closest('h5').attr('class').replace('h5', '')
		$('#todo .mylistContainer .mylist #contactForm'+id).toggleClass('hide')
		$('#todo .mylistContainer .mylist .h5'+id).toggleClass('hide')
	})

	
	$('#todo').delegate('.mylistContainer .closePad', 'click', function(){
		$(this).closest('form').toggleClass('hide')
		var id = $(this).closest('form').attr('id').replace('contactForm', '')
		$('#todo .mylistContainer .mylist .h5'+id).toggleClass('hide')
	})

	// Toggle the search form at the nav bar
	$('.navbar-right .search').on('click', function(){
		$('.main_box .searchForm').toggleClass('hide')
	})

	$('.form-group .forgetpass').on('click', function(event){
		event.preventDefault();
		$('.col-lg-6 .forget-password').toggleClass('hide')
		$('.col-lg-6 .logmein').toggleClass('hide')
	})
	$('.form-group .log-in').on('click', function(event){
		event.preventDefault();
		$('.col-lg-6 .forget-password').toggleClass('hide')
		$('.col-lg-6 .logmein').toggleClass('hide')
	})

	$('.blog_area .postSearch').on('click', function(){
		$('.postSearchResult').toggleClass('hide')
	})

	$('.main_menu .searchForm').on('click', function(){
		$('.searchResult').toggleClass('hide')
	})
})
