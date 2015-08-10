var s,
YouSelect = {
	settings: {
		is_active: false,
		links: null,
		index: 0,
	},

	init: function (){
		self = this;
		s = self.settings;
		self.bindEvents();
	},

	bindEvents: function (){
		chrome.runtime.onMessage.addListener(self.deactivate);
		window.addEventListener("keyup",self.handle_key);
	},

	handle_key: function (event){
		if (s.is_active){
			switch (event.keyCode) {
				case (40): //down arrow
					self.select_link(1);
					break;
				case (38): //up arrow
					self.select_link(-1);
					break;
			}
		} else if (event.keyCode === 9) { // tab
			self.activate();
		}
	},

	activate: function() {
		s.is_active = true;
		self.cache_links();
		self.select_link();
	},

	deactivate: function() {
		s.is_active = false;
		s.links = null;
		s.index = 0;
	},

	cache_links: function(){
		var url_path = document.location.pathname;

		var cases = {};
		cases['/'] = '.yt-lockup-content > h3 > a';
		cases['/results'] = '.yt-lockup-content > h3 > a';
		cases['/user'] = 'div.feed-item-dismissable > div > div > div > div.lohp-newspaper-shelf.shelf-item.vve-check.yt-section-hover-container > div > div.lohp-large-shelf-container > div > div.vve-check > a';
		cases['/watch'] = 'div.content-wrapper > a > span.title';
		cases['/feed/subscriptions'] = 'li > div > div.feed-item-dismissable > div.expanded-shelf > ul > li > div > div > div > div.yt-lockup-content > h3 > a';
		if (s.cases[url_path]){
			s.links = document.querySelectorAll(s.cases[url_path]);
		}

	},

	select_link: function(change){
		var temporary_index = (s.index + change) || 0;
		if (s.index%5 === 0){
			self.cache_links();
		}
		if(temporary_index >= 0 && temporary_index <= s.links.length - 1){
			self.deselect_link();
			s.index = temporary_index;
			if (s.links[s.index]){
				s.links[s.index].id = 'youSelect';
				s.links[s.index].focus();
			}
		}
	},
	deselect_link: function() {
		if (s.links[s.index]){
			s.links[s.index].removeAttribute('id');
		}
	}
};

(function(){
	YouSelect.init();
})();
