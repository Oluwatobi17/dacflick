function showMessage(message, msgType){
	$('.messagelist .dacMsg').text(message)
	$('.messagelist .dacMsg').show(100)
	if(msgType=='error'){
		$('.messagelist .dacMsg').addClass('error')
		$('.messagelist .dacMsg').removeClass('success')
	}else{
		$('.messagelist .dacMsg').addClass('success')
		$('.messagelist .dacMsg').removeClass('error')
	}
	setTimeout(5000, function(){
		$('.messagelist .dacMsg').hide(100)
	})
}

$(document).ready(function(){
	var customTags = [ '<%', '%>' ];
// alert('Money on my mind, I am going to be mavelously rich soon')
	$('.media-body').delegate('.fellowship','click', function(event){
		event.preventDefault();
		action = $(this).data('action')
		username = $(this).data('username')
		var self = $('.media-body .fellowship.'+username)

		$.ajax({
			url: '/api/fellowship/'+action+'/'+username,
			method: 'GET',
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}else{
					if(action=='follow'){
						self.data('action', 'unfollow')
						self.text('Unfollow')
						var newFollowingTemplate = $('#followingTemplate').html()
						var dt = new Date()
						
						Templatedata = {
							username: username,
							profilePics: data,
							date: dt.toDateString()+', '+dt.toLocaleTimeString()
						}
						$('#follower .following .comment_list').after(Mustache.render(newFollowingTemplate, Templatedata))
					}else{
						self.data('action', 'follow')
						self.text('Follow')
						$('#follower .following .media-body .fellowship.'+username).closest('.review_item').remove()
					}
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})

	})

	$('#review').delegate('.delpost', 'click', function(){
		var self = $(this)
		if(confirm('Do you want to delete this post?')){
			$.ajax({
				url: '/api/deletepost/'+$(this).data('id'),
				method: 'GET',
				success: function(data){
					if(!data){
						showMessage('Error connecting to the server', 'error')
						alert('Sorry, an error occured')
						return;
					}
					$('.col-lg-6 .postCount').text( parseInt($('.col-lg-6 .postCount').text())-1 )
					self.closest('.comment_list').toggle(100);
				},
				error: function(err){
					showMessage('Error connecting to the server', 'error')
					console.log(err)
				}
			})
		}
	})

	// Favour or unfavour a post on my profile
	$('.media-body').delegate('.favouring','click', function(event){
		event.preventDefault()
		action = $(this).data('action')
		var self = $(this)
		$.ajax({
			url: '/api/favouring/'+action+'/'+$(this).data('postid'),
			method: 'GET',
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
				}

				if(action=='unfavour'){
					self.closest('.review_box').toggle(100, function(){
						$('.favCount').text( parseInt($('.favCount').text())-1 )
					})
					self.closest('.makeblack').css('color', 'black')
					self.closest('i').data('action', 'favour')
				}else{
					self.closest('.makeblack').css('color', 'blue')
					self.closest('i').data('action', 'unfavour')
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})
	// Favour or unfavour a post on someone's profile
	$('.media-body').delegate('.Sinfavouring','click', function(){
		action = $(this).data('action')
		var self = $(this)
		$.ajax({
			url: '/api/favouring/'+action+'/'+$(this).data('postid'),
			method: 'GET',
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}else{
					if(action=='favour'){
						self.data('action', 'unfavour')
						self.text('Remove')
					}else{
						self.data('action', 'favour')
						self.text('Favour')
					}
					// if(action=='unfavour'){
					// 	self.closest('.review_box').toggle(100, function(){
					// 		$('.favCount').text( parseInt($('.favCount').text())-1 )
					// 	})
					// }
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})

	})

	// Create new wall post
	$('#myTabContent').delegate('#contactForm7', 'submit', function(){
		$.ajax({
			url: '/api/mywall/',
			method: 'POST',
			data: {
				'body': $('#message5').val(),
				'user': $('#user').val(),
				'writer': parseInt($('#wall_writer').val()),
				'csrfmiddlewaretoken': $('#myTabContent #mywalltoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}

				console.log(data)
				var newWallTemplate = $('#newWallPostTemplate').html();

				// Formatting the server returned date
				var dt = new Date(data.date)
				data.date = dt.toDateString()+', '+dt.toLocaleTimeString()

				// Increasing the total number of wall count
				$('#wallcount').text( parseInt($('#wallcount').text())+1 )
				$('#message5').val('')
				$('#wall .newWallTemplateClass').after(Mustache.render(newWallTemplate, data, customTags))
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handles the wall reply
	$('#myTabContent').delegate('.wallreply', 'submit', function(){
		var wallid = $(this).data('identify')
		var id = wallid.replace('replywallform', '')
		$.ajax({
			url: '/api/replywall/',
			method: 'POST',
			data: {
				'body': $('#myTabContent .wallreply #'+id+'wallreplybody').val(),
				'wall': id,
				'writer': $('#myTabContent .wallreply #'+id+'reply_writer').val(),
				'csrfmiddlewaretoken': $('#myTabContent #mywalltoken').text()
			},

			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}

				var newWallTemplate = $('#newWallPostTemplate').html();
				var dt = new Date(data.date)
				data.date = dt.toDateString()+', '+dt.toLocaleTimeString()
				
				// new number of commnent
				num = parseInt($('#'+id+'reply .commentCount').text()) + 1
				$('#'+id+'reply .commentCount').text(num)

				// Empty the text box
				$('#myTabContent .wallreply #'+id+'wallreplybody').val('')

				var newWallReplyTemplate = $('#wallReplyTemplate').html();
				$('#'+id+'reply .nocomment').remove(); // Remove the 'No comment yet'

				$('#myTabContent #'+id+'reply .wallreplycontainer').append(Mustache.render(newWallReplyTemplate, data))
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Editing post
	$('#review').delegate('.editpostform', 'submit', function(){
		var postid = $(this).data('postid')

		$.ajax({
			url: '/api/editpost/'+$(this).data('postid')+'/',
			method: 'POST',
			data: {
				'title': $('#review .comment_list #'+postid+'edit #'+postid+'postTitle').val(),
				'body': $('#review .comment_list #'+postid+'edit #'+postid+'postBody').val(),
				'postType': $('#review .comment_list #'+postid+'edit #'+postid+'postType').val(),
				'category':$('#review .comment_list #'+postid+'edit #'+postid+'postCategory').val(),
				'csrfmiddlewaretoken': $('#review .editposttoken')[0].innerHTML
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}
				// Editing the content
				typeCat = data.postType+' ('+data.category+')'
				$('#review .comment_list #'+postid+'title').text(data.title)
				$('#review .comment_list #'+postid+'text').text(data.body)
				$('#review .comment_list #'+postid+'type').text(typeCat)

				$('#'+postid+'edit').css('display', 'none');
				$('#'+postid+'text').css('display', 'block');

				$('#review .media-body #'+postid+'executor').text('Edit Post')
				
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	$('#review').delegate('#contactForm6', 'submit', function(){
		$.ajax({
			url: '/api/addpost/',
			method: 'POST',
			data: {
				'title': $('#review #title4').val(),
				'body': $('#review #body4').val(),
				'postType': $('#review #type6').val(),
				'category': $('#review #cat3').val(),
				'user': $('#review #userid').val(),
				'csrfmiddlewaretoken': $('#review #addposttoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}
				console.log(data)
				var postTemplate = $('#newPostTemplate').html();
				var dt = new Date(data.date)
				data.date = dt.toDateString()+', '+dt.toLocaleTimeString()

				$('#review .newPostTemplateclass').after(Mustache.render(postTemplate, data))
				$('.col-lg-6 .postCount').text( parseInt($('.col-lg-6 .postCount').text())+1 )

				$('#review #title4').val('')
				$('#review #body4').val('')
				$('#review #type6').val('')
				$('#review #cat3').val('')
				$('#review .nopost').remove()
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handle commenting on your own post in Post(review) tab
	$('#review').delegate('.postcomment', 'submit', function(){
		var postid = $(this).data('postid')
		// var $self = $(this).closest('.postcommentClass')
		$.ajax({
			url: '/api/commentpost/',
			method: 'POST',
			data: {
				'targetpost': $('#review #'+postid+'targetpost').val(),
				'body': $('#review #'+postid+'commentbody').val(),
				'author': $('#review #'+postid+'author').val(),
				'csrfmiddlewaretoken': $('#postcommenttoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}
				console.log(data)

				var postcomTemplate = $('#postCommentTemplate').html();
				var dt = new Date(data.comDate)
				data.comDate = dt.toDateString()+', '+dt.toLocaleTimeString()

				$('#review #'+postid+'reply .postcommentClass').append(Mustache.render(postcomTemplate, data))
				// $self.append(Mustache.render(postcomTemplate, data))

				$('#review .reply#'+postid+'reply .postCommentCount').text( parseInt($('#review #'+postid+'reply .postCommentCount').text())+1 )

				$('#review #'+postid+'commentbody').val('')

			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handle commenting of post in favourite(contact) tab
	$('#contact').delegate('.favourComment', 'submit', function(){
		var postid = $(this).data('postid')
		// var $self = $(this).closest('.postcommentClass')
		$.ajax({
			url: '/api/commentpost/',
			method: 'POST',
			data: {
				'targetpost': $('#contact #'+postid+'favtargetpost').val(),
				'body': $('#contact #'+postid+'favcommentbody').val(),
				'author': $('#contact #'+postid+'favauthor').val(),
				'csrfmiddlewaretoken': $('#favourcommenttoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}
				var postcomTemplate = $('#postCommentTemplate').html();
				var dt = new Date()
				data.comDate = dt.toDateString()+', '+dt.toLocaleTimeString()

				$('#contact #2'+postid+'reply .favouredpostClass').append(Mustache.render(postcomTemplate, data))
				// $self.append(Mustache.render(postcomTemplate, data))

				$('#contact .reply#2'+postid+'reply .favpostCount').text( parseInt($('#contact .reply#2'+postid+'reply .favpostCount').text())+1 )

				$('#contact #'+postid+'favcommentbody').val('')
				// $('#contact .reply#2'+postid+' .favNocomment').remove()
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})
	// Handle liking of someone's page
	$('.s_product_inner').delegate('.card_area', 'click', function(event){
		event.preventDefault();
		username = $('.s_product_inner .card_area .lnr-diamond').data('username')
		$.ajax({
			url: '/api/likepage/'+username,
			success: function(data){
				var info = "You liked "+username+"'s page"
				if(data==info){
					showMessage(data, 'success')
					$('.s_product_inner .card_area span').text( parseInt($('.s_product_inner .card_area span').text())+1 )
					return;
				}
				showMessage(data, 'error')
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handles postcomment on a single post display
	$('.newsletter_widget').delegate('.postcomment', 'submit', function(){
		var postid = $(this).data('postid')
		// var $self = $(this).closest('.postcommentClass')
		$.ajax({
			url: '/api/commentpost/',
			method: 'POST',
			data: {
				'targetpost': $('.postcomment #'+postid+'targetpost').val(),
				'body': $('.postcomment #'+postid+'commentbody').val(),
				'author': $('.postcomment #'+postid+'author').val(),
				'csrfmiddlewaretoken': $('#postcommenttoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					return;
				}
				console.log(data)

				var postcomTemplate = $('#postCommentTemplate').html();
				var dt = new Date(data.comDate)
				data.comDate = dt.toDateString()+', '+dt.toLocaleTimeString()

				$('.postcommentClass').after(Mustache.render(postcomTemplate, data))

				$('.comments-area .postCommentCount').text( parseInt($('.comments-area .postCommentCount').text())+1 )

				$('.postcomment #'+postid+'commentbody').val('')
				$('.singleNoComment').remove()

			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})


	// Handles username search at the nav bar
	$('.searchForm').on('submit', function(){
		var image = "<div class='center'><img src='/static/index/img/loading.gif' class='loadingImg'></div>"
		$('.searchResult').html(image)
		$.ajax({
			url: '/api/searchUsername/',
			method: 'POST',
			data: {
				'username': $('.searchForm #searchText').val(),
				'csrfmiddlewaretoken': $('.main_menu #searchToken').text()
			},

			success: function(data){
				$('.searchResult').removeClass('hide')
				$('.searchResult').html('')
				if(!data){
					$('.searchResult').html("<div class='center'>No result found</div>")
				}else{
					var newSearchResultTemplate = $('#searchResultTemplate').html();
					for(var i=0;i<data.length;i++){
						$('.searchResult').append(Mustache.render(newSearchResultTemplate, data[i]))
					}
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})


	// Handle post search by title
	$('.blog_area .postSearch').on('submit', function(){
		var image = "<div class='center'><img src='/static/index/img/loading.gif' class='loadingImg'></div>"
		$('.postSearchResult').html(image)
		$.ajax({
			url: '/api/searchPost/',
			method: 'POST',
			data: {
				'title': $('.blog_area .postSearch .form-control').val(),
				'csrfmiddlewaretoken': $('.blog_area .postSearch p').text()
			},

			success: function(data){
				$('.postSearchResult').removeClass('hide')
				$('.postSearchResult').html('')
				if(!data){
					$('.postSearchResult').html("<div class='center'>No result found</div>")
				}else{
					var newSearchResultTemplate = $('#postSearchResultTemplate').html();
					for(var i=0;i<data.length;i++){
						$('.postSearchResult').append(Mustache.render(newSearchResultTemplate, data[i]))
					}
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handle deleting an Event
	$('#todo').delegate('.delEvent','click', function(){
		if(confirm('Do you want to delete this event?')){
			var id = $(this).data('id')
			$.ajax({
				url: '/api/deleteEvent/'+id,
				method: 'GET',
				success: function(data){
					if(!data){
						showMessage('Error connecting to the server', 'error')
						alert('Sorry, an error occured')
						return;
					}

					$('#todo #event'+id).remove();
				},
				error: function(err){
					showMessage('Error connecting to the server', 'error')
					console.log(err)
				}
			})
		}
	})

	// Handle deleting a Todo
	$('#todo').delegate('.delTodo','click', function(){
		if(confirm('Do you want to delete this to-do?')){
			var id = $(this).data('id')
			$.ajax({
				url: '/api/deltodotask/'+id,
				method: 'GET',
				success: function(data){
					if(!data){
						showMessage('Error connecting to the server', 'error')
						alert('Sorry, an error occured')
						return;
					}

					$('#todo .h5'+id).remove();
				},
				error: function(err){
					showMessage('Error connecting to the server', 'error')
					console.log(err)
				}
			})
		}
	})

	// Handling creating of new event
	$('#todo #contactForm128').on('submit', function(){
		// $('#todo #contactForm128').off('submit', function(){ alert('This shit has been off') })
		title = $('#todo #contactForm128 #newEventTitle').val()
		$.ajax({
			url: '/api/createEvent/',
			method: 'POST',
			data: {
				'title': title,
				'user': parseInt($('#wall_writer').val()),
				'csrfmiddlewaretoken': $('#todo #neweventtoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;
				}
				if( $('#todo .mylistContainer .currentEvent').text() ){
					newRecent = {
						'title': $('#todo .mylistContainer .currentEvent').text(),
						'id': $('#todo .mylistContainer .currentEvent').data('id')
					}

					$('#todo .currentEvent').data('id', data)

					var newEventTemplate = $('#newRecentTemplate').html();

					$('#todo .comment_list h5').remove()
					$('#todo .newRecentContainer').before(Mustache.render(newEventTemplate, newRecent))
					
				}
				$('#todo .mylistContainer .currentEvent').data('id', data)
				$('#todo #contactForm128 #newEventTitle').val('')
				$('#todo .mylistContainer .currentEvent').text(title)
				$('#todo .mylistContainer .mylist').html('')
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handling creating of new task
	$('#todo #contactForm198').on('submit', function(){
		if(!$('#todo .currentEvent').data('id')){
			alert('Create an event before you add tasks')
			return;
		}
		$.ajax({
			url: '/api/addtodotask/',
			method: 'POST',
			data: {
				'event': parseInt($('#todo .currentEvent').data('id')),
				'task': $('#todo #newtaskText').val(),
				'csrfmiddlewaretoken': $('#todo #mytodotoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;
				}
				$('#todo #newtaskText').val('')
				
				var newTodoTemplate = $('#newTodotaskTemplate').html();
				$('#todo .mylistContainer .mylist').append(Mustache.render(newTodoTemplate, data))
				$('#todo .review_box .notask').remove()
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handles the view-all button of the to-do
	$('#todo .col-md-12 .view_all').on('click', function(){
		$.ajax({
			url: '/api/viewallevents/',
			method: 'GET',
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;
				}

				var newEventTemplate = $('#newRecentTemplate').html();
				$('#todo .comment_list .review_item').html('')
				$('#todo .comment_list h5').remove()
				for(var i=1;i<data.length;i++){
					$('#todo .newRecentContainer').append(Mustache.render(newEventTemplate, data[i]))
				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handles editing of todo task
	$('#todo').delegate('.mylistContainer .mylist form','submit', function(){
		var id = $(this).attr('id').replace('contactForm','')
		var self = $(this)
		var task = $('#todo #newtask'+id).val()
		if(!task){
			alert('Please state the new task')
			return;
		}
		$.ajax({
			url: '/api/edittask/'+id+'/',
			method: 'POST',
			data: {
				'task': task,
				'csrfmiddlewaretoken': $('#todo #mytodotoken').text()
			},
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;
				}
				$('#todo .mylistContainer .mytsk'+id).text(task)
				$('#todo .mylistContainer .mylist .h5'+id).toggleClass('hide')
				$('#todo .mylistContainer .mylist #contactForm'+id).toggleClass('hide')
				
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})

	// Handles checking of Todo task
	$('#todo').delegate('.review_box .checkTodo','click', function(){
		var self = $(this)
		$.ajax({
			url: '/api/checktodotask/'+$(this).data('id'),
			method: 'GET',
			success: function(data){
				if(!data){
					$(this).attr('checked', !$(this).attr('checked'))
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;

				}
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
				self.removeAttr('checked')
			}
		})
	})

	// Handle deleting an Event
	$('#todo').delegate('.comment_list .todoevent','click', function(e){
		e.preventDefault()
		var id = $(this).data('id')
		var self = $(this)
		$.ajax({
			url: '/api/gettasks/'+id,
			method: 'GET',
			success: function(data){
				if(!data){
					showMessage('Error connecting to the server', 'error')
					alert('Sorry, an error occured')
					return;
				}

				var newRecent = {
					'title': $('#todo .mylistContainer .currentEvent').text(),
					'id': $('#todo .mylistContainer .currentEvent').data('id')
				}
				$('#todo .comment_list h5').remove()
				$('#todo .newRecentContainer').before(Mustache.render($('#newRecentTemplate').html(), newRecent))

				var newTodoTemplate = $('#newTodotaskTemplate').html();
				$('#todo .mylistContainer .mylist').html('')

				$('#todo .mylistContainer .currentEvent').data('id',id)
				$('#todo .mylistContainer .currentEvent').text( self.text())
				for(var i=0;i<data.length;i++){
					$('#todo .mylistContainer .mylist').append(Mustache.render(newTodoTemplate, data[i]))
					$('#todo .mylistContainer .mylist .h5'+data[i].id+' .checkTodo').prop('checked', data[i].done)
				}
				$('#todo #event'+id).remove() //Remove the selected task from recent list
				if(data.length==0){
					$('#todo .review_box .mylist').html('')
					$('#todo .review_box .notask').remove()
					$('#todo .review_box').append('<h5 class="notask">No tasks yet</h5>')
					return;
				}
				$('#todo .review_box .notask').remove()
			},
			error: function(err){
				showMessage('Error connecting to the server', 'error')
				console.log(err)
			}
		})
	})
})
