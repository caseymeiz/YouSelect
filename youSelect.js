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
				case (40): // down arrow
				case (74): // j
					self.select_link(1);
					break;
				case (38): // up arrow
				case (75): // k
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
		var path_name = document.location.pathname;
		var selector;

		switch (path_name) {
			case ('/'):
			case ('/results'):
				selector = '.yt-lockup-content > h3 > a';
				break;
			case ('/feed/subscriptions'):
				selector = 'li > div > div.feed-item-dismissable > div.expanded-shelf > ul > li > div > div > div > div.yt-lockup-content > h3 > a';
				break;
			default:
				console.log('unknown pathname: '+path_name);
		}
		s.links = document.querySelectorAll(selector);
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
