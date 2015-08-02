var s,
YouSelect = {
	settings: {
		is_active: false,
		links: null,
		index: 0,
	},

	init: function (){
		s = this.settings;
		this.bindEvents();
	},

	bindEvents: function (){
		chrome.runtime.onMessage.addListener(this.deactivate);
		window.addEventListener("keyup",this.handle_key);
	},

	handle_key: function (event){
		if (s.is_active){
			switch (event.keyCode) {
				case (40): //down arrow
					YouSelect.select_link(1);
					break;
				case (38): //up arrow
					YouSelect.select_link(-1);
					break;
			}
		} else if (event.keyCode === 9) { // tab
			YouSelect.activate();
		}
	},

	activate: function() {
		s.is_active = true;
		this.cache_links();
		this.select_link();
	},

	deactivate: function() {
		s.is_active = false;
		s.links = null;
		s.index = 0;
	},

	cache_links: function(){
		var url_path = document.location.pathname;
		// s.links = document.querySelectorAll('.yt-lockup-content > h3 > a');
		switch (url_path) {
			case ('/'):
				s.links = document.querySelectorAll('.yt-lockup-content > h3 > a');
				break;
			case ('/results'):
				s.links = document.querySelectorAll('.yt-lockup-content > h3 > a');
				break;
			case ('/feed/subscriptions'):
				s.links = document.querySelectorAll('li > div > div.feed-item-dismissable > div.expanded-shelf > ul > li > div > div > div > div.yt-lockup-content > h3 > a');
				break;
		}
	},

	select_link: function(change){
		var temporary_index = (s.index + change) || 0;
		if (s.index%5 === 0){
			this.cache_links();
		}
		if(temporary_index >= 0 && temporary_index <= s.links.length - 1){
			this.deselect_link();
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
