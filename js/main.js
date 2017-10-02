/*
	Author: Steven Weng
	Created on: 2017-10-02
	Depends: jQuery 1.9.0
*/

const mainController = (function(global) {
	const bootstrap = () => {
		let currentTab = localStorage.getItem('currentTab') || 'needPrepare'
		showList(currentTab)
		registerEvents()
	}

	const registerEvents = () => {
		$('.top-list-title').on('click', (e) => {
			let target = $(e.target)
			showList(target.data('name'))
		})
	}

	const showList = (currentTab) => {
		$('.top-list-title').not(`[data-name=${currentTab}]`).removeClass('active')
		$('.top-list-title').filter(`[data-name=${currentTab}]`).addClass('active')
		$('.body-container').not(`[name=${currentTab}]`).hide()
		$('.body-container').filter(`[name=${currentTab}]`).show()
		localStorage.setItem('currentTab', currentTab)
		bootList(currentTab)
	}

	const bootList = (currentTab) => {
		switch (currentTab) {
		case 'needPrepare':
			needPreparationListController.bootstrap()
			break
		case 'prepared':
			break
		case 'packages':
			break
		}
	}

	return {
		bootstrap
	}
})(window)
