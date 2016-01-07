// alert('Hola Platzi');
(function (window, document, $, undefined) {
	(function(){
		return index = {
			template: "",
			tvShowContainer: $("#app-body").find(".tv-shows"),

			init: function() {
				this.cargarShows();
				this.buscarShow();
				this.liked();
			},

			cargarShows: function() {
				var self = this;

				if (!localStorage.shows) {
					$.ajax("http://api.tvmaze.com/shows")
						.then(function(shows) {
							localStorage.shows = JSON.stringify(shows);
							self.renderShow(shows);
					});
					} else {
						self.renderShow(JSON.parse(localStorage.shows));
					}
					
			},

			buscarShow: function(){
				var self = this;
				var busqueda;
				var $loader = $('<div class="loader">');

				$("#app-body")
					.find("form")
					.submit(function (ev){
						ev.preventDefault();
						
						busqueda = $(this)
							.find("input[type='text']")
							.val();

						self.tvShowContainer.find(".tv-show").remove();
						$loader.appendTo(self.tvShowContainer);

						$.ajax({
							url: "http://api.tvmaze.com/search/shows",
							data: {q: busqueda},
							success: function(res, textStatus, xhr) {
								$loader.remove();
								var shows = res.map(function(el) {
									return el.show;
								});
								self.renderShow(shows);
							}
						});
					});
			},

			renderShow: function(shows){
				var self = this;

				self.tvShowContainer.find(".loader").remove();
				self.template = '<article class="tv-show">' +
									'<div class="left img-container">' +
										'<img src=":img:" alt=":img alt:">' +
									'</div>' +
									'<div class="right info">' +
										'<h1>:name:</h1>' +
										'<p>:summary:</p>' +
										'<button class="like">✴</button>' +
 								'</article>';

				shows.forEach(function (show) {
					var article = self.template
						.replace(":name:", show.name)
						.replace(":img:", show.image ? show.image.medium : "")
						.replace(":summary:", show.summary)
						.replace(":img alt:", show.name + " Logo");

						var $article = $(article);

						self.tvShowContainer.append($article.fadeIn(2000));
				});
			},

			liked: function (){
				var self = this;

				self.tvShowContainer.on("click", "button.like", function (ev) {
					var $this = $(this);
					$this.closest(".tv-show").toggleClass("liked");
				});
			}
		}
	})();
	index.init();
})(window, document, jQuery);