/*
* Module Dependencies
*/

var $ = require('jquery');

$(function(){
	var template = "";
	var tvShowContainer = $("#app-body").find(".tv-shows");

	function renderShow(shows) {
		tvShowContainer.find(".loader").remove();
		template = '<article class="tv-show">' +
						'<div class="left img-container">' +
							'<img src=":img:" alt=":img alt:">' +
						'</div>' +
						'<div class="right info">' +
							'<h1>:name:</h1>' +
							'<p>:summary:</p>' +
							'<button class="like">✴</button>' +
				   '</article>';

	    shows.forEach(function (show) {
	    	var article = template
	    		.replace(":name:", show.name)
				.replace(":img:", show.image ? show.image.medium : "")
				.replace(":summary:", show.summary)
				.replace(":img alt:", show.name + " Logo");

			var $article = $(article);

			tvShowContainer.append($article.fadeIn(2000));
		});
	}

	if (!localStorage.shows) {
		$.ajax("http://api.tvmaze.com/shows")
			.then(function(shows) {
				localStorage.shows = JSON.stringify(shows);
				renderShow(shows);
			});
	} else {
		renderShow(JSON.parse(localStorage.shows));
	}
		

	$("#app-body").find("form").submit(function (ev) {
		ev.preventDefault();

		var busqueda;
		var $loader = $('<div class="loader">');

		busqueda = $(this).find("input[type='text']").val();

		tvShowContainer.find(".tv-show").remove();
		$loader.appendTo(tvShowContainer);

		$.ajax({
			url: "http://api.tvmaze.com/search/shows",
			data: {q: busqueda},
			success: function(res, textStatus, xhr) {
				$loader.remove();
				var shows = res.map(function(el) {
					return el.show;
				});
				renderShow(shows);
			}
		});
	});

		
	tvShowContainer.on("click", "button.like", function (ev) {
		var $this = $(this);
		$this.closest(".tv-show").toggleClass("liked");
	});

})